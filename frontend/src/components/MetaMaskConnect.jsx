import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';

const MetaMaskConnect = () => {
  const [account, setAccount] = useState(null);
  const history = useHistory();

  useEffect(() => {
    // Check if MetaMask is already connected
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      web3.eth.getAccounts().then(accounts => {
        if (accounts.length > 0) {
          const account = accounts[0];
          console.log('Already connected account:', account);
          setAccount(account);
          history.push(`/user/${account}/invoices`);
        }
      });
    }
  }, [history]);

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
        console.error('User denied account access or error:', error);
      }
    } else {
      console.error('MetaMask not detected');
    }
  };

  const logout = () => {
    setAccount(null);
    history.push('/');
  };

  return (
    <div>
      {!account && <button onClick={connectMetaMask}>Login with MetaMask</button>}
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
