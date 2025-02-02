import React from 'react'

const Experience = () => {
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
        title: "Technical Consultant",
  
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        Institution: "The Abode",
       
      },

  ];
  return <div className="w-full h-[450px]  bg-zinc-800 flex gap-20 items-center justify-center bg-paper">
  {Content.map((el,index)=>{
   return( <div className="w-[400px] h-[400px] shadow-lg flex flex-col justify-end  py-10 items-start px-8 text-white" key={index}>

 
  <div className='font-bebas-neue font-medium text-[30px]'> {el.title}, {el.Year}</div>
  {/* <div className='font-bebas-neue font-medium text-[30px]'> {el.Year}</div> */}
  <div className='font-bebas-neue font-medium text-[20px]  '>{el.Institution}</div>
  <div className='font-Inter font-medium text-sm text-justify'>{el.description}</div>
 
    

    </div>)
    
    
    
    })}</div>;
}

export default Experience