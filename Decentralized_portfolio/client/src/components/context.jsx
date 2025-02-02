
import React,{ useState,useContext} from 'react';



const TrackingContext = React.createContext();

export const TrackingProvider=({children})=>{
    const [state,setState] = useState({
    web3:null,
    contract:null
  })

  const saveState=(state)=>{
    console.log(state)
    setState(state)

    

  }

  return (
    <TrackingContext.Provider value={{state,saveState}}
                               >
      {children}
    </TrackingContext.Provider>
  );

 

}

export const useMyContext = () => {
    return useContext(TrackingContext);
  };

