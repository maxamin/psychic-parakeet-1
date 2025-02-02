import React, { useEffect, useState } from 'react'
import InputField from './InputField'
import icons from '../icons'
import airports from "../../data/airports.json"
import Link from 'next/link'

function SearchFlights() {

  const [airportsList, setAirportsList] = useState(airports)
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [filteredTo, setFilteredTo] = useState("")
  const [filteredFrom, setFilteredFrom] = useState("")
  const [oneWay, setOneWay] = useState(false)
  const [adults, setAdults] = useState(1)
  const [departure, setDeparture] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)

  useEffect(() => {
    if (from) {
      handleSearch(from);
    }
  }, [from]);

  useEffect(() => {
    if (to) {
      handleSearch(to);
    }
  }, [to]);

  const handleSearch = (value) => {
    if (from && !from.includes(',')) {
      const filteredAirport = airportsList.filter(({ city, code }) => city.toLowerCase().includes(value.toLowerCase()) || code.toLowerCase().includes(value.toLowerCase()));
      setFilteredFrom(filteredAirport)
    } else if (to) {
      const filteredAirport = airportsList.filter(({ city, code }) => city.toLowerCase().includes(value.toLowerCase()) || code.toLowerCase().includes(value.toLowerCase()));
      setFilteredTo(filteredAirport)
    }
  };

  const interchangeDestinations = () => {
    var dummy = from;
    setTo(dummy);
    setFrom(to)
  }

  // const searchFlights = () =>{
  //   router.push(`/search/oneWay?${oneWay}&from?${from.split(",")[0]}&to?${to.split(",")[0]}&date?${departure}&adults?${adults}&children?${children}&infants?${infants}`)
  // }

  return (
    <div className='flex w-screen h-screen items-center justify-around'>
      <div></div>
      <div
        className="flex gap-3 flex-col px-8 py-10 z-10 w-[400px]  bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl drop-shadow-lg"
      >
        <InputField label={'From'} value={from} setValue={setFrom} />
        {from && filteredFrom && filteredFrom.length > 0 &&
          <div className='bg-white w-[340px] z-10 bg-[rgb(255,255,255,0.7)] backdrop-blur-lg rounded-2xl drop-shadow-lg absolute top-[100px] p-4'>
            {
              filteredFrom.slice(0, 5).map((air, index) => {
                return (
                  <div index={index}>
                    <p onClick={() => {
                      setFrom(`${air.code}, ${air.city}`)
                      setFilteredFrom('')
                    }} className='text-center rounded-lg p-2 hover:text-white cursor-pointer hover:bg-[#3757de]'>{air.city}, <span className='font-bold'>{air.code}</span> </p>
                  </div>
                )
              })
            }
          </div>
        }
        <div onClick={interchangeDestinations} className="cursor-pointer flex items-center justify-center bg-[rgba(255,255,255)] w-9 h-9 absolute right-[50px] top-[85px] rounded-full">
          <icons.UpDown />
        </div>
        <InputField label={'To'} value={to} setValue={setTo} />
        {to && filteredTo && filteredTo.length > 0 &&
          <div className='bg-white w-[340px] z-10 bg-[rgb(255,255,255,0.7)] backdrop-blur-lg rounded-2xl drop-shadow-lg absolute top-[180px] p-4'>
            {
              filteredTo.slice(0, 5).map((air, index) => {
                return (
                  <div index={index}>
                    <p onClick={() => {
                      setTo(`${air.code}, ${air.city}`)
                      setFilteredTo('')
                    }} className='text-center rounded-lg p-2 hover:text-white cursor-pointer hover:bg-[#3757de]'>{air.city}, <span className='font-bold'>{air.code}</span> </p>
                  </div>
                )
              })
            }
          </div>
        }

        <div className='flex justify-start gap-2'>
          <InputField value={departure} setValue={setDeparture} type="date" label={"Departure"} />

        </div>
        <div className='flex px-2 gap-2 justify-center'>
          <InputField label={'Adults'} value={adults} setValue={setAdults} type="counter" />
          <InputField label={'Children'} value={children} setValue={setChildren} type="counter" />
          <InputField label={'Infants'} value={infants} setValue={setInfants} type="counter" />
        </div>
        <Link href={{ pathname: '/search', query: {
          oneWay,
          from : from.split(",")[0],
          to : to.split(",")[0],
          departure,
          returnDate,
          adults,
          children,
          infants
        } }}>
          <div className='bg-[#00c7bb] w-full flex justify-center items-center py-2 px-4 rounded-2xl cursor-pointer hover:bg-[#3757de]'>
            <p className='text-white text-lg font-semibold'>Search</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default SearchFlights