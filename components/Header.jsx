'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return pathname === path ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-primary-600';
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-sm py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="flex items-center space-x-1">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300"></div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-secondary-400 to-secondary-500 -ml-3 group-hover:from-secondary-500 group-hover:to-secondary-600 transition-all duration-300"></div>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800 group-hover:text-primary-700 transition-colors duration-300">Business Coaching</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`${isActive('/')} transition-colors duration-200`}>Home</Link>
            <Link href="/livestream" className={`${isActive('/livestream')} transition-colors duration-200`}>Live Coach</Link>
            <Link href="/meeting" className={`${isActive('/meeting')} transition-colors duration-200`}>Sessions</Link>
            <Link href="/auth" className={`${isActive('/auth')} transition-colors duration-200`}>Login</Link>
          </nav>

          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-primary-600 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link href="/" className={`${isActive('/')} py-2 transition-colors duration-200`}>Home</Link>
              <Link href="/livestream" className={`${isActive('/livestream')} py-2 transition-colors duration-200`}>Live Coach</Link>
              <Link href="/meeting" className={`${isActive('/meeting')} py-2 transition-colors duration-200`}>Sessions</Link>
              <Link href="/auth" className={`${isActive('/auth')} py-2 transition-colors duration-200`}>Login</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
