import React from "react";
import IMG1 from "./images/DAPP1.jpeg";
import IMG2 from "./images/DAPP2.png";
import IMG3 from "./images/DAPP3.jpeg";
import {MdHealthAndSafety} from "react-icons/md";
import {FaShippingFast} from "react-icons/fa";
import {FaCoffee} from "react-icons/fa";

const Projects = () => {
  const Content = [
    {
      image: <FaCoffee style={{ height: "200px",width:"250px",color:"gray"}}/>,
      title: "CHAI APP?",
      alt: "first Dapp",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      githubLink: "Lorem ipsum dolor",
      Website: "Lorem ipsum dolor",
    },
    {
      image: <MdHealthAndSafety style={{ height: "200px",width:"250px",color:"gray"}}/>,
      title: "NHS App",
      alt: "first Dapp",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      githubLink: "Lorem ipsum dolor",
      Website: "Lorem ipsum dolor",
    },
    {
      image: <FaShippingFast style={{ height: "200px",width:"250px",color:"gray"}}/>,
      title: "Shipment App",
      alt: "first Dapp",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      githubLink: "Lorem ipsum dolor",
      Website: "Lorem ipsum dolor",
    },
  ];
  return <
  div className="w-full h-[600px] flex flex-col  items-center justify-center bg-paper">
  <div className="font-bebas-neue text-gray-900 font-medium mt-8 mb-0 pb-0 text-[30px]">Projects</div>
  <div className="w-full h-[450px] flex gap-20 items-center justify-center ">
  {Content.map((el,index)=>{
   return( <div className="w-[400px] h-[400px] bg-stone-200 shadow-lg flex flex-col justify-center items-center" key={index}>
    <div className="h-[300px] rounded-lg flex flex-col items-center justify-center">
      {/* <img className="h-full object-cover" src={el.image} alt={el.alt}/> */}
      <div className="mt-20 mb-0 h-[]">{el.image}</div>
      <div className=" font-semibold text-[50px] py-1 text-gray-900 font-bebas-neue mt-0">{el.title}</div>
    </div>
    <div className="h-[100px]  flex items-center justify-center gap-4">
      <div className="   bg-neutral-800 text-white rounded-md shadow-lg text-sm font-Inter px-4 py-3">White Papers</div>
      <a href={el.Website} className="   bg-neutral-800 text-white rounded-md shadow-lg text-sm font-Inter px-4 py-3">Website Link</a>
    </div>
    

    </div>)
    
    
    
    })}</div>
  </div>;
};

export default Projects;
