import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if(error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('role', data.data.role);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Make sure the server is running.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] relative z-10 text-center">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-gray-500 font-medium">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm font-medium">{error}</div>}
          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700 text-sm ml-2" htmlFor="email">Email</label>
            <input type="email" id="email" required value={formData.email} onChange={handleChange} placeholder="name@example.com" className="bg-gray-50/70 rounded-2xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all w-full" />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700 text-sm ml-2" htmlFor="password">Password</label>
            <input type="password" id="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="bg-gray-50/70 rounded-2xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all w-full" />
          </div>

          <div className="pt-6 pb-2">
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-medium py-4 px-6 rounded-full transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center">
              Login
            </button>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors inline-block">
              Don't have an account? <span className="text-blue-600 font-semibold ml-1">Register</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
