import React, { useState } from 'react';
import '../css/Modal.css';

const Modal = ({ show, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    if (amount > 0) {
      onSubmit(amount);
    } else {
      console.error('Amount must be greater than zero');
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Enter Payment Amount</h2>
        <input type="number" value={amount} onChange={handleChange} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Modal;
