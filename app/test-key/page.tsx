'use client';

import { useState } from 'react';

export default function KeyTestPage() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testKey = async () => {
    try {
      setStatus('testing');
      setError(null);
      setResult(null);

      const res = await fetch('/api/test-key');
      const data = await res.json();
      
      console.log('API key test response:', data);

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
    <div className="p-4">
      <h1 className="text-2xl mb-4">تست API Key دی-آیدی</h1>
      
      <div className="mb-4">
        <p className="text-gray-600">
          این تست برای بررسی اعتبار API key انجام می‌شود.
          در صورت خطا، نیاز به API key جدید داریم.
        </p>
      </div>

      <button 
        onClick={testKey}
        disabled={status === 'testing'}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {status === 'testing' ? 'در حال تست...' : 'تست API Key'}
      </button>

      <div className="mt-4">
        <p>وضعیت: {status}</p>
        
        {error && (
          <div className="text-red-500 mt-2">
            <p>خطا: {error}</p>
            {result && (
              <pre className="bg-red-50 p-2 rounded mt-1 text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        )}

        {!error && result && (
          <div className="mt-2">
            <h3 className="font-bold">نتیجه تست:</h3>
            <pre className="bg-gray-50 p-2 rounded mt-1 text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 