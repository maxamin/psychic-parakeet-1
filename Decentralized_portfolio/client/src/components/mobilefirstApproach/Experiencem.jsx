import React,{useEffect,useState} from 'react';
import { useMyContext } from "../context";

const Experiencem = () => {
  const [experiencenDetail1,setExperienceDetail] =useState("");
  const { state } = useMyContext();


  useEffect(()=>{


   const{contract} = state;
   const Experience = async()=>{
    
    //const educationDetail = await contract.methods.allEducationdetails().call();
    const experiencenDetail = await contract.methods.allExperience().call();
    console.log(experiencenDetail);
    setExperienceDetail(experiencenDetail);


   }

   contract && Experience();

  },[state]) 

    const Content = [
      {
        Year: "2022",
        title: "Tailwind",
  
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        Institution: "Open Source",
       
      },
      {
          Year: "Jun-2023",
          title: "BackPack",
    
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          Institution: "Open Source",
         
        },
        {
          Year: "2022-2023",
          title: "Consultant",
    
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          Institution: "The Abode",
         
        },
  
    ];
    return <div> 
    
  
  <div className="w-full bg-zinc-800 flex flex-col md:gap-10 md:flex-col gap-10 items-center justify-center bg-paper p-7 pt-20 mt-20">
      <div className='font-bebas-neue text-gray-100 font-medium mt-2 text-[30px] py-2 mb-2'> Experience </div >
      <div className="w-full flex flex-col md:flex-row gap-10 md:gap-2 items-center justify-center ">
    {experiencenDetail1 !== "" && experiencenDetail1.map((el,index)=>{
     return( <div className="  h-[400px] md:h-[300px] md:w-1/3 shadow-lg flex flex-col justify-end  py-10 items-start px-8 text-white" key={index}>
  
   
    <div className='font-bebas-neue w-[236px] md:w-full font-medium text-[30px]'> {el.title}, {el.year}</div>
    {/* <div className='font-bebas-neue font-medium text-[30px]'> {el.Year}</div> */}
    <div className='font-bebas-neue font-medium w-[236px] md:w-full text-[20px]  '>{el.company}</div>
    <div className='font-Inter font-medium text-sm w-[236px] md:w-full text-justify'>{el.description}</div>
   
      
  
      </div>)
      
      
      
      })}</div>;
      </div>
      </div>
      
  }

export default Experiencem