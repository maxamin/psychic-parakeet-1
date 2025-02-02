// import React from 'react';
// //GiHamburgerMenu
// import {GiHamburgerMenu} from "react-icons/gi";
// import {GiAbstract050} from 'react-icons/gi';
// import Wallet from '../Wallet';
// import Walletm from './walletm';


// const Navbarm = () => {

//   return (
//     <div className=' h-[60px] md:h-[70px] flex  gap-2 justify-center items-start '>
//     <div className='absolute top-[10px] left-[10px]'><GiAbstract050 size={30}/></div>
//     <div className='mt-[10px]'><Walletm  /></div>
//     <div className='absolute top-[10px] right-[10px]'><GiHamburgerMenu size={30} /></div>

//     </div>
//   )
// }

// export default Navbarm

import React, { useState } from 'react';
import { GiHamburgerMenu, GiAbstract050 } from 'react-icons/gi';
import { RxCross1 } from 'react-icons/rx';
import Walletm from './Walletm';
import MobileMenu from './Mobilemenu'; // Import the mobile menu component;


const Navbarm = () => {
 const [isMenuOpen,setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='h-[60px] w-full md:h-[70px] flex gap-2 justify-center items-start fixed '>
      <div className='absolute top-[10px] left-[10px]'>
       <a href="#" > <GiAbstract050 size={30} /> </a>
      </div>
      <div className='mt-[10px]'> 
        <Walletm />
      </div>
      <div
        className='absolute top-[10px] right-[10px]'
        onClick={toggleMenu} // Toggle the menu on clicking the hamburger icon
      >
        <GiHamburgerMenu size={30} />
      </div>

      {isMenuOpen && <MobileMenu onClose={toggleMenu} />} {/* Render the mobile menu when the flag is true */}
    </div>
  );
};

export default Navbarm;


