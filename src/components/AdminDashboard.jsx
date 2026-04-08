import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Inventory from './Inventory';
import Claims from './Claims';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory');

  // Simple logout handler
  const handleLogout = () => {
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50/50 p-6 sm:p-8 gap-8 overflow-hidden font-sans">
      {/* 
        Sidebar - Designed as a floating panel
        No borders, uses shadow and soft radius 
      */}
      <aside className="w-64 flex-shrink-0 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col h-[calc(100vh-4rem)]">
        
        {/* Header/Brand Area */}
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-md">
             <span className="text-white font-semibold text-sm">LF</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 tracking-tight text-lg">Admin Panel</h2>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-3">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium ${
              activeTab === 'inventory' 
                ? 'bg-gray-100 text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {/* Box Icon for Inventory */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            Inventory
          </button>
          
          <button
            onClick={() => setActiveTab('claims')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium ${
              activeTab === 'claims' 
                ? 'bg-gray-100 text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {/* Clipboard Icon for Claims */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            </svg>
            Claims
          </button>
        </nav>

        {/* Bottom logout area */}
        <div className="mt-auto pt-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 font-medium transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* 
        Main Content Area 
        Soft background layered over the root background
      */}
      <main className="flex-1 bg-white/40 rounded-[2rem] p-8 sm:p-12 h-[calc(100vh-4rem)] overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
            {activeTab === 'inventory' ? 'Current Inventory' : 'Manage Claims'}
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
            {activeTab === 'inventory' 
              ? 'View and manage all items currently stored in the Lost and Found system.' 
              : 'Review, approve, or reject ownership claims submitted by users.'}
          </p>
        </header>

        {/* Dynamic Content Area */}
        {activeTab === 'inventory' ? (
          <Inventory />
        ) : (
          <Claims />
        )}
      </main>

    </div>
  );
}
