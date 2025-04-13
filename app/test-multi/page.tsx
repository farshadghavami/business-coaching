'use client';

import React, { useState } from 'react';

export default function MultiTestPage() {
  const [status, setStatus] = useState('idle');
  const [results, setResults] = useState<any>(null);

  const runTests = async () => {
    try {
      setStatus('testing');
      setResults(null);

      console.log('Starting multi-format tests...');
      const res = await fetch('/api/test-did-multi');
      const data = await res.json();
      
      console.log('Test results:', data);
      setResults(data);

    } catch (err) {
      console.error('Test error:', err);
    }
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
} 