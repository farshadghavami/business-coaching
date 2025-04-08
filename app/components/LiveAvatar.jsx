'use client';

import { useState, useEffect, useRef } from 'react';

export default function LiveAvatar() {
  const [streamId, setStreamId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [status, setStatus] = useState('initializing');
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    createStream();

    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      if (peerConnectionRef.current) {
        try {
          peerConnectionRef.current.close();
        } catch (error) {
          console.error('Error closing peer connection:', error);
        }
      }
    };
  }, []);

  const createStream = async () => {
    try {
      setStatus('creating');
      const response = await fetch('/api/create-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_url: 'https://i.ibb.co/1sN3B6D/avatar.jpg',
        }),
      });

      if (!response || !response.ok) {
        throw new Error(response ? await response.text() : 'Failed to create stream');
      }

      const data = await response.json();
      if (!data || !data.id || !data.session_id) {
        throw new Error('Invalid response data');
      }

      setStreamId(data.id);
      setSessionId(data.session_id);
      setStatus('connecting');
      connectToStream(data.id, data.session_id);
    } catch (error) {
      console.error('Error creating stream:', error);
      setStatus('error');
      setIsConnected(false);
    }
  };

  const connectToStream = (id, session) => {
    if (!id || !session) {
      setStatus('error');
      return;
    }

    try {
      const socket = new WebSocket(`wss://api.d-id.com/talks/streams/${id}?session_id=${session}`);
      let reconnectAttempts = 0;
      const maxReconnectAttempts = 3;
      const reconnectDelay = 1000; // 1 second

      const attemptReconnect = () => {
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
          setTimeout(() => {
            if (socket.readyState === WebSocket.CLOSED) {
              connectToStream(id, session);
            }
          }, reconnectDelay * reconnectAttempts);
        } else {
          console.error('Max reconnection attempts reached');
          setStatus('error');
          setIsConnected(false);
        }
      };

      socket.onopen = () => {
        console.log('WebSocket connection established');
        setStatus('connected');
        setIsConnected(true);
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      };

      socket.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);

          switch (msg.type) {
            case 'connected':
              console.log('Connected to stream');
              break;
            case 'ready':
              console.log('Stream is ready');
              if (!peerConnectionRef.current) {
                createPeerConnection();
              }
              break;
            case 'offer':
              console.log('Received offer');
              if (msg.data) {
                await handleOffer(msg.data);
              }
              break;
            case 'ice-candidate':
              if (msg.data) {
                await handleIceCandidate(msg.data);
              }
              break;
            case 'chat':
              if (msg.data && msg.data.text) {
                addToChatHistory('ai', msg.data.text);
              }
              break;
            case 'stream-ended':
              setIsConnected(false);
              setStatus('ended');
              break;
            default:
              console.log('Received message:', msg);
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('error');
        setIsConnected(false);
      };

      socket.onclose = (event) => {
        setIsConnected(false);
        setStatus(event.wasClean ? 'ended' : 'error');
        
        if (!event.wasClean) {
          attemptReconnect();
        }
      };

      socketRef.current = socket;
      createPeerConnection();
    } catch (error) {
      console.error('Error connecting to stream:', error);
      setStatus('error');
      setIsConnected(false);
    }
  };

  const createPeerConnection = () => {
    try {
      const config = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      };

      const pc = new RTCPeerConnection(config);

      pc.ontrack = (event) => {
        if (videoRef.current && event.streams && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.send(JSON.stringify({ type: 'ice-candidate', data: event.candidate }));
        }
      };

      peerConnectionRef.current = pc;

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'request-offer' }));
      }
    } catch (error) {
      console.error('Error creating peer connection:', error);
      setStatus('error');
    }
  };

  const handleOffer = async (offer) => {
    try {
      if (!peerConnectionRef.current) {
        createPeerConnection();
      }

      const pc = peerConnectionRef.current;
      if (!pc) {
        throw new Error('No peer connection available');
      }

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'answer', data: answer }));
      }
    } catch (error) {
      console.error('Error handling offer:', error);
      setStatus('error');
    }
  };

  const handleIceCandidate = async (candidate) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const sendChatMessage = () => {
    if (!inputText.trim() || !isConnected || !socketRef.current) return;

    try {
      socketRef.current.send(JSON.stringify({ type: 'chat', data: { text: inputText } }));
      addToChatHistory('user', inputText);
      setInputText('');
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  };

  const addToChatHistory = (sender, content) => {
    setChatHistory((prev) => [...prev, { sender, content, timestamp: new Date() }]);
  };

  return (
    <div className="grid md:grid-cols-5 gap-6">
      {/* Video Section */}
      <div className="md:col-span-3 bg-black rounded-xl overflow-hidden relative shadow-lg">
        <div className="aspect-video">
          {status === 'initializing' || status === 'creating' || status === 'connecting' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p>
                {status === 'initializing' && 'Initializing...'}
                {status === 'creating' && 'Creating stream...'}
                {status === 'connecting' && 'Connecting to coach...'}
              </p>
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          )}
        </div>
        <div className="p-4 bg-gray-900 text-white">
          <div className="flex items-center space-x-2">
            <div
              className={`h-3 w-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="md:col-span-2 bg-white rounded-xl shadow-lg flex flex-col h-full">
        <div className="p-4 border-b">
          <h3 className="font-medium">Chat with AI Business Coach</h3>
        </div>
        <div className="flex-grow p-4 overflow-y-auto max-h-[30vh] md:max-h-[50vh]">
          {chatHistory.length === 0 ? (
            <div className="text-center text-gray-500 my-8">
              <p>Your conversation will appear here.</p>
              <p>Ask a question to get started.</p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t">
          <form className="flex space-x-2" onSubmit={(e) => { e.preventDefault(); sendChatMessage(); }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              disabled={!isConnected}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={!isConnected || !inputText.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
