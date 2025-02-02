import moment from 'moment'
import React, { useContext, useEffect, useRef, useState } from 'react'
import icons from './icons'

import getColors from 'get-image-colors';
import { NFTStorage, Blob } from 'nft.storage'
import { getRelativeLuminance, hexToRGB } from '../../utils';
import { AirlineContext } from '../../constants/AirlineContext';
const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

function MiniTicket({ uris, path, setIsCapturing, setUris, isCapturing, currentPath, details, noOfTickets, setCurrentPath, setMintingStatusMessage, mintingStatusMessage, }) {

    const [hexValues, setHexValues] = useState()
    const [white, setWhite] = useState(false)

    const { captureImage } = useContext(AirlineContext);

    const divRef = useRef(null);
    const [scale, setScale] = useState('scale-100')

    const startCapturing = async () => {
        await captureImage(divRef, setScale, setCurrentPath, noOfTickets, setIsCapturing);
    }

    useEffect(() => {
        if (isCapturing) {
            setScale('scale-[3]')
        }
    }, [isCapturing, path])


    useEffect(() => {
        if (scale === 'scale-[3]' && isCapturing) {
            startCapturing();
        }
    }, [scale, currentPath])

    const getAllColors = async () => {
        let colorArr = new Array();
        await getColors(`https://daisycon.io/images/airline/?width=300&height=150&iata=${path.airlineCode.toLowerCase()}`).then(colors => {
            colors.map((color) => {
                colorArr.push(color.hex())
            })
        })
        let hexColour = colorArr[0];
        const rgbColor = hexToRGB(hexColour);
        const luminance = getRelativeLuminance(rgbColor);

        if (luminance > 0.3) {
            setWhite(false)
        } else {
            setWhite(true)
        }
        setHexValues(colorArr)
    }

    useEffect(() => {
        getAllColors()
    }, [currentPath]);

    if (hexValues && hexValues[0] && path && path.airlineCode) {
        return (
            <div ref={divRef} onClick={startCapturing} className={`flex ${scale} p-2  justify-center  my-10 ease-in-out duration-200 h-[260px]`}>
                <div className='bg-whiteOne w-[200px]  flex  justify-center items-center relative rounded-3xl  pl-4'>
                    <img className='absolute opacity-30  rotate-90' src={`https://daisycon.io/images/airline/?width=300&height=150&iata=${path.airlineCode}`} />
                    <div className='w-2/3  flex flex-col  py-6 h-full justify-between  items-start'>
                        <div className='flex   leading-[20px] flex-col'>
                            <p className='text-[8px]'>PASSENGER </p>
                            <p className='text-[20px] font-semibold'>{details.gender == 'Male' ? 'Mr.' : 'Ms.'} {details.fname.slice(0, 4).toUpperCase()} {details.lname.slice(0, 4).toUpperCase()}</p>
                        </div>
                        <div className='flex gap-2'>
                            <div className='flex leading-[20px] flex-col'>
                                <p className='text-[8px]'>FROM</p>
                                <p className='text-[18px] font-semibold'>{path.departureAirportCode}</p>
                            </div>
                            <div className='flex leading-[20px] flex-col'>
                                <p className='text-[8px]'>TO</p>
                                <p className='text-[18px] font-semibold'>{path.arrivalAirportCode}</p>
                            </div>
                        </div>
                        <div className='flex leading-[20px] flex-col'>
                            <p className='text-[8px]'>SEAT</p>
                            <p className='text-[20px] font-semibold'>20 A</p>
                        </div>
                        <div className='flex leading-[20px] flex-col'>
                            <p className='text-[8px]'>TAKE OFF</p>
                            <p className='text-[20px] font-semibold'>{moment(path.departureDateTime).format('HH:mm')}</p>
                        </div>
                    </div>
                    <div style={{ backgroundColor: hexValues[0] }} className={`relative w-1/3 h-full flex rounded-tr-3xl rounded-br-3xl`}>
                        <div className='-rotate-90 z-0 flex flex-col scale-[0.7] gap-2 justify-center items-center pb-3 w-full h-full'>
                            <p className={`font-semibold w-[90px] text-center ${white ? 'text-white' : 'text-black'}`}>{path.designatorCode.slice(0, 2)} {path.designatorCode.slice(2)}</p>
                            <icons.Barcode white={white} />
                        </div>
                    </div>
                    <div className='relative z-0 hidden bg-yellow h-full rounded-br-3xl rounded-bl-3xl'>
                        <div className='flex flex-col scale-[0.7] gap-2 justify-center items-center pb-3 w-full h-full'>
                            <p className='font-semibold'>{path.designatorCode.slice(0, 2)} {path.designatorCode.slice(2)}</p>
                            <icons.Barcode />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MiniTicket