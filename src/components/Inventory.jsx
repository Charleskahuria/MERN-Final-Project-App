import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch Items
  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setItems(result.data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);
  
  // New Item State
  const [newItem, setNewItem] = useState({
    title: '', description: '', category: 'Various', imageUrl: '', dateFound: '', locationFound: ''
  });

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setItems(items.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewItem(prev => ({ ...prev, [id]: value }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      // imageUrl might be empty, if so delete from payload to let default handle it or bypass validator
      const payload = { ...newItem };
      if(!payload.imageUrl) delete payload.imageUrl;

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      if (response.ok && result.success) {
        await fetchItems(); // Refresh the list
        setNewItem({ title: '', description: '', category: 'Various', imageUrl: '', dateFound: '', locationFound: '' });
        setIsModalOpen(false);
      } else {
        alert(result.message || (result.errors && result.errors[0].msg));
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
        <div>
           <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Inventory</h2>
           <p className="text-gray-500 mt-1">Manage physical items recovered by the team.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-full font-medium transition-all shadow-md active:scale-[0.98]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add New Item
        </button>
      </div>

      <div className="flex flex-col space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading inventory...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No items available.</div>
        ) : (
          items.map(item => (
            <article 
              key={item._id}
              className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-6 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.02)] hover:-translate-y-0.5"
            >
              <div className="w-full md:w-48 h-48 md:h-auto rounded-2xl flex-shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                )}
              </div>

              <div className="flex flex-col flex-1 py-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 tracking-tight">{item.title}</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-gray-400 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 rounded-full transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-500 leading-relaxed mb-4 text-sm sm:text-base">{item.description}</p>
                <div className="mt-auto flex flex-col sm:flex-row gap-4 mb-2">
                   <div className="text-xs text-gray-400">Category: {item.category}</div>
                   <div className="text-xs text-gray-400">Status: <span className="font-semibold">{item.status}</span></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span>{new Date(item.dateFound).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>{item.locationFound}</span>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.1)] pointer-events-auto max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Add New Item</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-gray-800 transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                </div>

                <form onSubmit={handleAddItem} className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-medium text-gray-700 text-sm ml-2">Title</label>
                    <input id="title" required value={newItem.title} onChange={handleChange} className="bg-gray-50/70 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 transition-all w-full" placeholder="E.g. Apple Watch" />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-medium text-gray-700 text-sm ml-2">Description</label>
                    <textarea id="description" required value={newItem.description} onChange={handleChange} className="bg-gray-50/70 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 resize-none h-24 transition-all w-full" placeholder="Provide visual details..." />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="font-medium text-gray-700 text-sm ml-2">Category</label>
                    <input id="category" required value={newItem.category} onChange={handleChange} className="bg-gray-50/70 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 transition-all w-full" placeholder="E.g. Electronics" />
                  </div>

                   <div className="flex flex-col space-y-1.5">
                    <label className="font-medium text-gray-700 text-sm ml-2">Image URL</label>
                    <input id="imageUrl" type="url" value={newItem.imageUrl} onChange={handleChange} className="bg-gray-50/70 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 transition-all w-full" placeholder="https://..." />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col space-y-1.5">
                      <label className="font-medium text-gray-700 text-sm ml-2">Date Found</label>
                      <input type="date" id="dateFound" required value={newItem.dateFound} onChange={handleChange} className="bg-gray-50/70 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 transition-all w-full" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="font-medium text-gray-700 text-sm ml-2">Location</label>
                      <input id="locationFound" required value={newItem.locationFound} onChange={handleChange} className="bg-gray-50/70 rounded-2xl p-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 transition-all w-full" placeholder="E.g. Library" />
                    </div>
                  </div>

                  <div className="pt-4 pb-2">
                    <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-medium py-4 px-6 rounded-full transition-all duration-300 active:scale-[0.98] shadow-md flex items-center justify-center">
                      Save Item
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
