import React, { useState, useEffect } from 'react';
import Web3 from 'web3'; 

const Dashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [canAmount, setCanAmount] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(web3Instance);
        } catch (error) {
          console.error("User denied account access");
        }
      } else if (window.web3) {
        const web3Instance = new Web3(window.web3.currentProvider);
        setWeb3(web3Instance);
      } else {
        alert('MetaMask not detected. Please install MetaMask to use this feature.');
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const updateUserDetails = async () => {
      if (!web3) return;

      try {
        const accounts = await web3.eth.getAccounts();
        const ethereumAddress = accounts[0] || '';

        if (ethereumAddress) {
          setWalletAddress(ethereumAddress);

          const balance = await web3.eth.getBalance(ethereumAddress);
          const formattedBalance = web3.utils.fromWei(balance, 'ether');
          setWalletBalance(formattedBalance);

          setCanAmount(0);
        }
      } catch (error) {
        console.error("Error retrieving user's Ethereum address or balance", error);
      }
    };

    updateUserDetails();
  }, [web3]);

  const logout = () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      web3.currentProvider.close();
      setWeb3(null);
    }

    window.location.href = 'index.html';
  };

  return (
    <div>
      <div className="background"></div>
      <div className="container">
        <h1>Welcome to Your Dashboard</h1>

        <div id="userDetails">
          <p>Wallet Address: <span>{walletAddress}</span></p>
          <p>Wallet Balance: <span>{walletBalance} ETH</span></p>
        </div>

        <div id="canTokenDetails">
          <p>CAN Token Balance: <span>{canAmount} CAN</span></p>
        </div>

        <div id="logoutButton" className="logout-button">
          <button onClick={logout}>Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
