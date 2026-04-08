import React, { useState, useEffect } from 'react';
import StatusPill from './StatusPill';

export default function ClaimStatus() {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/claims', {
          headers: { 
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if(response.status === 401) {
             window.location.href = '/login';
             return;
        }

        const result = await response.json();
        if (result.success) {
          setClaims(result.data);
        }
      } catch (error) {
        console.error('Error fetching claims:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaims();
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
          Your Claims
        </h2>
        <p className="text-gray-500 text-lg leading-relaxed">
          Track the status of your submitted requests
        </p>
      </div>

      <div className="flex flex-col space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading your claims...</div>
        ) : claims.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-medium">You have not submitted any claims yet.</div>
        ) : claims.map((claim) => (
          <article 
            key={claim._id} 
            className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div className="flex-1">
              <header className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <h3 className="font-semibold text-xl text-gray-900 tracking-tight">
                  {claim.itemId?.title || 'Unknown Item'}
                </h3>
                <div className="block sm:hidden mb-2">
                  <StatusPill status={claim.status.charAt(0).toUpperCase() + claim.status.slice(1)} />
                </div>
              </header>
              <p className="text-gray-500 leading-relaxed text-sm sm:text-base mb-3 max-w-2xl">
                {claim.message}
              </p>
              <p className="text-xs font-medium text-gray-400 tracking-wide uppercase">
                Submitted • {new Date(claim.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="hidden sm:block flex-shrink-0 ml-4">
              <StatusPill status={claim.status.charAt(0).toUpperCase() + claim.status.slice(1)} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
