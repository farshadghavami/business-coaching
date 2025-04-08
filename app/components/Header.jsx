'use client';

import { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex items-center space-x-1">
                <div className="h-6 w-6 rounded-full bg-blue-500"></div>
                <div className="h-6 w-6 rounded-full bg-purple-500 -ml-2"></div>
              </div>
              <span className="ml-2 text-xl font-bold text-primary-800">Business Coaching</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-primary-600">Home</Link>
            <Link href="/livestream" className="text-gray-600 hover:text-primary-600">Live Coach</Link>
            <Link href="/meeting" className="text-gray-600 hover:text-primary-600">Sessions</Link>
            <Link href="/auth" className="text-gray-600 hover:text-primary-600">Login</Link>
          </nav>

          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-600 hover:text-primary-600">Home</Link>
              <Link href="/livestream" className="text-gray-600 hover:text-primary-600">Live Coach</Link>
              <Link href="/meeting" className="text-gray-600 hover:text-primary-600">Sessions</Link>
              <Link href="/auth" className="text-gray-600 hover:text-primary-600">Login</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
