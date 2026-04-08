import React from 'react';
import Header from './Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative w-full overflow-hidden">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-12 py-12 w-full">
        {children}
      </main>
    </div>
  );
}
