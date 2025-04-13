'use client';

import React, { useState, useRef } from 'react';

export default function TestStreamV3Page() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [wsStatus, setWsStatus] = useState('disconnected');
  const wsRef = useRef<WebSocket | null>(null);

  const startTest = async () => {
    try {
      setStatus('creating');
      setError(null);
      setResult(null);
      setWsStatus('disconnected');

      // قطع اتصال WebSocket قبلی
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      console.log('Creating stream...');
      const response = await fetch('/api/create-stream-v3', {
        method: 'POST'
      });

      const data = await response.json();
      console.log('Stream creation response:', data);

      if (data.status === 'error') {
        throw new Error(`API Error: ${data.message}\n${data.details || ''}`);
      }

      setResult(data.stream);
      setStatus('created');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
    }
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
} 