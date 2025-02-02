import moment from 'moment'
import React, { useEffect, useState } from 'react'
import icons from '../components/icons'
import getColors from 'get-image-colors';
import { getRelativeLuminance, hexToRGB } from '../../utils';
import { ethers } from "ethers";
import Link from 'next/link';
function Ticket({ data }) {

    const [myTicket, setMyTicket] = useState(true)
    const [hexValues, setHexValues] = useState()
    const [white, setWhite] = useState(false)
    const [price, setPrice] = useState(ethers.utils.formatUnits(data.price.toString(), 'ether'))
    const [tokenId, setTokenId] = useState(ethers.BigNumber.from(data.tokenId).toNumber())
    console.log(tokenId)
    const getAllColors = async () => {
        let colorArr = new Array();
        await getColors(`https://daisycon.io/images/airline/?width=300&height=150&iata=${data.airlineCode.toLowerCase()}`).then(colors => {
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
    }, []);

    return (
        <div>
            <div className='flex gap-4 mb-10 items-center'>
                <p className='text-white text-base'>{data.departureAirportCode} - {data.arrivalAirportCode}</p>
                <icons.DownChevron myTicket={myTicket} onClick={() => { setMyTicket(!myTicket) }} />
            </div>
            {
                hexValues && hexValues[0] && myTicket &&
                <Link href={`https://testnets.opensea.io/assets/mumbai/0xac9ffee169c1646a4220135ef7d01f20459d6227/${tokenId}`}>
                    <div className='flex justify-start md:flex-col  my-10 ease-in-out duration-200'>
                        <div className='bg-whiteOne mx-0 justify-center items-center flex flex-col w-[859px] md:w-[300px] relative rounded-3xl md:border-b-2 md:border-r-0 border-r-2 border-dashed border-black'>
                            <img className='absolute opacity-20 md:scale-75' src={`https://daisycon.io/images/airline/?width=300&height=150&iata=${data.airlineCode}`} />
                            <div style={{ backgroundColor: hexValues[0] }} className=' flex md:flex-col px-20 md:py-4 justify-between items-center w-[860px]  md:w-[300px] h-[80px] rounded-tr-3xl rounded-tl-3xl'>
                                <div className='flex items-center justify-center md:w-[300px]  gap-2  md:gap-4 h-full'>
                                    <icons.Globe white={white} />
                                    <p className={`text-[20px] font-semibold text-${white ? 'white' : 'black'} `}>BOARDING PASS </p>
                                </div>
                                <p className='text-[16px] md:text-sm'>ECONOMY</p>
                            </div>
                            <div className='flex md:flex-col justify-center h-full w-[860px]  md:w-[300px] md:py-4'>
                                <div className='w-4/12 md:w-[300px] flex flex-col flex-wrap items-center justify-between py-6 '>
                                    <div>
                                        <p className='text-xs font-semibold'>PASSENGER </p>
                                        <p className='font-normal text-[32px]'>{data.name.toUpperCase().slice(0, 11)}</p>
                                    </div>
                                    <icons.Barcode />
                                </div>

                                <div className='w-3/12 md:w-[300px] md:items-center md:justify-center md:gap-4 flex flex-col justify-between items-start py-6 flex-wrap'>
                                    <div className='flex flex-col'>
                                        <p className='text-sm font-semibold'>FLIGHT {data?.flight?.slice(0, 2)} {data.flight?.slice(2)}</p>
                                        <p className='text-[10px]'>Terminal B</p>
                                    </div>
                                    <div className='flex leading-[20px] flex-col'>
                                        <p className='text-sm'>GATE</p>
                                        <p className='text-[32px] font-semibold'>32 A</p>
                                    </div>
                                    <div className='flex leading-[20px] flex-col'>
                                        <p className='text-sm'>SEAT</p>
                                        <p className='text-[32px] font-semibold'>20 A</p>
                                    </div>
                                </div>
                                <div className=' w-3/12 md:flex-row md:w-[300px] md:items-center md:justify-center md:gap-4 flex flex-col gap-4 justify-between items-start py-6 flex-wrap'>
                                    <div className='flex leading-[20px] flex-col'>
                                        <p className='text-sm'>BOARDING</p>
                                        <p className='text-[32px] font-semibold'>{moment(`${data.departureDateTime.split('+')[0]}`).subtract(1, 'hour').format("H:mm")}</p>
                                    </div>
                                    <div className='flex leading-[20px] flex-col'>
                                        <p className='text-sm'>TAKE OF</p>
                                        <p className='text-[32px] font-semibold'>{moment(`${data.departureDateTime.split('+')[0]}`).format("H:mm")}</p>
                                    </div>
                                </div>
                                <div className=' w-2/12  flex-col flex md:flex-row md:w-[300px] md:items-center md:justify-center md:gap-4 justify-between items-start  h-full py-6 '>
                                    <div className='flex flex-col'>
                                        <p className='text-xs font-semibold'>DEPARTURE</p>
                                        <p className='text-[10px]'>{moment(`${data.departureDateTime.split('+')[0]}`).format("H:mm")}</p>
                                        <p className='text-[10px]'>{data.departureAirportCode}</p>
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='text-xs font-semibold'>ARRIVAL</p>
                                        <p className='text-[10px]'>{moment(`${data.arrivalDateTime.split('+')[0]}`).format("H:mm")}</p>
                                        <p className='text-[10px]'>{data.arrivalAirportCode}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-whiteOne w-[200px] md:w-[300px] flex md:flex-col justify-center items-center relative rounded-3xl md:pl-0 pl-4'>
                            <img className='absolute opacity-20 md:scale-75 rotate-90' src={`https://daisycon.io/images/airline/?width=300&height=150&iata=${data.airlineCode}`} />
                            <div className='w-2/3 md:w-[300px] flex flex-col md:flex-row md:flex-wrap md:px-6 md:gap-4 py-6 h-full justify-between md:items-center items-start'>
                                <div className='flex md:w-full md:justify-center md:items-center leading-[20px] flex-col'>
                                    <p className='text-[10px] font-semibold'>PASSENGER </p>
                                    <p className='text-[20px] font-semibold'>{data.gender == 'Male' ? 'Mr.' : 'Ms.'} {data.name.split(' ')[0].slice(0, 4).toUpperCase()} {data.name.split(' ')[1].slice(0, 4).toUpperCase()}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <div className='flex leading-[20px] flex-col'>
                                        <p className='text-[8px]'>FROM</p>
                                        <p className='text-[18px] font-semibold'>{data.departureAirportCode}</p>
                                    </div>
                                    <div className='flex leading-[20px] flex-col'>
                                        <p className='text-[8px]'>TO</p>
                                        <p className='text-[18px] font-semibold'>{data.arrivalAirportCode}</p>
                                    </div>
                                </div>
                                <div className='flex leading-[20px] flex-col'>
                                    <p className='text-xs'>SEAT</p>
                                    <p className='text-[20px] font-semibold'>20 A</p>
                                </div>
                                <div className='flex leading-[20px] flex-col'>
                                    <p className='text-xs'>BOARDING</p>
                                    <p className='text-[20px] font-semibold'>{moment(`${data.departureDateTime.split('+')[0]}`).subtract(1, 'hour').format("H:mm")}</p>
                                </div>
                            </div>
                            <div style={{ backgroundColor: hexValues[0] }} className='relative w-1/3 md:hidden bg-yellow h-full flex rounded-tr-3xl rounded-br-3xl'>
                                <div className='-rotate-90 flex flex-col scale-[0.7] gap-2 justify-center items-center pb-3 w-full h-full'>
                                    <p className={`font-semibold w-[90px] text-center ${white ? 'text-white' : 'text-black'}`}>{data?.flight?.slice(0, 2)} {data.flight?.slice(2)}</p>
                                    <icons.Barcode white={white} />
                                </div>
                            </div>
                            <div className='relative md:w-[300px] hidden md:block bg-yellow h-full rounded-br-3xl rounded-bl-3xl'>
                                <div className='flex flex-col scale-[0.7] gap-2 justify-center items-center pb-3 w-full h-full'>
                                    <p className='text-sm font-semibold'>6E 998</p>
                                    <icons.Barcode />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            }
        </div>
    )
}

export default Ticket