import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';

const MetaMaskConnect = () => {
  const [account, setAccount] = useState(null);
  const history = useHistory();

  useEffect(() => {
    connectMetaMask();
  }, []);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log('Connected account:', account);
        setAccount(account);

        // Redirect to user/{walletAddress}/invoices
        history.push(`/user/${account}/invoices`);
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      console.error('MetaMask not detected');
    }
  };

  const logout = () => {
    setAccount(null);
    // Redirect to the home page or any other page you want
    history.push('/');
  };

  return (
    <div>
      {!account && <button onClick={connectMetaMask}>Connect MetaMask</button>}
      {account && (
        <div>
          <p>Connected account: {account}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default MetaMaskConnect;
