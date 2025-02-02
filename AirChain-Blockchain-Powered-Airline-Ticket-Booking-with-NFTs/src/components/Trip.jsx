import React, { useContext } from 'react'
import Legs from './Legs'
import moment from "moment"
import { AirlineContext } from '../../constants/AirlineContext'

function Trip({ trip, setModal }) {
    const { setTripDetails } = useContext(AirlineContext)
    return (
        <div className='bg-white rounded-[20px] shadow-lg w-full flex flex-wrap'>
            <div className='flex justify-center items-center w-3/12 p-4 border-r-2 border-dashed'>
                <div className='flex flex-col gap-4 justify-center items-center max-w-[120px]'>
                    {
                        trip.airlines.map((code, index) => {
                            return (
                                <img key={index} src={`https://daisycon.io/images/airline/?width=300&height=150&iata=${code}`} />
                            )
                        })
                    }

                </div>
            </div>
            <div className='flex flex-col items-center justify-center w-6/12 py-6 px-8'>
                <div className='flex items-center justify-around w-full'>
                    <p className='text-blue'>{trip.isConnecting ? trip.paths.length - 1 + ' Stops' : 'Direct'}</p>
                    <div className='flex bg-yellow items-center justify-center rounded-lg my-3'>
                        <p className='text-blue px-6 py-2'>{trip.totalTime.toUpperCase()}</p>
                    </div>
                </div>
                <div className='flex justify-between w-full items-center'>
                    <Legs paths={trip.paths} n={trip.paths.length} />
                    {
                        trip.paths.length > 2 &&
                        <div className='flex flex-col justify-center items-center relative group cursor-pointer'>
                            <p>{moment(trip.paths[trip.paths.length - 1].arrivalDateTime.split('+')[0]).format("H:mm")}</p>
                            <p>{trip.paths[trip.paths.length - 1].arrivalAirportCode}</p>
                        </div>
                    }
                </div>
            </div>
            <div className='flex w-3/12 bg-blue rounded-tr-[20px] shadow-lg flex-col items-center justify-center gap-4 rounded-br-[20px]'>
                <p className='text-yellow font-semibold text-lg'>USD ${trip.price}</p>
                <div onClick={() => { setModal(true); setTripDetails(trip) }} className='bg-whiteTwo px-4 py-2 rounded-xl cursor-pointer'>
                    <p className='text-blue'>Select</p>
                </div>
            </div>

        </div>
    )
}

export default Trip