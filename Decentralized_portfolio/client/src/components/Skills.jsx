import React from 'react';
import {FaEthereum} from "react-icons/fa";
import {SiSolidity} from "react-icons/si";
import {BiLogoReact} from "react-icons/bi";
import {DiJavascript} from "react-icons/di";
import {BiHardHat} from "react-icons/bi";
import {BiLogoNodejs} from "react-icons/bi";
import {SiWeb3Dotjs} from "react-icons/si";

const Skills = () => {
  return (
    <div className="w-full h-[300px] bg-zinc-800 flex flex-col items-center  px-10">
    <div className="font-bebas-neue text-white mt-8 mb-0 pb-0 text-[30px]">Skills</div>
    <div className="w-full h-[175px] flex items-center justify-center ">  
    <FaEthereum className="text-green-200" style={{ height: "100px",width:"200px",color:"#e5e5e5"}} />
    <SiSolidity className="text-white" style={{ height: "100px",width:"200px",color:"#e5e5e5" }}/>
    <BiLogoReact className="text-white" style={{ height: "100px",width:"200px",color:"#e5e5e5" }}/>
    <DiJavascript className="text-white" style={{ height: "100px",width:"200px",color:"#e5e5e5" }}/>
    <BiHardHat className="text-white" style={{ height: "100px",width:"200px",color:"#e5e5e5" }}/>
    <BiLogoNodejs className="text-white" style={{ height: "100px",width:"200px",color:"#e5e5e5" }}/>
    <SiWeb3Dotjs className="text-white" style={{ height: "100px",width:"200px",color:"#e5e5e5" }}/>

 
 
    </div>
    </div>
  )
}

export default Skills