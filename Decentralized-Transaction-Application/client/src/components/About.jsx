import React from "react";
import { saket, sai, ether } from "../assets";

const About = ({ color, title, image, subtitle1, subtitle2 }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl">
    <div
      className={`w-10 h-10 rounded-full flex justify-center items-center ${color} about`}
    >
      {image ? (
        <img
          src={image}
          alt={`Image of ${title}`}
          className="w-10 h-10 about-img rounded-full"
        />
      ) : null}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-2 text-white text-sm md:w-9/12">
        {subtitle1}
        <p>{subtitle2}</p>
      </p>
    </div>
  </div>
);

const AboutCard = () => (
  <div className="flex w-full justify-center items-center gradient-bg-aboutcard">
    <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
      <div className="flex-1 flex flex-col justify-start items-start">
        <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
          Name of the College, Student and Project.
        </h1>
        <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
          The purpose of this crypto exchange project is to enable the exchange
          of Ethereum, offering users a platform to transfer their digital
          assets securely and conveniently.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-start items-center">
        <About
          color=""
          title="SAKET COLLEGE OF ARTS, SCIENCE & COMMERCE"
          image={saket}
          subtitle=""
        />
        <About
          color=""
          title="TERUKULA SAI"
          image={sai}
          subtitle1="PNR No : 2021016400730531"
          subtitle2="Roll No : 233026 "
        />
        <About
          color=""
          title="Decentralized Transaction Web3 Application"
          image={ether}
          subtitle=""
        />
      </div>
    </div>
  </div>
);

export default AboutCard;
