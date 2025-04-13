'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PrivateCoachingRoom() {
  const videoRef = useRef(null);
  const chatInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);
  
  const [status, setStatus] = useState('initializing');
  const [sessionActive, setSessionActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Voice interaction states
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [voiceMode, setVoiceMode] = useState(false);
  const [coachSpeaking, setCoachSpeaking] = useState(false);

  useEffect(() => {
    // Set a delay to simulate loading
    const timer = setTimeout(() => {
      setStatus('ready');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-scroll the chat container to the bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Cleanup function for audio stream
  useEffect(() => {
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioStream]);

  const startCoachingSession = () => {
    setStatus('connecting');
    
    // Simulate connection process
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.src = '/avatars/coach.mp4';
        
        videoRef.current.oncanplay = () => {
          videoRef.current.play().catch(err => {
            console.error('Video play failed:', err);
            setStatus('error');
          });
          setStatus('active');
          setSessionActive(true);
          
          // Welcome message from coach
          setTimeout(() => {
            speakMessage("Hello! I'm your business coach today. How can I help you with your business goals?");
            addMessage('coach', "Hello! I'm your business coach today. How can I help you with your business goals?");
          }, 1000);
        };
        
        videoRef.current.onerror = () => {
          console.error('Video error');
          setStatus('error');
        };
      }
    }, 1500);
  };

  const endSession = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    
    // Stop any ongoing voice recording
    if (isRecording) {
      stopRecording();
    }
    
    // Add ending message
    const endMessage = "Thank you for your time today! If you have more questions, feel free to schedule another session.";
    speakMessage(endMessage);
    addMessage('coach', endMessage);
    
    setStatus('ended');
    setSessionActive(false);
  };

  const addMessage = (sender, text) => {
    const newMessage = {
      id: Date.now(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user message
    addMessage('user', userInput);
    
    // Process user message
    processUserInput(userInput);
    
    setUserInput('');
  };

  const processUserInput = (input) => {
    // Simulate coach typing
    setIsTyping(true);
    
    // Simulate coach response (in real app, this would be an API call)
    setTimeout(() => {
      setIsTyping(false);
      
      let response;
      const inputLower = input.toLowerCase();
      
      if (inputLower.includes('help') || inputLower.includes('advice')) {
        response = "I'd be happy to help! Could you tell me more about your specific business challenges?";
      } else if (inputLower.includes('growth') || inputLower.includes('revenue')) {
        response = "Growth is a common goal. Let's analyze your current revenue streams and identify opportunities for expansion.";
      } else if (inputLower.includes('marketing') || inputLower.includes('advertis')) {
        response = "Marketing is crucial. Have you identified your target audience and value proposition clearly?";
      } else if (inputLower.includes('hello') || inputLower.includes('hi') || inputLower.includes('hey')) {
        response = "Hello! I'm here to help with your business questions. What specific area would you like guidance on?";
      } else if (inputLower.includes('thank')) {
        response = "You're welcome! I'm here to support your business journey.";
      } else {
        response = "That's an interesting point. Could you elaborate more on how this relates to your business goals?";
      }
      
      // Speak the response if in voice mode
      if (voiceMode) {
        speakMessage(response);
      }
      
      addMessage('coach', response);
    }, 1500);
  };

  // Voice interaction functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks = [];
      setAudioChunks(chunks);
      
      recorder.ondataavailable = e => {
        chunks.push(e.data);
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        
        // Play back the user's audio for testing
        if (audioRef.current) {
          audioRef.current.src = URL.createObjectURL(audioBlob);
        }
        
        // In a real app, you would send this audio to a speech-to-text service
        // Here we'll simulate that with a timeout
        setIsTyping(true);
        
        setTimeout(() => {
          setIsTyping(false);
          // Simulate speech-to-text result
          const fakeTranscription = getRandomUserQuery();
          
          // Add user message with transcription
          addMessage('user', fakeTranscription);
          
          // Process the transcribed text
          processUserInput(fakeTranscription);
        }, 1500);
      };
      
      recorder.start();
      setIsRecording(true);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access your microphone. Please check your browser permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const toggleVoiceMode = () => {
    const newMode = !voiceMode;
    setVoiceMode(newMode);
    
    // Announce the mode change
    if (newMode) {
      speakMessage("Voice mode enabled. I'll speak my responses out loud.");
      addMessage('system', "Voice mode enabled. The coach will speak responses out loud.");
    } else {
      addMessage('system', "Voice mode disabled. The coach will respond with text only.");
    }
  };

  const speakMessage = (text) => {
    // Only speak if voice mode is enabled or we're explicitly speaking a message
    if (voiceMode || text.includes("Hello! I'm your business coach") || text.includes("Thank you for your time today")) {
      setCoachSpeaking(true);
      
      // Use speech synthesis
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 1.0;
      speech.pitch = 1.0;
      speech.volume = 1.0;
      
      // Select a voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoices = voices.filter(voice => voice.name.includes('Female') || voice.name.includes('female'));
      if (femaleVoices.length > 0) {
        speech.voice = femaleVoices[0];
      }
      
      speech.onend = () => {
        setCoachSpeaking(false);
      };
      
      window.speechSynthesis.speak(speech);
    }
  };

  // Helper function to get random user queries for the voice demo
  const getRandomUserQuery = () => {
    const queries = [
      "How can I improve my marketing strategy?",
      "What's the best way to increase customer retention?",
      "I'm struggling with time management. Any advice?",
      "How do I scale my business effectively?",
      "What are the key metrics I should track for my business?"
    ];
    
    return queries[Math.floor(Math.random() * queries.length)];
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="pt-20"></div>
      
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Room Header */}
          <div className="bg-white rounded-t-xl shadow-md border-b border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Private Coaching Room
                </h1>
                <p className="text-gray-600 mt-1">
                  One-on-one business coaching session with your personal advisor
                </p>
              </div>
              
              <div className="flex items-center">
                {sessionActive ? (
                  <div className="flex items-center space-x-2">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                      <span className="animate-pulse bg-white h-2 w-2 rounded-full mr-2"></span>
                      LIVE SESSION
                    </span>
                    <button
                      onClick={toggleVoiceMode}
                      className={`ml-3 px-4 py-2 rounded-lg transition-colors ${
                        voiceMode 
                          ? 'bg-primary-600 text-white hover:bg-primary-700' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      {voiceMode ? 'Voice On' : 'Voice Off'}
                    </button>
                    <button
                      onClick={endSession}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                    >
                      End Session
                    </button>
                  </div>
                ) : (
                  status === 'ready' && (
                    <button
                      onClick={startCoachingSession}
                      className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                      Start Private Session
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="bg-white shadow-md rounded-b-xl overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Video Player (Takes up 2/3 on large screens) */}
              <div className="lg:col-span-2 border-r border-gray-100">
                <div className="aspect-video bg-gray-900 relative">
                  {/* Loading State */}
                  {status === 'initializing' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
                        <p className="text-white mt-3">Initializing coaching room...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Ready State */}
                  {status === 'ready' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <div className="text-center max-w-md p-6">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <h2 className="text-white text-xl font-bold mb-2">Your Private Coach Is Ready</h2>
                        <p className="text-gray-300 mb-6">Start your exclusive one-on-one coaching session to get personalized guidance for your business goals.</p>
                        <button 
                          onClick={startCoachingSession} 
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full"
                        >
                          Start Coaching Session
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Connecting State */}
                  {status === 'connecting' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
                        <p className="text-white mt-3">Connecting to your private coach...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Error State */}
                  {status === 'error' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
                      <div className="text-center max-w-md p-4">
                        <div className="text-red-500 text-5xl mb-3">⚠️</div>
                        <p className="text-white font-medium mb-2">Connection Error</p>
                        <p className="text-gray-300 mb-4">Unable to connect to your coaching session. Please try again.</p>
                        <button 
                          onClick={() => window.location.reload()} 
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Reload
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Ended State */}
                  {status === 'ended' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
                      <div className="text-center max-w-md p-4">
                        <div className="text-green-500 text-5xl mb-3">✓</div>
                        <p className="text-white font-medium mb-2">Session Ended</p>
                        <p className="text-gray-300 mb-4">Your coaching session has ended. Thank you for participating!</p>
                        <button 
                          onClick={() => {
                            setStatus('ready');
                            setMessages([]);
                            setVoiceMode(false);
                          }} 
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Start New Session
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Speaking Indicator */}
                  {coachSpeaking && status === 'active' && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full px-3 py-1 text-white text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                      </svg>
                      Speaking
                    </div>
                  )}
                  
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    controlsList="nodownload"
                    controls
                    playsInline
                    loop
                  ></video>
                  
                  {/* Audio Element for playback */}
                  <audio ref={audioRef} className="hidden" />
                </div>
                
                {/* Chat Section */}
                <div className="border-t border-gray-200">
                  <div className="h-80 flex flex-col">
                    {/* Chat Messages */}
                    <div 
                      ref={chatContainerRef}
                      className="flex-1 overflow-y-auto p-4 space-y-4"
                    >
                      {messages.length === 0 && status !== 'active' ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          {status === 'ready' || status === 'initializing' ? 
                            'Start the session to begin chatting with your coach' : 
                            status === 'ended' ? 
                            'Chat history from your session' :
                            'Loading chat...'}
                        </div>
                      ) : (
                        <>
                          {messages.map(message => (
                            <div 
                              key={message.id} 
                              className={`flex ${
                                message.sender === 'user' 
                                  ? 'justify-end' 
                                  : message.sender === 'system' 
                                    ? 'justify-center' 
                                    : 'justify-start'
                              }`}
                            >
                              {message.sender === 'system' ? (
                                <div className="bg-gray-100 text-gray-500 rounded-lg px-4 py-2 text-sm max-w-md text-center">
                                  {message.text}
                                </div>
                              ) : (
                                <div className={`max-w-3/4 rounded-lg px-4 py-2 ${
                                  message.sender === 'user' 
                                    ? 'bg-primary-100 text-primary-800' 
                                    : 'bg-gray-200 text-gray-800'
                                }`}>
                                  <div className="text-sm">{message.text}</div>
                                  <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {isTyping && (
                            <div className="flex justify-start">
                              <div className="bg-gray-200 rounded-lg px-4 py-2">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Chat Input with Voice Record Button */}
                    <form 
                      onSubmit={handleSendMessage}
                      className="border-t border-gray-200 p-4 flex space-x-2"
                    >
                      <input
                        ref={chatInputRef}
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={sessionActive ? "Type your message here..." : "Start session to chat with coach"}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={!sessionActive || isRecording}
                      />
                      
                      {/* Voice Record Button */}
                      <button
                        type="button"
                        disabled={!sessionActive}
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`px-3 py-2 rounded-lg ${
                          !sessionActive 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : isRecording 
                              ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' 
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {isRecording ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      
                      {/* Send Button */}
                      <button
                        type="submit"
                        disabled={!sessionActive || !userInput.trim() || isRecording}
                        className={`px-4 py-2 rounded-lg ${
                          sessionActive && userInput.trim() && !isRecording
                            ? 'bg-primary-600 text-white hover:bg-primary-700' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              
              {/* Sidebar (Takes up 1/3 on large screens) */}
              <div className="lg:col-span-1 p-6">
                <div className="space-y-6">
                  {/* Session Status */}
                  <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Session Status
                    </h2>
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${
                        status === 'active' ? 'bg-green-500' :
                        status === 'connecting' ? 'bg-yellow-500' :
                        status === 'error' ? 'bg-red-500' :
                        status === 'ended' ? 'bg-gray-400' :
                        'bg-blue-500'
                      }`}></div>
                      <span className="text-gray-700">
                        {status === 'active' ? 'Session in progress' :
                         status === 'connecting' ? 'Connecting to session' :
                         status === 'error' ? 'Connection error' :
                         status === 'ended' ? 'Session ended' :
                         status === 'ready' ? 'Ready to start' :
                         'Preparing room'}
                      </span>
                    </div>
                    
                    {/* Voice Mode Status */}
                    {sessionActive && (
                      <div className="mt-2 flex items-center space-x-3">
                        <div className={`h-3 w-3 rounded-full ${voiceMode ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-gray-700">Voice Mode: {voiceMode ? 'On' : 'Off'}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Session Information */}
                  <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Session Information
                    </h2>
                    <ul className="space-y-2">
                      <li className="flex items-center text-gray-700">
                        <span className="w-24 text-gray-500">Coach:</span>
                        <span className="font-medium">Business Expert</span>
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="w-24 text-gray-500">Duration:</span>
                        <span className="font-medium">30 minutes</span>
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="w-24 text-gray-500">Session Type:</span>
                        <span className="font-medium">Private 1:1</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Voice Interaction Guide */}
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                      Voice Interaction Guide
                    </h2>
                    <p className="text-gray-700">
                      This section provides guidance on how to interact with the voice assistant.
                    </p>
                  </div>
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