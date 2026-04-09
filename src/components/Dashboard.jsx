import React, { useState, useEffect } from 'react';
import Card from './Card';
import ClaimModal from './ClaimModal';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');
      if(!token) {
         navigate('/login');
         return;
      }

      try {
        const response = await fetch('/api/items', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        if (!response.ok) throw new Error('Failed to fetch items from server.');
        
        const result = await response.json();
        setItems(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [navigate]);

  const handleClaim = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <>
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
          Recent Items
        </h2>
        <p className="text-gray-500 text-lg leading-relaxed">
          Browse lost and found items in your area. Request a claim if an item belongs to you.
        </p>
      </div>

      {isLoading ? (
        <div className="w-full py-20 flex justify-center items-center">
           <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="w-full py-12 text-center text-rose-500 font-medium">
           {error}
        </div>
      ) : items.length === 0 ? (
        <div className="w-full py-12 text-center text-gray-500 font-medium">
           No items have been listed yet. Check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Card 
              key={item._id}
              title={item.title}
              description={item.description}
              status={item.status}
              onClaim={() => handleClaim(item)}
            />
          ))}
        </div>
      )}

      <ClaimModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        item={selectedItem}
      />
    </>
  );
}
