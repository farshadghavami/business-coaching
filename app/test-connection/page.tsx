'use client';

import React, { useState } from 'react';

export default function ConnectionTestPage() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    try {
      setStatus('testing');
      setResult(null);
      setError(null);

      console.log('Starting API connection test...');
      const res = await fetch('/api/test-did-connection');
      const data = await res.json();
      
      console.log('Test response:', data);

      if (data.status === 'error') {
        setError(data.message);
        setResult(data.details);
      } else {
        setResult(data);
      }

    } catch (err) {
      console.error('Test error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setStatus('completed');
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl mb-4">تست اتصال به API دی-آیدی</h1>
      
      <section className="mb-4">
        <p className="text-gray-600">
          این تست فقط اتصال به API را بررسی می‌کند.
        </p>
      </section>
    </main>
  );
} 