import React, { useState } from 'react'
import moment from "moment"
import { minutesToHours } from '../../../utils'
import { terms } from '../../data/terms'
import { Checkbox } from "@nextui-org/react";

function ConfirmYourDetails({ tripDetails, check, setCheck }) {
    return (
        <div className='flex flex-col gap-6 w-full pt-5'>
            <div className='flex justify-between w-full items-center'>
                <div className='flex flex-col justify-center items-center'>
                    <p className='font-semibold '>{tripDetails.from}</p>
                    <p>{moment(tripDetails.paths[0].departureDateTime).format("H:mm")}</p>
                </div>
                <div className='flex justify-around items-center cursor-pointer w-full relative border-dashed border border-b-0 border-gray-400 h-[4px] mx-3'>
                    <div className='text-xs absolute -translate-y-6'>{minutesToHours(tripDetails.paths[0].durationMinutes)}</div>
                    {
                        tripDetails.paths.length > 1 && tripDetails.paths.slice(0, tripDetails.paths.length - 1).map((path, index) => {
                            return (
                                <div key={index} className='relative w-[8px] h-[8px] rounded-full -translate-y-[1px] flex items-center justify-center bg-blue border-[1px] border-gray-500'>
                                    <p className='absolute text-[10px] top-2'>{path.arrivalAirportCode}</p>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <p className='font-semibold '>{tripDetails.to}</p>
                    <p>{moment(tripDetails.paths[0].arrivalDateTime).format("H:mm")}</p>
                </div>
            </div>
            <div className='flex flex-col'>
                <div className='flex items-start justify-start w-full gap-2'>
                    <p>Total price: <span className='font-semibold text-2xl'>{(tripDetails.price/100000).toFixed(4)} MATIC</span> </p>
                    <img className='w-[25px] h-[25px]' src='./MATIC.png'></img>
                </div>
                <div className='flex items-start justify-start w-full gap-2'>
                    <p>Flight time: <span className='font-semibold text-lg'>{tripDetails.totalTime}</span> </p>
                </div>
                <div className='flex items-start justify-start w-full gap-2'>
                    <p>Cabin: <span className='font-semibold text-lg'>Economy</span> </p>
                </div>
                <div className='flex items-start justify-start w-full gap-2'>
                    <p>Stops: <span className='font-semibold text-lg'>{tripDetails.stopoversCount}</span> </p>
                </div>
                <div className='py-2'>
                    {
                        terms.map((term, index) => {
                            return (
                                <p className='text-[10px]'>{index + 1}. {term}</p>
                            )
                        })
                    }
                </div>
                <Checkbox color='warning' autoFocus isSelected={check} onChange={setCheck} defaultSelected size="xs" css={{ fontSize: "10px", color : '#E0D817' }}>
                    I agree to the above terms and conditions.
                </Checkbox>
            </div>
        </div>
    )
}

export default ConfirmYourDetails