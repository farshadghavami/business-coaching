'use client';

import React, { useState } from 'react';

export default function TestStreamV2Page() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const startTest = async () => {
    try {
      setStatus('running');
      setError(null);
      setResult(null);

      // تست ساده اتصال به API
      const response = await fetch('https://api.d-id.com/talks', {
        method: 'GET',
        headers: {
          'Authorization': `Basic aWJjc2FsZXNhaUBnbWFpbC5jb20:N1a5ITBHb-M1u33MNrPud`
        }
      });

      const data = await response.text();
      console.log('API Response:', {
        status: response.status,
        data
      });

      setResult({
        status: response.status,
        data: data
      });
      setStatus('completed');

    } catch (err) {
      console.error('Test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">تست اتصال به API دی-آیدی</h1>
      
      <button 
        onClick={startTest}
        disabled={status === 'running'}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {status === 'running' ? 'در حال اجرا...' : 'شروع تست'}
      </button>

      <div className="mt-4">
        <div><strong>وضعیت:</strong> {status}</div>
        
        {error && (
          <div className="text-red-500 mt-2">
            <strong>خطا:</strong> {error}
          </div>
        )}

        {result && (
          <div className="mt-4">
            <h3 className="font-bold">نتیجه:</h3>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 