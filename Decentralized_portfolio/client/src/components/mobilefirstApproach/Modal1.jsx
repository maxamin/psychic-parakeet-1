// Modal.js

import React, { useState } from "react";
import { RxCross1 } from 'react-icons/rx';

const Modal = ({ modalIsOpen, onClose }) => {
  // if (!modalIsOpen) return null;

  return (
    // <div className="absolute  w-full top-16 left-0 flex items-center justify-center z-50 bg-red-400 bg-opacity-50 p-10">
    // open
    //   {/* <input type="number"  id="value" placeholder="1234" />
    //   <label> Eth</label>
    //     {/* {children} */}
    //     {/* <button
    //       className="py-2 px-12 rounded-lg text-center bg-zinc-800 hover:bg-zinc-600"
    //       onClick={onClose}
    //     >
    //       Donate
    //     </button> */} 
    //   </div>

    <div className='absolute h-screen w-full bg-red-200 p-4 z-20 shadow-md'>
      {/* Add your menu items here */}
      <ul className='space-y-2'>
        <li>Menu Item 1</li>
        <li>Menu Item 2</li>
        <li>Menu Item 2</li>
        <li>Menu Item 2</li>
        <li>Menu Item 2</li>
        <li>Menu Item 2</li>
        {/* ... more menu items */}
      </ul>

      <div className='text-right mt-4'>
        <RxCross1
          size={15}
          onClick={onClose} // Close the menu on clicking the cross icon
        />
      </div>
    </div>
    
  );
};

export default Modal;
