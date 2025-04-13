'use client';

import { useState, useRef, useEffect } from 'react';

export default function SimpleTestPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [wsStatus, setWsStatus] = useState('disconnected');
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  const runTest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/simple-stream-test');
      const data = await response.json();
      
      console.log('Test response:', data);
      setResult(data);
      
      if (data.success && data.streamUrl) {
        connectToStream(data.streamUrl);
      }
      
    } catch (error) {
      console.error('Test error:', error);
      setError(error instanceof Error ? error.message : 'Failed to run test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">تست ساده D-ID</h1>
      
      <button
        onClick={runTest}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'در حال تست...' : 'اجرای تست'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <p>خطا: {error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 