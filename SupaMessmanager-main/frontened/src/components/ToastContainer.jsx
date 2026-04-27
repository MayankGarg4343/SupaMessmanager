import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomToastContainer = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      style={{
        background: '#1a1a1a',
        border: '1px solid #ff8800',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#ffffff',
        boxShadow: '0 4px 12px rgba(255, 136, 0, 0.15)',
      }}
    />
  );
};

export default CustomToastContainer;
