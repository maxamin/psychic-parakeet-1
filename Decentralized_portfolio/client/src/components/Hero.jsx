import React from "react";
import Wallet from "./Wallet";
import Navbar from "./Navbar";
import IMG from "./images/Hero_img.jpg";
import Handles from "./Handles";

const Hero = () => {
  return (
    <div className="w-full h-screen relative flex flex-col bg-paper">
      <div className="absolute z-10  w-full">
        <Navbar />
      </div>
      <div className="absolute top-0 h-full flex flex-row-reverse   w-full ">
      <Handles />
        {" "}
        <div className="w-full  rounded-lg  flex flex-col items-start pl-[40px] mt-[70px] gap-2">
          <h1 className="text-[70px] py-1 text-gray-900 font-bebas-neue mt-[50px]">
            PRANABANTI KARMAAKAR
          </h1>
          <p className="text-xl p-1 text-gray-500 w-[543px] text-justify">
            {" "}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor sit
            amet,
          </p>
          <p className=" font-Inter p-1 text-justify text-gray-400 text-sm  w-[543px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Morbi tincidunt augue
            interdum velit euismod. Iaculis eu non diam phasellus vestibulum.
            Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt.
            Turpis nunc eget lorem dolor sed viverra ipsum. Euismod elementum
            nisi quis eleifend quam. Commodo nulla facilisi nullam vehicula
            ipsum a arcu. Nunc mattis enim ut tellus. Risus in hendrerit gravida
            rutrum quisque non tellus. Nec dui nunc mattis enim. Amet
            consectetur adipiscing elit pellentesque habitant. Tristique
            senectus et netus et malesuada fames. Netus et malesuada fames ac.
           
           
          </p>
        </div>
        <div className=" w-2/3 h-full  flex">
        <div className="mt-[0px] w-full h-full  overflow-hidden "><img src={IMG} alt="Hero_img" className=" object-cover w-full"></img></div>
        
     

            
          </div>
          </div>
      

    </div>
  );
};

export default Hero;
