

const Education = () => {
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
      return <div className="w-full h-[450px] flex gap-20 items-center justify-center bg-paper">
      
      
      {Content.map((el,index)=>{
       return( <div className="w-[400px] h-[400px] bg-stone-200 shadow-lg flex flex-col justify-end  py-10 items-start px-8" key={index}>
 
     
      <div className='font-bebas-neue font-medium text-[30px]'> {el.title},{el.Year}</div>
      {/* <div className='font-bebas-neue font-medium text-[30px]'> {el.Year}</div> */}
      <div className='font-bebas-neue font-medium text-[20px]  text-gray-700'>{el.Institution}</div>
      <div className='font-Inter font-medium text-sm text-justify  text-gray-600'>{el.description}</div>
     
        
    
        </div>)
        
        
        
        })}</div>;
}

export default Education