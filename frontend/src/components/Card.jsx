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

        console.log(`Attempting to send transaction from ${walletAddress} to ${invoice.formidium_address} with amount ${amount} ETH`);

        // Check balance
        const balance = await web3.eth.getBalance(walletAddress);
        const balanceInEth = web3.utils.fromWei(balance, 'ether');
        console.log(`Wallet balance: ${balanceInEth} ETH`);

        const amountInWei = web3.utils.toWei(amount, 'ether');
        
        // Estimate gas fees
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await web3.eth.estimateGas({
          from: walletAddress,
          to: invoice.formidium_address,
          value: amountInWei,
        });

        const totalCost = BigInt(amountInWei) + BigInt(gasEstimate) * BigInt(gasPrice);
        if (BigInt(balance) < totalCost) {
          console.error('Insufficient funds for the transaction');
          return;
        }

        // Send the transaction
        const transaction = await web3.eth.sendTransaction({
          from: walletAddress,
          to: invoice.formidium_address,
          value: amountInWei,
          gas: gasEstimate,
          gasPrice: gasPrice,
        });

        console.log('Transaction successful:', transaction);

        // Update backend with the payment details
        const response = await fetch(`http://localhost:5000/invoices/${invoice.id}/payment`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amountPaid: amount,
            walletAddress: walletAddress,
          }),
        });

        const data = await response.json();
        console.log('Invoice updated:', data);

        // Notify parent component about payment
        onPay(invoice.id);
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
