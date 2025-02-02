import React from 'react';
import {FaEthereum} from "react-icons/fa";
import {SiSolidity} from "react-icons/si";
import {BiLogoReact} from "react-icons/bi";
import {DiJavascript} from "react-icons/di";
import {BiHardHat} from "react-icons/bi";
import {BiLogoNodejs} from "react-icons/bi";
import {SiWeb3Dotjs} from "react-icons/si";
import {TbBrandTypescript} from "react-icons/tb";

const Skillsm = () => {
  return (
    <div className="w-full h-[300px] bg-zinc-800 grid grid-cols-4 md:grid-cols-8 items-center justify-items-center gap-x-10 px-10">
    
    <FaEthereum className="text-green-200" style={{ height: "60px",width:"60px",color:"#e5e5e5"}} />
    <SiSolidity className="text-white" style={{ height: "60px",width:"60px",color:"#e5e5e5" }}/>
    <BiLogoReact className="text-white" style={{ height: "60px",width:"60px",color:"#e5e5e5" }}/>
    <DiJavascript className="text-white" style={{ height: "60px",width:"60px",color:"#e5e5e5" }}/>
    <BiHardHat className="text-white" style={{ height: "60px",width:"60px",color:"#e5e5e5" }}/>
    <BiLogoNodejs className="text-white" style={{ height: "60px",width:"60px",color:"#e5e5e5" }}/>
    <SiWeb3Dotjs className="text-white" style={{ height: "60px",width:"60px",color:"#e5e5e5" }}/>
    <TbBrandTypescript className="text-green-200" style={{ height: "60px",width:"60px",color:"#e5e5e5"}} />

 
 
    
    </div>
  )
}

export default Skillsm;