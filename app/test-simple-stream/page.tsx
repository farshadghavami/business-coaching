'use client';

import React, { useState } from 'react';

export default function TestSimpleStreamPage() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const createStream = async () => {
    try {
      setStatus('creating');
      setResult(null);
      setError(null);

      console.log('Starting simple stream creation...');
      const res = await fetch('/api/create-simple-stream', {
        method: 'POST'
      });
      
      console.log('Response status:', res.status);
      const responseText = await res.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response:', data);
      } catch (e) {
        console.error('Failed to parse response:', e);
        setError(`Failed to parse response: ${e instanceof Error ? e.message : 'Unknown error'}`);
        setStatus('error');
        return;
      }

      if (data.status === 'error') {
        console.error('Error from API:', data);
        setError(`API Error: ${data.message}\n${data.error || ''}`);
        setStatus('error');
      } else {
        setResult(data.stream);
        setStatus('success');
      }
    } catch (e) {
      console.error('Stream creation error:', e);
      setError(`Failed to create stream: ${e instanceof Error ? e.message : 'Unknown error'}`);
      setStatus('error');
    }
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
} 