import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="py-8 px-6 sm:px-12 bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo-500 shadow-soft flex items-center justify-center text-white text-sm">
            LF
          </span>
          Lost & Found
        </h1>
        <nav className="hidden sm:flex gap-6">
          <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Dashboard</Link>
          <Link to="/claims" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">My Claims</Link>
        </nav>
      </div>
    </header>
  );
}
