import React from 'react';
import { loader } from '../assets';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center">
      <div className="bg-white rounded-full p-6 shadow-md flex items-center space-x-4">
        <img src={loader} alt="loader" className="w-[50px] h-[50px] animate-spin" />
        <div>
          <p className="font-epilogue font-semibold text-lg text-gray-800">
            Transaction in Progress
          </p>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
