import React, { useContext, useEffect, useState } from 'react'
import icons from './icons'
import MiniTicket from './MiniTicket'
import { NFTStorage, Blob } from 'nft.storage'
import { AirlineContext } from '../../constants/AirlineContext'
const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

function ViewTickets({ mintStart, setMintStart, tripDetails, details }) {




    const [isCapturing, setIsCapturing] = useState(false)
    const { currentPath, setCurrentPath, uris, setUris, setMintingStatusMessage, mintingStatusMessage } = useContext(AirlineContext);

    useEffect(() => {
        if(mintStart){
            setMintingStatusMessage( [...mintingStatusMessage, "Capturing tickets 📷 "])
            setCurrentPath(0)
            startMintingNFTs();
        }
        
    }, [mintStart])

    const startMintingNFTs = async () => {
        setIsCapturing(true)
        setCurrentPath(0)
    }

    return (
        <div className='flex relative justify-center w-full items-center gap-4'>
            {
                currentPath !== 0 && tripDetails.paths.length > 1 &&
                <div onClick={() => { currentPath !== 0 && setCurrentPath((prevPath) => prevPath - 1) }} className='absolute left-0 h-full flex items-center justify-center'>
                    <icons.LeftChevron carousel={true} />
                </div>
            }
            <MiniTicket setIsCapturing={setIsCapturing} uris={uris} setUris={setUris} isCapturing={isCapturing} setCurrentPath={setCurrentPath} noOfTickets={tripDetails.paths.length} details={details} currentPath={currentPath} path={tripDetails.paths[currentPath]} />
            {
                currentPath !== tripDetails.paths.length - 1 && tripDetails.paths.length > 1 &&
                <div onClick={() => { currentPath !== tripDetails.paths.length - 1 && setCurrentPath((prevPath) => prevPath + 1) }} className='absolute right-0 flex items-center justify-center'>
                    <icons.RightChevron carousel={true} />
                </div>
            }
        </div>
    )
}

export default ViewTickets