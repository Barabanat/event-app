import React from 'react';
import './Modal.css'; // Import the CSS file with modal styles

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        {children}
        <button onClick={onClose} className="mt-4 p-2 bg-red-500 text-white rounded">Close</button>
      </div>
    </>
  );
};

export default Modal;
