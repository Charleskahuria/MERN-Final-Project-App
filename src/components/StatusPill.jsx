import React from 'react';

export default function StatusPill({ status }) {
  // Normalize the status string to lower case for reliable matching
  const normalizedStatus = status?.toLowerCase() || '';

  // Determine the styling based on the status
  let colorStyles = '';
  
  if (normalizedStatus.includes('pending')) {
    // Soft yellow/amber
    colorStyles = 'bg-amber-100 text-amber-800';
  } else if (normalizedStatus.includes('approved')) {
    // Soft green/emerald
    colorStyles = 'bg-emerald-100 text-emerald-800';
  } else if (normalizedStatus.includes('rejected')) {
    // Soft red/rose
    colorStyles = 'bg-rose-100 text-rose-800';
  } else {
    // Fallback neutral gray
    colorStyles = 'bg-gray-100 text-gray-800';
  }

  return (
    <span 
      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide flex-shrink-0 inline-flex items-center justify-center ${colorStyles}`}
    >
      {/* If you pass status exactly, it will render correctly formatted e.g. "Approved" */}
      {status}
    </span>
  );
}
