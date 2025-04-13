'use client';

import React, { useState } from 'react';

export default function SimpleTestPage() {
  const [status, setStatus] = useState('idle');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    try {
      setStatus('testing');
      setResults(null);
      setError(null);

      console.log('Starting API test...');
      const res = await fetch('/api/test-did-simple');
      const data = await res.json();
      
      console.log('Test response:', data);

      if (data.status === 'error') {
        setError(data.message);
        setResults(data.results);
      } else {
        setResults(data.results);
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
      <h1 className="text-2xl mb-4">تست ساده API دی-آیدی</h1>
      
      <section className="mb-4">
        <p className="text-gray-600">
          این تست روش‌های مختلف احراز هویت را بررسی می‌کند.
        </p>
      </section>

      <button 
        onClick={runTest}
        disabled={status === 'testing'}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {status === 'testing' ? 'در حال تست...' : 'شروع تست'}
      </button>

      <section className="mt-4">
        <p>وضعیت: {status}</p>
        
        {error && (
          <div className="text-red-500 mt-2">
            <p className="font-bold">خطا:</p>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">نتایج تست‌ها:</h3>
            {results.map((result: any, index: number) => (
              <div 
                key={index} 
                className={`border p-3 rounded mb-2 ${
                  result.status === 200 ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <h4 className="font-bold">{result.method}</h4>
                <p>وضعیت: {result.status} ({result.statusText})</p>
                {result.error && (
                  <p className="text-red-500">خطا: {result.error}</p>
                )}
                {result.response && (
                  <pre className="bg-white p-2 rounded mt-1 text-sm overflow-auto">
                    {JSON.stringify(result.response, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
} 