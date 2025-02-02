import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { CustomButton } from "./";
import { sun } from "../assets";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);

  const { connect, address } = useStateContext();

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-8 gap-6">
      <div className="absolute sm:flex hidden flex-row justify-end gap-4 right-5 top-5">
        <CustomButton
          btnType="button"
          title={address ? "Create CAN" : "Connect"}
          styles={address ? "bg-[#3498db]" : "bg-[#8c6dfd]"}
          handleClick={() => {
            if (address) {
              navigate("create-campaign");
            } else connect();
          }}
        />
        <CustomButton
          btnType="button"
          title="Dashboard"
          styles={address ? "bg-[#3498db]" : "bg-[#8c6dfd]"}
          handleClick={() => {
            navigate("/dashboard");
          }}
        />
      </div>


      <div className="absolute sm:flex hidden flex-row justify-end gap-4 right-5 bottom-5">
      <CustomButton
          btnType="button"
          title="Logout"
          styles={address ? "bg-[#dc3545]" : "bg-[#8c6dfd]"}
          handleClick={() => {
            navigate("/logout");
          }}
        />
      </div>

      <div className="absolute w-12 h-12 bg-gray-700 hover:bg-blue-400 transition-colors rounded-full flex justify-center items-center left-5 bottom-5">
        <img src={sun} alt="sun_icon" className="w-1/2 h-1/2" />
      </div>
    </div>
  );
};

export default Navbar;
