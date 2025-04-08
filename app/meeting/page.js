'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function MeetingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/auth');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      setUserName(userData.name || 'User');
    } catch (err) {
      console.error('Error parsing user data:', err);
    }
    
    // Generate a random meeting ID if not provided in URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
      setMeetingId(id);
    } else {
      // Generate a random meeting ID
      const randomId = Math.random().toString(36).substring(2, 15);
      setMeetingId(randomId);
      
      // Update URL with the meeting ID
      const newUrl = `${window.location.pathname}?id=${randomId}`;
      window.history.pushState({}, '', newUrl);
    }
    
    setIsLoading(false);
  }, [router]);

  const handleJoinMeeting = () => {
    // In a real application, you would connect to a video conferencing service here
    console.log('Joining meeting:', meetingId);
    
    // For now, just show a message
    alert(`Joining meeting: ${meetingId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading meeting...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-8">
                <h1 className="text-2xl font-bold text-center mb-6">Video Meeting</h1>
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                <div className="mb-6">
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold mb-2">Meeting ID: {meetingId}</h2>
                    <p className="text-gray-600 mb-4">Share this ID with others to join the meeting</p>
                    
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/meeting?id=${meetingId}`);
                          alert('Meeting link copied to clipboard!');
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="bg-gray-100 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Join Meeting</h3>
                    
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    
                    <button
                      onClick={handleJoinMeeting}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Join Meeting
                    </button>
                  </div>
                </div>
                
                <div className="text-center text-gray-600 text-sm">
                  <p>This is a demo meeting page. In a real application, you would connect to a video conferencing service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 