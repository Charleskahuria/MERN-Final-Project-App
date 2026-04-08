import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if(data.success && data.data.role === 'admin') {
         localStorage.setItem('token', data.data.token);
         localStorage.setItem('role', data.data.role);
         navigate('/admin/dashboard');
      } else if (data.success && data.data.role !== 'admin') {
         setError("Access denied. Admin role required.");
      } else {
         setError(data.message || "Invalid credentials");
      }
    } catch(err) {
      setError("Server error. Please ensure backend is running.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gray-50/50">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] relative z-10 text-center">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-gray-900 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-gray-900/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">Admin Access</h1>
          <p className="text-gray-500 font-medium">Authorized personnel only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm font-medium">{error}</div>}
          
          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700 text-sm ml-2" htmlFor="email">Admin Email</label>
            <input type="email" id="email" required value={formData.email} onChange={handleChange} placeholder="admin@organization.com" className="bg-gray-50/70 rounded-2xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-slate-500/10 focus:bg-white transition-all w-full" />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700 text-sm ml-2" htmlFor="password">Password</label>
            <input type="password" id="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="bg-gray-50/70 rounded-2xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-slate-500/10 focus:bg-white transition-all w-full" />
          </div>

          <div className="pt-6 pb-2">
            <button type="submit" className="w-full bg-gradient-to-r from-slate-800 to-gray-900 hover:from-slate-900 hover:to-black text-white font-medium py-4 px-6 rounded-full transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center tracking-wide">
              Login as Admin
            </button>
          </div>

          <div className="text-center mt-6">
            <div className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-rose-50 rounded-full">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-rose-600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span className="text-xs font-semibold text-rose-600 tracking-wide uppercase">This is a Restricted access</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
