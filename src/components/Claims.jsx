import React, { useState, useEffect } from 'react';
import StatusPill from './StatusPill';

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const response = await fetch('/api/claims', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
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

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const statusMap = { 'Rejected': 'rejected', 'Approved': 'approved' };
      const response = await fetch(`/api/claims/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
         },
        body: JSON.stringify({ status: statusMap[newStatus] })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        fetchClaims(); // Refresh to catch any dependent updates (like auto-rejecting others)
      } else {
        alert(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10">
         <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Manage Claims</h2>
         <p className="text-gray-500 mt-1">Review, approve, or reject ownership claims submitted by users.</p>
      </div>

      <div className="flex flex-col space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading claims...</div>
        ) : claims.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-medium">No claims pending review.</div>
        ) : (
          claims.map(claim => (
            <article 
              key={claim._id}
              className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-5 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-1">
                    {claim.itemId?.title || 'Unknown Item'}
                  </h3>
                  <div className="mt-1 text-sm text-gray-500">Claimant: {claim.userId?.name} ({claim.userId?.email})</div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <StatusPill status={claim.status.charAt(0).toUpperCase() + claim.status.slice(1)} />
                </div>
              </div>

              <div className="bg-gray-50/70 rounded-2xl p-4">
                <p className="text-sm font-semibold text-gray-600 mb-1">User Message:</p>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  "{claim.message}"
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2">
                <button
                  onClick={() => handleStatusChange(claim._id, 'Rejected')}
                  disabled={claim.status !== 'pending'}
                  className="px-5 py-2.5 rounded-full font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-[0.98]"
                >
                  Reject Claim
                </button>
                <button
                  onClick={() => handleStatusChange(claim._id, 'Approved')}
                  disabled={claim.status !== 'pending'}
                  className="px-5 py-2.5 rounded-full font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-[0.98]"
                >
                  Approve Claim
                </button>
              </div>

            </article>
          ))
        )}
      </div>
    </div>
  );
}
