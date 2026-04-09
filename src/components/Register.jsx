import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           name: formData.name,
           email: formData.email,
           password: formData.password
        })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('role', data.data.role);
        navigate('/dashboard');
      } else {
        // Express validator sends an array of errors sometimes
        const errorMsg = data.errors ? data.errors[0].msg : data.message;
        setError(errorMsg || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Make sure the server is running.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gray-50/50">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] relative z-10 text-center">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">Create Account</h1>
          <p className="text-gray-500 font-medium">Sign up to track your lost items</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Note: I added Name because backend registration requires it */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700 text-sm ml-2" htmlFor="name">Full Name</label>
            <input type="text" id="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" className="bg-gray-50/70 rounded-2xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all w-full" />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700 text-sm ml-2" htmlFor="email">Email</label>
            <input type="email" id="email" required value={formData.email} onChange={handleChange} placeholder="name@example.com" className="bg-gray-50/70 rounded-2xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all w-full" />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700 text-sm ml-2" htmlFor="password">Password</label>
            <input type="password" id="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="bg-gray-50/70 rounded-2xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all w-full" />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700 text-sm ml-2" htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={`bg-gray-50/70 rounded-2xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all w-full ${error ? 'focus:ring-red-500/10 ring-2 ring-red-500/20' : 'focus:ring-blue-500/10'}`} />
            {error && <p className="text-sm text-red-500 font-medium ml-2 mt-1">{error}</p>}
          </div>

          <div className="pt-4 pb-2">
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-medium py-4 px-6 rounded-full transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center">
              Register
            </button>
          </div>

          <div className="text-center mt-2">
            <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors inline-block">
              Already have an account? <span className="text-blue-600 font-semibold ml-1">Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
