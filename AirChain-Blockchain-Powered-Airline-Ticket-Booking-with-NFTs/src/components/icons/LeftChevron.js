import React from "react";

function LeftChevron({ extreme, onClick, carousel }) {
  if (extreme) {
    return (
      <svg
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="#E0D817"
        className="w-6 h-6 cursor-pointer hover:-translate-x-1 duration-300 ease-in-out"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
        />
      </svg>
    );
  }
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={`${ carousel ? '#0F172A' : '#F7F6F0'}`}
      className="w-6 h-6 cursor-pointer hover:-translate-x-1 duration-300 ease-in-out"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
  );
}

export default LeftChevron;
