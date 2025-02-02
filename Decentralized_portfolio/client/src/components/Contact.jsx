import React from 'react';
import CV from "./images/CV_Block_Chain Developer.pdf";


const Contact = () => {
  return (
    <div className="w-full h-[200px] flex gap-20 items-center justify-center bg-paper">
      <a  href="https://www.youtube.com/" target="_blank"><button  className=' bg-red-800 font-bebas-neue font-medium py-2 px-5 text-white text-[30px] rounded-lg' > Get in Touch</button></a>
      <a href={CV} target="_blank" className=' bg-zinc-800 font-bebas-neue font-medium py-2 px-5 text-white text-[30px] rounded-lg'> Download CV</a>

    </div>
  )
}

export default Contact;