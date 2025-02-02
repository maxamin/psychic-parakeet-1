import React,{useState,useEffect} from 'react';
import ABI from "./ABI/abi.json";
import Web3 from "web3";
import { useMyContext } from "../context";

const Walletm = () => {
  const [Connected,setConnected] = useState(false)
  const[connectedAccount,setConnectedAccount] = useState("");
  const {saveState} = useMyContext();
  const init = async() => {
    try{
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({method:"eth_requestAccounts"});
     
      console.log("connected account:",accounts[0])
      
      const contract = new web3.eth.Contract(
        ABI,
        "0x43C4f7ad915aBAc2C7E79Ccbd5ADE9d8133af844"
      )

      setConnected(true)
     
      console.log(contract);
      saveState({web3:web3,contract:contract})
      setConnectedAccount(accounts[0]);
      
    }catch(error){ console.log(error,"Please alert metamask");

    }
  
    console.log("2:",connectedAccount)

  }

  // useEffect(() => {
  //   console.log("connectedAccount:", connectedAccount);
  // }, [connectedAccount]);
  return (
    <div>
    <button className="
     bg-zinc-800 hover:!bg-zinc-700 font-Inter rounded-lg h-[36px] w-[150px] p-1 grid text-center place-items-center
      
      text-white shadow-lg mx-2 " onClick={init} disabled ={Connected} >
         {Connected?connectedAccount.slice(0,10):"Connect Wallet"} 
    
    </button>
  </div>
  )
}

export default Walletm;