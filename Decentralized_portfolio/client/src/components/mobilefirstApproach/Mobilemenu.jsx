import React from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { RxCross1 } from 'react-icons/rx';
import { Link } from 'react-scroll';

const MobileMenu = ({ onClose }) => {
  const Bar =[{title:"Skills", path:"skills"},
    {title:"Project", path:"projects"},
    {title:"Experience", path:"experience"}, 
    {title:"Education", path:"education"},
    {title:"Contact", path:"contact"}]
  return (
    <div className='absolute top-16 right-0 bg-white p-4 shadow-md'>
      {/* Add your menu items here */}
      <ul className='space-y-2'>
      {Bar.map((el,index)=>{
        return <li key={index}> <Link to={el.path}  smooth={true} duration={500}  className='font-Inter text-gray-700 hover:text-gray-400'>{el.title}</Link> </li>
    })}
        
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

export default MobileMenu;





