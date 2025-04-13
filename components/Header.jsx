'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if the link is active
  const isActive = (path) => pathname === path;

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-sm py-4'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="flex items-center space-x-1">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300"></div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-secondary-400 to-secondary-500 -ml-3 group-hover:from-secondary-500 group-hover:to-secondary-600 transition-all duration-300"></div>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800 group-hover:text-primary-700 transition-colors duration-300">
                Business Coaching
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/"
              className={`transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-primary-600 font-medium' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/livestream"
              className={`transition-colors duration-200 ${
                isActive('/livestream') 
                  ? 'text-primary-600 font-medium' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Private Coaching
            </Link>
            <Link 
              href="/meeting"
              className={`transition-colors duration-200 ${
                isActive('/meeting') 
                  ? 'text-primary-600 font-medium' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Sessions
            </Link>
            <Link 
              href="/auth"
              className={`transition-colors duration-200 ${
                isActive('/auth') 
                  ? 'text-primary-600 font-medium' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Login
            </Link>
          </nav>
          
          {/* Status Badge - Show only on livestream page */}
          {isActive('/livestream') && (
            <div className="hidden md:block">
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
                <span className="animate-pulse bg-white h-2 w-2 rounded-full mr-2"></span>
                LIVE SESSION
              </span>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {isActive('/livestream') && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center mr-3">
                <span className="animate-pulse bg-white h-1.5 w-1.5 rounded-full mr-1"></span>
                LIVE
              </span>
            )}
            
            <button 
              type="button" 
              className="text-gray-500 hover:text-primary-600 transition-colors duration-200"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/"
                className={`transition-colors duration-200 px-3 py-2 rounded-lg ${
                  isActive('/') 
                    ? 'bg-primary-50 text-primary-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/livestream"
                className={`transition-colors duration-200 px-3 py-2 rounded-lg ${
                  isActive('/livestream') 
                    ? 'bg-primary-50 text-primary-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Private Coaching
              </Link>
              <Link 
                href="/meeting"
                className={`transition-colors duration-200 px-3 py-2 rounded-lg ${
                  isActive('/meeting') 
                    ? 'bg-primary-50 text-primary-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sessions
              </Link>
              <Link 
                href="/auth"
                className={`transition-colors duration-200 px-3 py-2 rounded-lg ${
                  isActive('/auth') 
                    ? 'bg-primary-50 text-primary-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
