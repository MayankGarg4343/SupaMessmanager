import { toast } from 'react-toastify';

export const showToast = {
  success: (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      style: {
        background: '#10b981',
        border: '1px solid #059669',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#ffffff',
      },
    });
  },
  
  error: (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      style: {
        background: '#dc2626',
        border: '1px solid #b91c1c',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#ffffff',
      },
    });
  },
  
  info: (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      style: {
        background: '#0891b2',
        border: '1px solid #0e7490',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#ffffff',
      },
    });
  },
  
  warning: (message) => {
    toast.warn(message, {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      style: {
        background: '#f59e0b',
        border: '1px solid #d97706',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#000000',
      },
    });
  },
};
