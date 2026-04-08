import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  type = 'button',
  disabled = false
}) {
  const baseStyle = "font-medium py-3 px-6 rounded-full transition-all duration-300 w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-indigo-500 hover:from-primary-dark hover:to-indigo-600 active:scale-[0.98] shadow-soft hover:shadow-float text-white",
    secondary: "bg-surface hover:bg-gray-50 text-ink active:scale-[0.98] shadow-sm hover:shadow",
    ghost: "text-ink-muted hover:text-ink hover:bg-gray-100",
  };

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
