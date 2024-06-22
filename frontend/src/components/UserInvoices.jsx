import React, { useState, useEffect } from 'react';

const UserInvoices = ({ match }) => {
  const { recipientAddress } = match.params;
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        console.log(`Fetching invoices for address: ${recipientAddress}`);
        const response = await fetch(`http://localhost:5000/user/${recipientAddress}/invoices`);

        // Log the raw response text for debugging
        const responseText = await response.text();
        console.log('Raw response text:', responseText);

        // Parse the response as JSON
        const data = JSON.parse(responseText);
        console.log('Parsed JSON:', data);

        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setError(error.message);
      }
    };

    fetchInvoices();
  }, [recipientAddress]);

  return (
    <div>
      <h1>Invoices for {recipientAddress}</h1>
      {error && <p>Error: {error}</p>}
      {invoices.length > 0 ? (
        <ul>
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              <p>{invoice.id}</p>
              <p>{invoice.paymentDue}</p>
              <p>{invoice.description}</p>
              <p>{invoice.companyName}</p>
              <p>{invoice.companyEmail}</p>
              <p>{invoice.invoiceCategory}</p>
              <p>{invoice.recipientAddress}</p>
              <p>{invoice.dueDate}</p>
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>No invoices found.</p>
      )}
    </div>
  );
};

export default UserInvoices;
