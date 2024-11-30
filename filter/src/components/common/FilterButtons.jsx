import React from 'react';

const FilterButton = () => {
  return (
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '8px 16px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        color: '#4A4A4A',
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="6" y1="12" x2="18" y2="12"></line>
            <line x1="9" y1="18" x2="15" y2="18"></line>
          </svg>

      Filter
    </button>
  );
};

export default FilterButton;
