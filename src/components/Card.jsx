import React from 'react';

export default function Card({ title, description, status, onClaim }) {
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return 'bg-amber-100 text-amber-800';
      case 'found':
        return 'bg-emerald-100 text-emerald-800';
      case 'lost':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <article className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.02)] hover:-translate-y-1 flex flex-col h-full relative overflow-hidden group">
      {/* Decorative gradient blur in background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
      
      <div className="relative z-10 flex flex-col h-full">
        <header className="flex justify-between items-start mb-6">
          <h3 className="font-semibold text-xl text-gray-900 tracking-tight flex-1 pr-4">{title}</h3>
          <span className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide flex-shrink-0 ${getStatusStyle(status)}`}>
            {status}
          </span>
        </header>
        
        <p className="text-gray-500 leading-relaxed flex-grow mb-8 text-sm sm:text-base">
          {description}
        </p>
        
        <footer className="mt-auto">
          <button 
            type="button"
            onClick={onClaim}
            className="w-full font-medium py-3 px-6 rounded-full transition-all duration-300 text-white bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 active:scale-[0.98] shadow-sm hover:shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Claim Item
          </button>
        </footer>
      </div>
    </article>
  );
}
