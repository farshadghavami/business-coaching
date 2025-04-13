'use client';

import { useState, useRef, useEffect } from 'react';

export default function UploadTestPage() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState('disconnected');
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  const handleUploadAndTest = async () => {
    try {
      setStatus('uploading');
      setError(null);

      const response = await fetch('/api/upload-image', {
        method: 'POST'
      });

      const data = await response.json();
      console.log('Upload and stream response:', data);

      if (data.success) {
        setResult(data);
        setStatus('uploaded');
        connectToStream(data.streamUrl);
      } else {
        setError(data.error?.description || 'Upload failed');
        setStatus('error');
      }

    } catch (error) {
      console.error('Test error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload and test');
      setStatus('error');
    }
  };

  useEffect(() => {
    // Implementation of connectToStream function
  }, []);

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
} 