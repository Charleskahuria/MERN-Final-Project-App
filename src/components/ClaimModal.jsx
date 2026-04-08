import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClaimModal({ isOpen, onClose, item }) {
  const [formData, setFormData] = useState({
    message: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item) return;

    try {
      const response = await fetch('http://localhost:5000/api/claims', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          itemId: item._id,
          message: formData.message
        })
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        setFormData({ message: '' });
        alert('Claim submitted successfully!');
        onClose();
      } else {
        alert(result.message || 'Failed to submit claim');
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={onClose}
            className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl rounded-t-[2.5rem] p-8 pb-12 max-h-[85vh] overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.08)]"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Claim Item</h2>
                {item && <p className="text-gray-500 mt-1">Requesting: {item.title}</p>}
              </div>
              <button onClick={onClose} className="p-3 bg-gray-100 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700 text-sm ml-1" htmlFor="message">
                  Proof of Ownership Details
                </label>
                <textarea
                  id="message" required value={formData.message} onChange={handleChange} placeholder="Provide precise details to prove ownership..."
                  className="bg-gray-50/50 rounded-2xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white resize-none h-32 transition-all shadow-inner"
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-medium py-3.5 px-6 rounded-full transition-transform active:scale-[0.98] shadow-md">
                  Submit Claim Request
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
