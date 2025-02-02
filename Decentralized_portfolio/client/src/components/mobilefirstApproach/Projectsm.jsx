import React, { useState, useEffect } from "react";
import IMG1 from "../images/D1.jpg";
import IMG2 from "../images/D2.jpg";
import IMG3 from "../images/D3.jpg";
import { MdHealthAndSafety } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import { FaCoffee } from "react-icons/fa";
import { useMyContext } from "../context";
import Modal from "./Modal1";

const Projectsm = () => {
  const [modal, setModal] = useState("");
  const [showModal, setShowModal] = useState(false);
  // const []
  const [modalIsOpen, setOpenModal] = useState(false);
  const [projects, setProjects] = useState("");
  const { state } = useMyContext();

  useEffect(() => {
    const { contract } = state;
    // console.log("state:", state);
    // console.log("contract:", contract);
    // console.log(5);
    const projectDetails = async () => {
      // console.log(6);

      const projects = await contract.methods.allProjects().call();
      console.log(projects);
      setProjects(projects);
    };
    contract && projectDetails();
  }, [state]);

  const toggleModal = () => {
    console.log("called");
    setShowModal(true);
    console.log("aftercalled");
  };

  const donateEth = async (event) => {
    console.log("I am here");
    event.preventDefault();
    try {
      const { contract, web3 } = state;
      console.log("web3:", web3);
      const eth = document.querySelector("#eth").value;
      console.log("eth:", eth);
      const weiValue = web3.utils.toWei("0.1", "ether");
      //const amountWei = web3.utils.toWei(amount, "ether")
      console.log("weiValue:", weiValue);
      console.log("contract:",contract)
      const accounts = await web3.eth.getAccounts();
      // const accounts = await web3.eth.getAccounts()
      console.log("accounts:", accounts);
       await contract.methods.
        donation()
        .send({ 
          from:accounts[0], 
          value:weiValue,
          gas: 4800000,
          
           }).on('receipt', receipt => {
        console.log(receipt.status); // BigInt(0) | BigInt(1)
    });
        //  const transaction = await contract.methods
        //  .donation(weiValue)
        //  .send({ 
        //    from: accounts[0], 
        //    gas: 3000000 
          
        //   });
        alert("Transaction succesful");
        // const transactionHash = receipt.transactionHash;

        //  console.log("transactionHash",transactionHash)
       
    
     
      window.location.reload();
    } catch (error) {
      console.log("Error:", error);
      alert("Transaction not Succesful");
    }
  };

  const Content = [
    {
      image: (
        <FaCoffee style={{ height: "200px", width: "250px", color: "gray" }} />
      ),
      images: IMG1,
      title: "CHAI APP?",
      alt: "first Dapp",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      githubLink: "Lorem ipsum dolor",
      Website: "Lorem ipsum dolor",
    },
    {
      image: (
        <MdHealthAndSafety
          style={{ height: "200px", width: "250px", color: "gray" }}
        />
      ),
      images: IMG2,
      title: "NHS App",
      alt: "first Dapp",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      githubLink: "Lorem ipsum dolor",
      Website: "Lorem ipsum dolor",
    },
    {
      image: (
        <FaShippingFast
          style={{ height: "200px", width: "250px", color: "gray" }}
        />
      ),
      images: IMG3,
      title: "Shipment App",
      alt: "first Dapp",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      githubLink: "Lorem ipsum dolor",
      Website: "Lorem ipsum dolor",
    },
  ];
  return (
    <div className="w-full flex flex-col  items-center justify-center bg-paper mb-10 px-5 md:px-10">
      <div className="font-bebas-neue text-gray-900 font-medium mt-8 text-[30px] py-5 mb-2">
        Projects
      </div>
      <div className="w-full flex flex-col md:flex-row gap-10 md:gap-2 items-center justify-center ">
        {projects !== "" &&
          projects.map((el, index) => {
            return (
              <div
                className="w-full md:w-1/3 bg-stone-200 shadow-lg flex flex-col justify-center items-center "
                key={index}
              >
                <div className="h-[300px] w-[300px] rounded-lg flex flex-col items-center justify-center">
                  {/* <div className="mt-20 mb-0 h-[]">{el.image}</div> */}
                  <div className="overflow-hidden h-2/3 w-full mt-5">
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${el.image}`}
                      alt={index}
                      className=" object-cover mb-0 h-[]"
                    />
                  </div>
                  <div className=" font-semibold md:w-full text-center text-[30px] py-1 text-gray-900 font-bebas-neue mt-0">
                    {el.name}
                  </div>
                </div>
                <div className="h-[100px]  flex items-center justify-center gap-4 mt-4">
                  <div className="   bg-neutral-800 text-white rounded-md shadow-lg text-sm  md:px-3 lg:text-base font-Inter px-2 py-2">
                    White Papers
                  </div>
                  <a
                    href={`https://github.com/PranabantiKarmaakar99/${el.githubLink}`}
                    target="_blank"
                    className="   bg-neutral-800 text-white rounded-md shadow-lg text-sm  font-Inter lg:text-base md:px-3 px-2 py-2"
                  >
                    Website Link
                  </a>
                </div>
              </div>
            );
          })}
      </div>
      <button
        className=" bg-zinc-800  mt-10 rounded-lg text-gray-200 text-center py-2 px-12 text-Inter hover:bg-zinc-700"
        onClick={toggleModal}
      >
        Like the Project? Donate Eths.{" "}
      </button>
      {/* { modalIsOpen && <Modal  isOpen={modalIsOpen} onClose={closeModal} />}  */}
      {showModal ? (
        <>
          <div className="flex justify-center items-start overflow-x-hidden  overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-[600px] my-6 mx-auto max-w-3xl flex justify-center items-center bg-blue-200">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-lg text-Inter font=semibold text-start">
                    Enter the amount of Eth you want to Donate
                  </h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black opacity-7  text-xl  py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <form className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full">
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      id="eth"
                    />
                    <button
                      className="text-white text-Inter bg-zinc-500 w-full active:bg-yellow-700 font-bold uppercase text-lg px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={donateEth}
                    >
                      Send
                    </button>
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b"></div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Projectsm;
