import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import Logo from '../assets/RaiseWavesBlack.jpg' ;

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <div className="bg-gradient-to-b from-indigo-900 to-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-8 rounded-md">
      <div className="text-center mb-8 flex">
        <h1 className="font-epilogue font-bold text-4xl md:text-5xl mb-2">
        <img src={Logo} alt='logo' className='w-40 p-4'/>
          Welcome to Raise Waves
        </h1>
        <p className="font-epilogue text-lg text-gray-400">
          Elevating Dreams, One Backer at a Time
        </p>
      </div>

      <div className="w-full max-w-screen-lg">
      </div>
    </div>
  );
};

export default Home;
