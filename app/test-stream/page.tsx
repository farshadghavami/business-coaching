'use client';

import React, { useState } from 'react';

export default function TestStream() {
  const [status, setStatus] = useState('idle');
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const createAndConnectStream = async () => {
    try {
      setStatus('creating');
      setError(null);
      setResult(null);
      
      // Close existing WebSocket if any
      if (ws) {
        ws.close();
        setWs(null);
      }

      const response = await fetch('/api/create-stream', {
        method: 'POST'
      });

      const data = await response.json();
      console.log('Stream creation response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create stream');
      }

      if (!data.wsUrl) {
        throw new Error('No WebSocket URL in response');
      }

      setResult(data);
      setStatus('connecting');

      // Connect to WebSocket
      const newWs = new WebSocket(data.wsUrl);
      setWs(newWs);

      newWs.onopen = () => {
        console.log('WebSocket connected');
        setWsStatus('connected');
        setStatus('ready');
      };

      newWs.onclose = () => {
        console.log('WebSocket disconnected');
        setWsStatus('disconnected');
      };

      newWs.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection failed');
        setWsStatus('error');
      };

      newWs.onmessage = (event) => {
        console.log('WebSocket message:', event.data);
        const message = JSON.parse(event.data);
        setResult(prev => ({ ...prev, lastMessage: message }));
      };

    } catch (error) {
      console.error('Test error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setStatus('error');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">تست D-ID Stream</h1>
      
      <button
        onClick={createAndConnectStream}
        disabled={status === 'creating' || status === 'connecting'}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        شروع تست
      </button>

      <div className="mt-4">
        <p>وضعیت: {status}</p>
        <p>وضعیت WebSocket: {wsStatus}</p>
        {error && <p className="text-red-500">خطا: {error}</p>}
        {result && (
          <div className="mt-4">
            <h2 className="text-xl">نتیجه:</h2>
            <pre className="bg-gray-100 p-2 mt-2 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 