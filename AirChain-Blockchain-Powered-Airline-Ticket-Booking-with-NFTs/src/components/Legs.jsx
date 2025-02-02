import React from 'react'
import moment from "moment"
import { minutesToHours } from '../../utils'

function Legs({ paths, n }) {

    if (n == 1) {
        return (
            <div className={`flex justify-between items-center w-full`}>
                <div className='flex flex-col justify-center items-center relative group cursor-pointer'>
                    <p>{moment(paths[0].departureDateTime).format("H:mm")}</p>
                    <p>{paths[0].departureAirportCode}</p>
                </div>
                <div className='flex justify-center items-center cursor-pointer w-full relative border-dashed border border-b-0 border-gray-400 h-[4px] mx-3'>
                    <div className='text-xs -translate-y-4'>{minutesToHours(paths[0].durationMinutes)}</div>
                </div>
                <div className='flex flex-col justify-center items-center relative group cursor-pointer'>
                    <p>{moment(paths[0].arrivalDateTime).format("H:mm")}</p>
                    <p>{paths[0].arrivalAirportCode}</p>
                </div>
            </div>
        )
    }

    if (n == 2) {

        return (
            <div className={`flex justify-between items-center w-full`}>
                <div className='flex flex-col justify-center items-center relative group cursor-pointer'>
                    <p>{moment(paths[0].departureDateTime).format("H:mm")}</p>
                    <p>{paths[0].departureAirportCode}</p>
                </div>
                <div className='flex justify-center items-center cursor-pointer w-full relative border-dashed border border-b-0 border-gray-400 h-[4px] mx-3'>
                    <div className='text-xs -translate-y-4'>{minutesToHours(paths[0].durationMinutes)}</div>
                </div>
                <div className='flex flex-col justify-center items-center relative group cursor-pointer'>
                    <p>{moment(paths[0].arrivalDateTime).format("H:mm")}</p>
                    <p>{paths[0].arrivalAirportCode}</p>
                    <div className="absolute left-[-8px] top-[-35px] scale-0 duration-800 ease-in-out transition-all rounded bg-blue p-2 text-xs text-white w-max group-hover:scale-100">{minutesToHours(paths[0].stopoverDurationMinutes)}</div>
                </div>
                <div className='flex justify-center items-center cursor-pointer w-full relative border-dashed border border-b-0 border-gray-400 h-[4px] mx-3'>
                    <div className='text-xs -translate-y-4'>{minutesToHours(paths[1].durationMinutes)}</div>
                </div>
                <div className='flex flex-col justify-center items-center relative group cursor-pointer'>
                    <p>{moment(paths[1].arrivalDateTime).format("H:mm")}</p>
                    <p>{paths[1].arrivalAirportCode}</p>
                </div>
            </div>
        )
    }

    return (
        paths.map((path, index) => {
            return (
                <div key={index} className={`flex justify-between items-center ${index != n && 'w-full'}`}>

                    <div className='flex flex-col justify-center items-center relative group cursor-pointer'>
                        <p>{moment(path.departureDateTime.split('+')[0]).format("H:mm")}</p>
                        <p>{path.departureAirportCode}</p>
                        {
                            index !== 0 && index !== n &&
                            <div className="absolute left-[-8px] top-[-35px] scale-0 duration-800 ease-in-out transition-all rounded bg-blue p-2 text-xs text-white w-max group-hover:scale-100">{minutesToHours(paths[index - 1].stopoverDurationMinutes)}</div>
                        }
                    </div>

                    <div className='flex justify-center items-center cursor-pointer w-full relative border-dashed border border-b-0 border-gray-400 h-[4px] mx-3'>
                        <div className='text-[10px] -translate-y-4'>{minutesToHours(path.durationMinutes)}</div>
                    </div>
                </div>
            )
        })
    )
}

export default Legs