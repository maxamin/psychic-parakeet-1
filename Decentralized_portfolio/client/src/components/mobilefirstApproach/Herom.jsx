import React,{useState,useEffect,useContext} from "react";
import Navbarm from "./Navbarm";
import IMG from "../images/Hero_img.jpg";
import Handles from "../Handles";
import Navbar from "../Navbar";
import { useMyContext } from "../context";


const Herom = () => {
  // const {saveState} = useContext(useMyContext);
  // const saveState = useMyContext();

  const [description,setDescription] =useState("")
  const [heroImage,setHeroImage] = useState("")
  const [techProf,setTechProf] = useState("")
  const [openModal,setOpenModal] =useState(false)
  const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);
  const { state } = useMyContext();


  useEffect(() => {
  
      const { contract } = state;
  
      const description = async() => {
         
        const descriptionText = await contract.methods.heroBackground().call();
        
        console.log(descriptionText);
        setDescription(descriptionText);
      }
      contract && description();


    
  }, [state]);

  useEffect(() => {
  
    const { contract } = state;
    console.log("statey:", state);
  console.log("contracty:", contract);
    const heroImg = async() => {
       
      const heroImage = await contract.methods.heroImage().call();
      // const projects = await contract.methods.allProjects().call();
      console.log(heroImage);
      setHeroImage(heroImage);
    }
    contract && heroImg();


  
}, [state]);

useEffect(() => {
  
  const { contract } = state;
  console.log("statex:", state);
  const technicalProf = async() => {
     
    const techProf = await contract.methods.allTechnicalProficiency().call();
    // const projects = await contract.methods.allProjects().call();
    console.log("techProf:",techProf);
    setTechProf(techProf);
  }
  contract && technicalProf();



}, [state]);



  useEffect(() => {
    const handleResize = () => {
      setIsMdScreen(window.innerWidth >= 700);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);}
      }, []);

      const ToggleModal = (() =>{
         
        setOpenModal(!openModal)


      })

   




  return (
    <div className="flex flex-col items-center justify-center bg-paper w-full md:h-screen md:relative">
      <div className="md:absolute md:z-10 md:top-0 w-full ">
   
       {isMdScreen ? <Navbar /> : <Navbarm />}
      </div>
      <div className="flex flex-col justify-start md:flex-row md:top-0 md:h-full md:absolute md:w-full items-center py-5 md:p-0">
   
        <div className=" w-full md:h-full md:w-5/12  md:items-center  flex justify-center items-center   md:bg-slate-500 ">
          {" "}
          <div   className=" w-[310px] md:w-full md:flex md:justify-start md:items-start mt-10 md:mt-0  justify-center items-center md:bg-red-400 overflow-hidden ">
            <img
              src={`https://gateway.pinata.cloud/ipfs/${heroImage}`}
              alt="Hero_img"
              className=" w-full md:object-cover md:h-screen "
            ></img>
          </div>
        </div>
      
          {" "}
          <div className="w-full md:w-3/6   rounded-lg flex flex-col items-center justify-center px-7 mt-[30px] md:mt-[50px] gap-2 md:items-start md:h-full ">
            <p className="text-[40px] py-1 text-gray-900 font-bebas-neue md:text-[40px] lg:text-[60px]  ">
              PRANABANTI KARMAAKAR
            </p>
            <p className="text-base p-1 text-gray-500 text-justify w-[310px] md:w-[390px] lg:w-[460px] ">
              {" "}
              Greetings! I am an emerging blockchain developer. I am enthusiastic about leveraging my skills and knowledge to contribute to innovative projects and help shape the future of decentralized applications.
            </p>
            <div className=" font-Inter p-1 text-justify text-gray-400 text-sm  w-[310px] md:w-[390px] lg:w-[460px] ">
         
              {description}
<div className="py-5  text-sm"> 
<p className="text-base font-bold text-zinc-700 pb-2 ">Technical Proficiency</p>
<ul>
  {techProf !== "" && techProf.map((el,index)=>(<li key={index} ><span className="text-zinc-500 font-bold">{el.title}:</span> {el.description}</li>) )}
{/* <li><span className="text-zinc-500 font-bold">Writting Efficient Smart Contract:</span> I have adeptly crafted and deployed smart contracts using Solidity, comfortably composing functions, establishing data structures, and managing events to realize intricate business logic on the blockchain.</li>
<li><span className="text-zinc-500 font-bold">Building Decentralized Application:</span> I am well-versed in developing decentralized applications on platforms like Ethereum and Polygon blockChain. My expertise encompasses constructing user interfaces, integrating front-end frameworks like React, and seamlessly linking these with smart contracts via Web3.js, Ether.js, Hardhat & Truffle.</li> */}
{/* <li><span className="text-zinc-500 font-bold">Understanding varied Blockchain Tools:</span>  My familiarity with blockchain development tools such as Truffle, Hardhat, Remix, and Ganache has allowed me to expedite the development, testing, and deployment of smart contracts and decentralized applications.</li> */}
{/* <li><span className="text-zinc-500 font-bold">Holistic Understanding of Blockchain Concepts:</span>  My knowledge spans blockchain fundamentals, encompassing consensus mechanisms, cryptography, wallet systems, and token standards such as ERC-20 and ERC-721.</li> */}
</ul>
</div>


<div className="w-full flex items-center justify-center"><button className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-lg text-white rounded-lg " onClick={ToggleModal} >Let's Talk</button></div>
               {openModal? (    <div className="flex justify-center items-start overflow-x-hidden  overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-max my-6 mx-auto max-w-3xl flex justify-center items-center">
            <div  onClick={() => setOpenModal(false)} className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-zinc-700 outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-zinc-600 rounded-t ">
                <h3 className="text-lg text-Inter font=semibold text-start text-white">
                aankkhiz@gmail.com
                  </h3>
                
             
             </div>
             </div>
             </div>
             </div>):null}
             
             
             
             {/* {description} */}
            </div>
          </div>
       
        
        <div className="flex items-end md:mb-20 md:h-full py-5" ><Handles /></div>
        
      </div>
    </div>
  );
};

export default Herom;
