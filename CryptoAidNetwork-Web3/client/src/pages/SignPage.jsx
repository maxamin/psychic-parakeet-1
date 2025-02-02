import React, { useEffect, useState } from 'react';
import Web3 from 'web3'; // Import Web3 library

const SignPage = () => {
  const [web3, setWeb3] = useState(null);

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
        alert('MetaMask not detected! Please install MetaMask to log in.');
      }
    };

    initWeb3();
  }, []);

  const redirectToDashboard = async () => {
    try {
      const ethereumAddress = await getUserAddress();
      if (ethereumAddress) {
        window.location.href = 'dashboard.html';
      }
    } catch (error) {
      console.error("Error retrieving user's Ethereum address", error);
    }
  };

  const getUserAddress = async () => {
    try {
      if (!web3) {
        await initWeb3();
      }

      const accounts = await web3.eth.getAccounts();

      return accounts[0] || null;
    } catch (error) {
      console.error("Error retrieving user's Ethereum address", error);
      return null;
    }
  };

  const signIn = async () => {
    await redirectToDashboard();
  };

  return (
    <div>
      <div className="background"></div>
      <div className="container">
        <div className="animated-text">
          <h1>Welcome to CryptoAidNetwork</h1>
          <p>Your platform for making a positive impact on the world.</p>
        </div>

        <form id="signInForm" className="sign-in-form">
          <button type="button" onClick={signIn}>Sign In with MetaMask</button>
        </form>
      </div>
    </div>
  );
};

export default SignPage;
