import React, { useState } from 'react';
import Modal from './Modal';
import Web3 from 'web3';
import '../css/Card.css';

const Card = ({ invoice, onPay }) => {
  const [showModal, setShowModal] = useState(false);

  const handlePayClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSubmit = async (amount) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      console.error('Invalid payment amount');
      return;
    }
  
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const walletAddress = accounts[0];
  
        const amountInWei = web3.utils.toWei(amount, 'ether');
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await web3.eth.estimateGas({
          from: walletAddress,
          to: invoice.formidium_address,
          value: amountInWei,
        });
  
        const transaction = await web3.eth.sendTransaction({
          from: walletAddress,
          to: invoice.formidium_address,
          value: amountInWei,
          gas: gasEstimate,
          gasPrice: gasPrice,
        });
  
        const transactionHash = transaction.transactionHash;
  
        const response = await fetch(`http://localhost:5000/invoices/${invoice.id}/payment`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amountPaid: parseFloat(amount).toFixed(5), // Ensure decimal format
            walletAddress: walletAddress,
            transactionHash: transactionHash,
          }),
        });
  
        const data = await response.json();
        console.log('Invoice updated:', data);
  
        if (data.error) {
          console.error('Error updating invoice:', data.error);
        } else {
          console.log('Payment ID:', data.paymentId);
          alert(`Payment successful! Payment ID: ${data.paymentId}`);
          onPay(invoice.id);
        }
      } else {
        console.error('MetaMask is not installed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setShowModal(false);
    }
  };
  
  
  

  return (
    <div className="card">
      <div className="card-content">
        <p><strong>ID:</strong> {invoice.id}</p>
        <p><strong>Payment Due:</strong> {invoice.paymentDue}</p>
        <p><strong>Description:</strong> {invoice.description}</p>
        <p><strong>Company Name:</strong> {invoice.companyName}</p>
        <p><strong>Company Email:</strong> {invoice.companyEmail}</p>
        <p><strong>Invoice Category:</strong> {invoice.invoiceCategory}</p>
        <p><strong>Recipient Address:</strong> {invoice.recipientAddress}</p>
        <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
        <button className="pay-button" onClick={handlePayClick}>Pay</button>
      </div>
      <Modal show={showModal} onClose={handleModalClose} onSubmit={handleModalSubmit} />
    </div>
  );
};

export default Card;
