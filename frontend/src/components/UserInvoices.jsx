import React, { useState, useEffect } from 'react';
import Card from './Card';
import '../css/UserInvoice.css';

const UserInvoices = ({ match }) => {
  const { recipientAddress } = match.params;
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        console.log(`Fetching invoices for address: ${recipientAddress}`);
        const response = await fetch(`http://localhost:5000/user/${recipientAddress}/invoices`);
        const data = await response.json();
        console.log('Parsed JSON:', data);
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setError(error.message);
      }
    };

    fetchInvoices();
  }, [recipientAddress]);

  const handlePay = (invoiceId) => {
    setInvoices(invoices.map(inv =>
      inv.id === invoiceId ? { ...inv, isPending: false } : inv
    ));
  };

  return (
    <div className="invoices-container">
      <h1>Invoices for {recipientAddress}</h1>
      {error && <p>Error: {error}</p>}
      {invoices.length > 0 ? (
        <div className="invoices-list">
          {invoices.map((invoice) => (
            <Card key={invoice.id} invoice={invoice} onPay={handlePay} />
          ))}
        </div>
      ) : (
        !error && <p>No invoices found.</p>
      )}
    </div>
  );
};

export default UserInvoices;
