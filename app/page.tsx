import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LiveAvatar from '../components/LiveAvatar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Business Coaching
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your business with personalized coaching powered by artificial intelligence. 
            Get expert guidance 24/7 to accelerate your business growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Why Choose AI Business Coach?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold">24/7 Availability</h3>
                    <p className="text-gray-600">Get instant guidance whenever you need it</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold">Personalized Strategy</h3>
                    <p className="text-gray-600">Tailored advice based on your business needs</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold">Data-Driven Insights</h3>
                    <p className="text-gray-600">Make decisions backed by advanced analytics</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-blue-600 p-8 rounded-xl shadow-lg text-white">
              <h2 className="text-2xl font-semibold mb-4">
                Start Your Growth Journey
              </h2>
              <p className="mb-6">
                Experience the future of business coaching with our AI-powered platform
              </p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Start Free Consultation
              </button>
            </div>
          </div>

          <div className="relative">
            <LiveAvatar />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg">
              <p className="text-gray-600 text-sm font-medium">
                Meet Sarah, Your AI Business Coach
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Strategy</h3>
            <p className="text-gray-600">
              Get expert guidance on business planning, market analysis, and growth strategies
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Optimization</h3>
            <p className="text-gray-600">
              Improve operational efficiency and maximize your business performance
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Leadership Development</h3>
            <p className="text-gray-600">
              Enhance your leadership skills and build high-performing teams
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
} 