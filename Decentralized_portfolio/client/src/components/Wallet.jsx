import React, { useState} from "react";
import ABI from "./mobilefirstApproach/ABI/abi.json";
import {Web3} from "web3";
import { useMyContext } from "./context";

const Wallet = () => {
  const [Connected,setConnected] = useState(false)
  // const {saveState} = useContext(useMyContext);
  const {saveState} = useMyContext();
  const init = async() => {
    try{
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({method:"eth_requestAccounts"});
      const contract = new web3.eth.Contract(
        ABI,
        "0x5B3ff4B219CbfEA71f94bf79591EF765508Ac7c0"
      )
      setConnected(true)
      console.log(contract)
      saveState({web3:web3,contract:contract})
      
    }catch(error){ console.log(error,"Please alert metamask");

    }
  


  }
  return (
    <div>
      <h1 className="h-[50px] w-[150px] grid mt-2
       bg-zinc-800  hover:bg-zinc-600 font-Inter rounded-lg text-center place-items-center
        text-white shadow-lg mx-2 text-lg" onClick={init} disabled ={Connected} >
          {!Connected?"Connect Wallet":"Connected"} 
      
      </h1>
    </div>
  );
};

export default Wallet;
