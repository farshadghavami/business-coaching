'use client';

import { useState, useRef, useEffect } from 'react';

export default function TestDIDPage() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState('disconnected');
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const runTest = async () => {
    try {
      setStatus('testing');
      setError(null);
      
      const response = await fetch('/api/test-did-stream');
      const data = await response.json();
      
      console.log('Test response:', data);
      setResult(data);
      
      if (data.status === 'success' && data.streamUrl) {
        connectToStream(data.streamUrl, data.talkId);
      } else {
        setError(data.message || 'Failed to create stream');
        setStatus('error');
      }
      
    } catch (error) {
      console.error('Test error:', error);
      setError(error instanceof Error ? error.message : 'Failed to run test');
      setStatus('error');
    }
  };

  const connectToStream = (streamUrl: string, talkId: string) => {
    try {
      console.log('Connecting to stream:', streamUrl);
      const ws = new WebSocket(streamUrl);
      wsRef.current = ws;
      setWsStatus('connecting');

      ws.onopen = () => {
        console.log('WebSocket connected');
        setWsStatus('connected');
        setStatus('connected');
        
        // ارسال درخواست شروع استریم
        ws.send(JSON.stringify({
          type: 'start',
          talk_id: talkId
        }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          console.log('Received message:', msg);

          switch (msg.type) {
            case 'stream_started':
              console.log('Stream started');
              break;
            case 'video_chunk':
              if (videoRef.current && msg.data) {
                const blob = new Blob([msg.data], { type: 'video/mp4' });
                videoRef.current.src = URL.createObjectURL(blob);
              }
              break;
            case 'stream_ended':
              console.log('Stream ended');
              break;
            case 'error':
              setError(`Stream error: ${msg.error}`);
              break;
          }
        } catch (error) {
          console.error('Error handling message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection failed');
        setWsStatus('error');
        setStatus('error');
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setWsStatus('disconnected');
        setStatus('disconnected');
      };
    } catch (error) {
      console.error('Error connecting to stream:', error);
      setError('Failed to connect to stream');
      setWsStatus('error');
      setStatus('error');
    }
  };

  const sendMessage = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'text',
        text: 'سلام! این یک پیام تست است.'
      }));
    }
  };

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">تست D-ID Stream</h1>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={runTest}
            disabled={status === 'testing'}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {status === 'testing' ? 'در حال تست...' : 'شروع تست'}
          </button>

          {wsStatus === 'connected' && (
            <button
              onClick={sendMessage}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              ارسال پیام تست
            </button>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">وضعیت:</h2>
          <p>Status: {status}</p>
          <p>WebSocket: {wsStatus}</p>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            <p>خطا: {error}</p>
            <pre className="mt-2 text-sm whitespace-pre-wrap">
              {JSON.stringify(result?.details, null, 2)}
            </pre>
          </div>
        )}

        <div className="aspect-video bg-black rounded overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            controls
            className="w-full h-full object-contain"
          />
        </div>

        {result && (
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-bold mb-2">نتیجه تست:</h2>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 