import React from "react";
import { SiEthereum } from "react-icons/si";
import logo from "../../images/logo.png"; // You can replace this with the Ethereum logo image

const Footer = () => (
  <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
  
    <div className="flex justify-center items-center flex-col mt-5">
      <p className="text-white text-sm text-center">Can contact me at</p>
      <p className="text-white text-sm text-center font-medium mt-2">codesai127.0.0.1@gmail.com</p>
    </div>

    <div className="sm:w-[90%] w-full h-[0.25px] bg-white mt-5" />

    <div className="w-full md:justify-center flex sm:flex-row flex-col justify-between items-center mt-3">
      <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
        <p className="text-white text-left text-xs">© 2023-2024 sai_terukula</p>
       
        <div>
          <SiEthereum size={32} color="#FFD701" className="rotate-3d" /> {/* Ethereum logo with 3D rotation effect */}
        </div>

        <p className="text-white text-right text-xs">All rights reserved</p>
      </div>
    </div>
  </div>
);

export default Footer;
