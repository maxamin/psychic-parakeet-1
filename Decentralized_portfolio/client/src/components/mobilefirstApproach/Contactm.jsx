import React,{useState,useEffect} from 'react';
import CV from "../images/CV_Block_Chain Developer.pdf";
import { useMyContext } from "../context";

const Contactm = () => {
  const { state } = useMyContext();
  const [resumeLink,setResumeLink] =useState("");


  useEffect(()=>{


   const{contract} = state;
   const downloadResume = async()=>{
    
    //const educationDetail = await contract.methods.allEducationdetails().call();
    const resumeLink = await contract.methods.resumeLink().call();
    console.log(resumeLink);
    setResumeLink(resumeLink);


   }

   contract && downloadResume();

  },[state]) 
  return (
    <div className="w-full h-[200px] flex flex-col  md:flex-row md:gap-2 gap-5 items-center justify-center bg-paper">
      <a href="mailto:aankhikarmakar@gmail.com" target="_blank" className=' bg-zinc-800 hover:bg-zinc-600 font-bebas-neue font-medium py-2 px-5 text-white text-[30px] rounded-lg' > Get in Touch</a>
      <a href={`https://gateway.pinata.cloud/ipfs/${resumeLink}`} target="_blank"   className='bg-zinc-800 hover:bg-zinc-600  font-bebas-neue font-medium py-2 px-5 text-white text-[30px] rounded-lg'> Download CV</a>

    </div>
  )
}

export default Contactm;