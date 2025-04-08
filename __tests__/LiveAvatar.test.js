import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import LiveAvatar from '../app/components/LiveAvatar'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock WebSocket
class MockWebSocket {
  constructor(url) {
    this.url = url
    this.readyState = WebSocket.CONNECTING
    this.CONNECTING = WebSocket.CONNECTING
    this.OPEN = WebSocket.OPEN
    this.CLOSED = WebSocket.CLOSED
  }

  send = jest.fn()
  close = jest.fn()
}

// Mock RTCPeerConnection
class MockRTCPeerConnection {
  constructor(config) {
    this.config = config
    this.ontrack = null
    this.onicecandidate = null
    this.localDescription = null
    this.remoteDescription = null
  }

  setLocalDescription = jest.fn().mockResolvedValue(undefined)
  setRemoteDescription = jest.fn().mockResolvedValue(undefined)
  createAnswer = jest.fn().mockResolvedValue({ type: 'answer', sdp: 'mock-sdp' })
  addIceCandidate = jest.fn().mockResolvedValue(undefined)
  close = jest.fn()
}

describe('LiveAvatar', () => {
  let mockWebSocket
  let mockRTCPeerConnection

  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 'test-id', session_id: 'test-session' }),
      })
    )

    // Mock WebSocket
    mockWebSocket = new MockWebSocket('wss://test.com')
    global.WebSocket = jest.fn(() => mockWebSocket)

    // Mock RTCPeerConnection
    mockRTCPeerConnection = new MockRTCPeerConnection()
    global.RTCPeerConnection = jest.fn(() => mockRTCPeerConnection)
    global.RTCSessionDescription = jest.fn((desc) => desc)
    global.RTCIceCandidate = jest.fn((candidate) => candidate)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should handle user input and AI responses', async () => {
    await act(async () => {
      render(<LiveAvatar />)
    })

    // Simulate successful connection
    await act(async () => {
      mockWebSocket.readyState = WebSocket.OPEN
      mockWebSocket.onopen?.()
    })

    // Find and interact with input
    const input = screen.getByPlaceholderText('Type your message...')
    const sendButton = screen.getByText('Send')

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Hello AI' } })
      fireEvent.click(sendButton)
    })

    // Verify message was sent
    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify({ type: 'chat', data: { text: 'Hello AI' } })
    )

    // Simulate AI response
    await act(async () => {
      mockWebSocket.onmessage?.({
        data: JSON.stringify({
          type: 'chat',
          data: { text: 'Hello! How can I help you today?' },
        }),
      })
    })

    // Verify messages are displayed
    expect(screen.getByText('Hello AI')).toBeInTheDocument()
    expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument()
  })

  it('should handle WebRTC offer', async () => {
    await act(async () => {
      render(<LiveAvatar />)
    })

    // Simulate successful connection
    await act(async () => {
      mockWebSocket.readyState = WebSocket.OPEN
      mockWebSocket.onopen?.()
    })

    // Simulate ready message
    await act(async () => {
      mockWebSocket.onmessage?.({
        data: JSON.stringify({ type: 'ready' }),
      })
    })

    // Simulate offer
    const mockOffer = { type: 'offer', sdp: 'mock-sdp' }
    await act(async () => {
      mockWebSocket.onmessage?.({
        data: JSON.stringify({ type: 'offer', data: mockOffer }),
      })
    })

    // Verify RTCPeerConnection methods were called
    expect(mockRTCPeerConnection.setRemoteDescription).toHaveBeenCalled()
    expect(mockRTCPeerConnection.createAnswer).toHaveBeenCalled()
    expect(mockRTCPeerConnection.setLocalDescription).toHaveBeenCalled()
  })

  it('should handle connection errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('Error creating stream'),
      })
    )

    await act(async () => {
      render(<LiveAvatar />)
    })

    expect(screen.getByText('Disconnected')).toBeInTheDocument()
  })

  it('should cleanup on unmount', async () => {
    let component
    await act(async () => {
      component = render(<LiveAvatar />)
    })

    // Simulate successful connection
    await act(async () => {
      mockWebSocket.readyState = WebSocket.OPEN
      mockWebSocket.onopen?.()
    })

    // Unmount
    await act(async () => {
      component.unmount()
    })

    expect(mockWebSocket.close).toHaveBeenCalled()
    expect(mockRTCPeerConnection.close).toHaveBeenCalled()
  })

  it('should attempt to reconnect on WebSocket close', async () => {
    jest.useFakeTimers();
    
    await act(async () => {
      render(<LiveAvatar />);
    });

    // Simulate successful connection
    await act(async () => {
      mockWebSocket.readyState = WebSocket.OPEN;
      mockWebSocket.onopen?.();
    });

    // Simulate unclean close
    await act(async () => {
      mockWebSocket.readyState = WebSocket.CLOSED;
      mockWebSocket.onclose?.({ wasClean: false });
    });

    // Fast-forward timers
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // Verify reconnection attempt
    expect(mockWebSocket.readyState).toBe(WebSocket.CONNECTING);
    expect(screen.getByText('Disconnected')).toBeInTheDocument();

    // Simulate successful reconnection
    await act(async () => {
      mockWebSocket.readyState = WebSocket.OPEN;
      mockWebSocket.onopen?.();
    });

    expect(screen.getByText('Connected')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('should stop reconnecting after max attempts', async () => {
    jest.useFakeTimers();
    
    await act(async () => {
      render(<LiveAvatar />);
    });

    // Simulate successful connection
    await act(async () => {
      mockWebSocket.readyState = WebSocket.OPEN;
      mockWebSocket.onopen?.();
    });

    // Simulate multiple unclean closes
    for (let i = 0; i < 4; i++) {
      await act(async () => {
        mockWebSocket.readyState = WebSocket.CLOSED;
        mockWebSocket.onclose?.({ wasClean: false });
        jest.advanceTimersByTime(1000 * (i + 1));
      });
    }

    expect(screen.getByText('Disconnected')).toBeInTheDocument();
    expect(mockWebSocket.readyState).toBe(WebSocket.CLOSED);

    jest.useRealTimers();
  });
}) 