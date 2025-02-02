import React,{useContext} from 'react';
import Wallet from './Wallet';
import {GiAbstract050} from 'react-icons/gi';
// import { useMyContext } from "./context";
import { Link } from 'react-scroll';



const Navbar = () => {

    // const Bar1 = ["Skills","Project","Experience","Education","Contacts"]
    const Bar =[{title:"Skills", path:"skills"},
    {title:"Project", path:"projects"},
    {title:"Experience", path:"experience"}, 
    {title:"Education", path:"education"},
    {title:"Contact", path:"contact"}]

  return (
    <div className='flex w-full items-center justify-center h-[70px] gap-10 shadow-lg fixed'>
    <div className='absolute top-[10px] left-[10px] '>
     
      <a href="#" > <GiAbstract050 size={50} /> </a>
      </div>
    <div className='flex  items-center justify-center gap-2 text-sm lg:text-base lg:gap-5'>{Bar.map((el,index)=>{
        return <Link to={el.path}  smooth={true} duration={500} key={index} className='font-Inter text-gray-700 hover:text-gray-400'>{el.title}</Link>
    })}</div>

    <div className='absolute top-[0px] right-[10px] lg:right-[100px]'><Wallet /></div>
    
    
    </div>
 
  )
}

export default Navbar