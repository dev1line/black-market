import React from 'react';

export default function Spinner() {
  const spinnerStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid #f3f3f3',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    transform: 'scale(10)',
  };

  return <div style={spinnerStyle}></div>;
}
