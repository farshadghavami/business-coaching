'use client';

import { useEffect, useRef, useState } from 'react';

export default function TestVideoPage() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [videoSrc, setVideoSrc] = useState('/avatars/coach.mp4');

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.oncanplay = () => {
        setStatus('ready');
      };
      
      videoRef.current.onerror = (e) => {
        console.error('Video error:', e);
        setStatus('error');
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Video Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Video Status: {status}</h2>
          
          <div className="aspect-video bg-black mb-4">
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full"
              controls
              playsInline
            />
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Current video path:</p>
            <div className="bg-gray-100 p-2 rounded font-mono text-sm">
              {videoSrc}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Try another video path:
            </label>
            <div className="flex">
              <input
                type="text"
                value={videoSrc}
                onChange={(e) => setVideoSrc(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 