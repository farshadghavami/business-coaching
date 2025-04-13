'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function LiveAvatar() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const videoRef = useRef(null);

  const connectToStream = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/create-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_url: "https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg",
          script: {
            type: "text",
            input: "Hello! I'm Sarah, your AI Business Coach. How can I help you grow your business today?",
            provider: {
              type: "microsoft",
              voice_id: "en-US-JennyNeural"
            }
          },
          config: {
            stitch: true,
            result_format: "mp4",
            fluent: true,
            pad_audio: 0,
            driver_url: "bank://classics/driver-01",
            align_driver: true,
            sharpen: true,
            auto_match: true,
            normalization_factor: 1,
            motion_factor: 1,
            optimize_audio: true,
            reduce_noise: false,
            align_expand_factor: 0.3
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Error creating stream');
      }

      wsRef.current = new WebSocket(data.wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
        setIsLoading(false);
      };

      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'video-chunk') {
          const videoChunk = new Uint8Array(atob(message.data).split('').map(char => char.charCodeAt(0)));
          if (videoRef.current) {
            try {
              videoRef.current.src = URL.createObjectURL(new Blob([videoChunk], { type: 'video/mp4' }));
              videoRef.current.play();
            } catch (error) {
              console.error('Error playing video:', error);
            }
          }
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setError('Connection error');
        setIsConnected(false);
        setIsLoading(false);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket Disconnected');
        setIsConnected(false);
      };

    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    connectToStream();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-white rounded-2xl overflow-hidden shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-white mt-4">Connecting to your AI Coach...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 backdrop-blur-sm">
            <div className="text-center p-6">
              <p className="text-red-600 font-medium mb-2">Connection Error</p>
              <p className="text-red-500 text-sm">{error}</p>
              <button 
                onClick={connectToStream}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
      </div>

      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <p className="text-sm font-medium text-gray-700">
            {isConnected ? 'Connected' : 'Connecting...'}
          </p>
        </div>
      </div>
    </div>
  );
} 