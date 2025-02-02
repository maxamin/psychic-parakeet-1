import React from "react";

function Barcode({white}) {
  return (
    <svg
      width="151"
      height="34"
      viewBox="0 0 151 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={`${white ? 'white' : 'black'}`}
    >
      <rect width="9.52" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="13.6001" width="2.72" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="95.2" width="2.72" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="102" width="2.72" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="20.3999" width="9.52" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="108.8" width="9.52" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="73.4399" width="9.52" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="34" width="4.08" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="146.88" width="4.08" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="87.04" width="4.08" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="42.1599" width="4.08" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="50.3201" width="4.08" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="122.4" width="6.8" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="58.48" width="4.08" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="66.6399" width="2.72" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="133.28" width="2.72" height="34" fill={`${white ? 'white' : 'black'}`}/>
      <rect x="140.08" width="2.72" height="34" fill={`${white ? 'white' : 'black'}`}/>
    </svg>
  );
}

export default Barcode;
