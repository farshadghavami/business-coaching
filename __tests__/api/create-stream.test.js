import { POST } from '../../app/api/create-stream/route'

// Mock environment variables
process.env.DID_API_KEY = 'test-api-key'

// Mock fetch globally
global.fetch = jest.fn()

// Mock Request class
class MockRequest {
  constructor(url, init = {}) {
    this.url = url
    this.method = init.method || 'GET'
    this.body = init.body || null
  }

  async json() {
    return JSON.parse(this.body)
  }
}

global.Request = MockRequest

// Mock next/server
jest.mock('next/server', () => {
  const mockResponse = (data, init = {}) => ({
    ...data,
    status: init.status || 200,
    headers: init.headers || {},
    json: () => Promise.resolve(data),
  })

  return {
    NextResponse: {
      json: (data, init) => mockResponse(data, init),
    },
  }
})

// Mock edge runtime
global.Response = class MockResponse {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.headers = init.headers || {}
    this.ok = this.status >= 200 && this.status < 300
  }

  async json() {
    return JSON.parse(this.body)
  }

  async text() {
    return this.body
  }
}

describe('POST /api/create-stream', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('should create a stream successfully', async () => {
    const mockStreamData = {
      id: 'test-id',
      session_id: 'test-session-id',
      status: 'created'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStreamData)
    })

    const request = new Request('http://localhost:3000/api/create-stream', {
      method: 'POST',
      body: JSON.stringify({ source_url: 'https://example.com/image.jpg' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockStreamData)
    expect(fetch).toHaveBeenCalledWith(
      'https://api.d-id.com/talks/streams',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Authorization': 'Basic test-api-key',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source_url: 'https://example.com/image.jpg'
        })
      })
    )
  })

  it('should handle missing API key', async () => {
    const originalApiKey = process.env.DID_API_KEY
    delete process.env.DID_API_KEY

    const request = new Request('http://localhost:3000/api/create-stream', {
      method: 'POST',
      body: JSON.stringify({ source_url: 'https://example.com/image.jpg' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'DID API key not found' })

    process.env.DID_API_KEY = originalApiKey
  })

  it('should handle invalid source URL', async () => {
    const request = new Request('http://localhost:3000/api/create-stream', {
      method: 'POST',
      body: JSON.stringify({ source_url: 'invalid-url' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Invalid source URL provided' })
  })

  it('should handle D-ID API error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve('Invalid request')
    })

    const request = new Request('http://localhost:3000/api/create-stream', {
      method: 'POST',
      body: JSON.stringify({ source_url: 'https://example.com/image.jpg' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Failed to create stream: Invalid request' })
  })

  it('should handle network error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    const request = new Request('http://localhost:3000/api/create-stream', {
      method: 'POST',
      body: JSON.stringify({ source_url: 'https://example.com/image.jpg' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Network error' })
  })
}) 