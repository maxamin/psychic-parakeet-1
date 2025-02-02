import React from "react";

function DownChevron({ onClick, myTicket, filterOpen }) {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="#F7F6F0"
      className={`w-6 h-6 cursor-pointer duration-300 ease-in-out  ${
        myTicket || filterOpen ? "rotate-180" : ""
      }`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export default DownChevron;
