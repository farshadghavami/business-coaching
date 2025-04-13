'use client';

import React, { useState } from 'react';

export default function AuthTestPage() {
  const [status, setStatus] = useState('idle');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAuth = async () => {
    try {
      setStatus('testing');
      setResults(null);
      setError(null);

      console.log('Starting authentication tests...');
      const res = await fetch('/api/test-did-auth');
      const data = await res.json();
      
      console.log('Auth test response:', data);
      
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
      <h1 className="text-2xl mb-4">تست احراز هویت API دی-آیدی</h1>
      
      <section className="mb-4">
        <p className="text-gray-600">
          این تست انواع مختلف فرمت‌های احراز هویت را بررسی می‌کند.
        </p>
      </section>

      <button 
        onClick={testAuth}
        disabled={status === 'testing'}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {status === 'testing' ? 'در حال تست...' : 'تست احراز هویت'}
      </button>

      <section className="mt-4">
        <p>وضعیت: {status}</p>
        
        {error && (
          <div className="text-red-500 mt-2">
            <p>خطا: {error}</p>
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
                <h4 className="font-bold">{result.format}</h4>
                <p>وضعیت: {result.status} ({result.statusText})</p>
                <pre className="bg-white p-2 rounded mt-1 text-sm overflow-auto">
                  {JSON.stringify(result.body, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
} 