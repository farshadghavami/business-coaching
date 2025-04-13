'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('uploading');

    const formData = new FormData(e.currentTarget);

    try {
      // آپلود تصویر
      const uploadResponse = await fetch('/api/did-upload', {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadResponse.json();
      
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      setResult(uploadData);
      setStatus('success');

      // اگر آپلود موفق بود، تست استریم
      if (uploadData.url) {
        const streamResponse = await fetch('/api/test-stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imageUrl: uploadData.url
          })
        });

        const streamData = await streamResponse.json();
        setResult(prev => ({ ...prev, stream: streamData }));
      }

    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setResult({ error: error.message });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">آپلود تصویر به D-ID</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">انتخاب تصویر</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full border rounded p-2"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'uploading'}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {status === 'uploading' ? 'در حال آپلود...' : 'آپلود و تست تصویر'}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded ${status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
          <h2 className="font-bold mb-2">
            {status === 'success' ? 'عملیات موفق' : 'خطا'}
          </h2>
          <pre className="whitespace-pre-wrap text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 