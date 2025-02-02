import React from "react";

import {BiLogoGmail} from "react-icons/bi";
import {AiOutlineWhatsApp} from "react-icons/ai";
import {AiFillTwitterCircle} from "react-icons/ai";
import {AiFillGithub} from "react-icons/ai";
import {AiFillLinkedin} from "react-icons/ai";

const Handles = () => {
  return (
    <div className="  bg-white flex md:flex-col flex-row items-start justify-end  px-10 gap-4">
    {/* <div className="font-bebas-neue text-white mt-8 mb-0 pb-0 text-[30px]">Get in Touch</div> */}
    
      {/* <a className=" text-gray-300  hover:text-gray-700" href="https://www.youtube.com/" target="_blank"><AiOutlineWhatsApp style={{ height: "30px",width:"30px"}} /></a> */}
    <a  href="https://github.com/PranabantiKarmaakar99" target="_blank"><AiFillGithub className=" text-gray-300  hover:text-gray-700"  target="_blank" style={{ height: "30px",width:"30px" }}/></a>
    <a  href="https://twitter.com/PKarmaakar" target="_blank"><AiFillTwitterCircle className=" text-gray-300  hover:text-gray-700" style={{ height: "30px",width:"30px" }}/></a>
    <a  href="https://www.linkedin.com/in/pranabanti-karmaakar-42365b132/" target="_blank"><AiFillLinkedin className=" text-gray-300  hover:text-gray-700" style={{ height: "30px",width:"30px" }}/></a>
    <a  href="mailto:aankhikarmakar@gmail.com" target="_blank"> <BiLogoGmail className=" text-gray-300  hover:text-gray-700" style={{ height: "30px",width:"30px" }}/></a> 
    </div>

   

 
 
  );
};

export default Handles;
