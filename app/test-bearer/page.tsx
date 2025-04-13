'use client';

import React, { useState } from 'react';

export default function BearerTestPage() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testBearer = async () => {
    try {
      setStatus('testing');
      setError(null);
      setResult(null);

      console.log('Starting Bearer token test...');
      const res = await fetch('/api/test-did-bearer');
      const data = await res.json();
      
      console.log('Bearer test response:', data);

      if (data.status === 'error') {
        setError(data.message);
        setResult(data.result || data.error);
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
      <h1 className="text-2xl mb-4">تست Bearer Token دی-آیدی</h1>
      
      <section className="mb-4">
        <p className="text-gray-600">
          این تست با استفاده از Bearer token انجام می‌شود.
          این روش استاندارد برای احراز هویت API است.
        </p>
      </section>

      <button 
        onClick={testBearer}
        disabled={status === 'testing'}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {status === 'testing' ? 'در حال تست...' : 'تست Bearer Token'}
      </button>

      <section className="mt-4">
        <p>وضعیت: {status}</p>
        
        {error && (
          <section className="text-red-500 mt-2">
            <p>خطا: {error}</p>
            {result && (
              <section>
                <h4 className="font-bold mt-2">جزئیات درخواست:</h4>
                <pre className="bg-gray-50 p-2 rounded mt-1 text-sm overflow-auto">
                  {JSON.stringify(result.request || {}, null, 2)}
                </pre>
                
                <h4 className="font-bold mt-2">جزئیات خطا:</h4>
                <pre className="bg-red-50 p-2 rounded mt-1 text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </section>
            )}
          </section>
        )}

        {!error && result && (
          <section className="mt-2">
            <h3 className="font-bold">نتیجه تست:</h3>
            <pre className="bg-gray-50 p-2 rounded mt-1 text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </section>
        )}
      </section>
    </main>
  );
} 