import React,{useEffect,useState} from 'react';
import { useMyContext } from "../context";

const Educationm = () => {
  const [educationDetail1,setEducationDetail] =useState("");
  const { state } = useMyContext();


  useEffect(()=>{


   const{contract} = state;
   const Education = async()=>{
    
    const educationDetail = await contract.methods.allEducationdetails().call();
    //const projects = await contract.methods.allExperience().call();
    console.log(educationDetail);
    setEducationDetail(educationDetail);


   }

   contract && Education();

  },[state]) 

 

    const Content = [
        {
          Year: "2012",
          title: "Bachelor in Architectural Engineering",
    
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          Institution: "Jadavpur University,India",
         
        },
        {
            Year: "2019",
            title: "Masters in Landscape Architecture",
      
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            Institution: "University of Sheffield,UK",
           
          },
          {
            Year: "2018",
            title: "MSC in Landscape Architecture",
      
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            Institution: "Wageningen University,Netherlands",
           
          },
    
      ];
      
      //  <div className="w-full h-full flex flex-col md:gap-20 gap-10 items-center justify-center bg-paper py-5">
      //  <div className="font-bebas-neue text-gray-900 font-medium mt-8 text-[30px] py-5 mb-2">
      //   Education
      // </div>
      // <div className="w-full flex flex-col md:flex-row gap-10 md:gap-2 items-center justify-center ">
      // {Content.map((el,index)=>{ 
      //  return( <div className="md:w-[400px] md:h-[400px] h-1/3 bg-stone-200 shadow-lg flex flex-col justify-end  py-10 items-start px-8" key={index}>
 
     
      // <div className='font-bebas-neue font-medium text-[30px]'> {el.title},{el.Year}</div>
      // {/* <div className='font-bebas-neue font-medium text-[30px]'> {el.Year}</div> */}
      // <div className='font-bebas-neue font-medium text-[20px]  text-gray-700'>{el.Institution}</div>
      // <div className='font-Inter font-medium text-sm text-justify  text-gray-600'>{el.description}</div>
     
        
    
      //   </div>)
        
        
        
      //   })}</div> </div>;

     return  <div> 
    
  
  <div className="w-full bg-white flex flex-col md:gap-10 md:flex-col gap-10 items-center justify-center bg-paper pt-7 px-7 mt-10 ">
      <div className='font-bebas-neue text-gray-800 font-medium mt-2 text-[30px] py-2 mb-5'> Education </div >
      <div className="w-full flex flex-col md:flex-row gap-10 md:gap-2 items-center justify-center ">
    { educationDetail1 !== "" && educationDetail1.map((el,index)=>{
     return( <div className="  h-max md:h-[300px] md:w-1/3 shadow-lg rounded-lg flex flex-col justify-end  py-10 items-start px-8 bg-stone-200 text-gray-700" key={index}>
  
   
    <div className='font-bebas-neue w-[236px] md:w-full font-medium text-[25px]'> {el.title}, {el.year}</div>
    {/* <div className='font-bebas-neue font-medium text-[30px]'> {el.Year}</div> */}
    <div className='font-bebas-neue font-medium w-[236px] md:w-full text-[20px]  '>{el.Institution}</div>
    <div className='font-Inter h-max font-medium text-sm w-[236px] md:w-full text-justify'>{el.description}</div>
   
      
  
      </div>)
      
      
      
      })}</div>;
      </div>
      </div>
}

export default Educationm;