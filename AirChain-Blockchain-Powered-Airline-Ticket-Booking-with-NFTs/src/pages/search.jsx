import React, { useContext, useEffect, useState } from 'react'
import SearchResults from '../components/SearchResults';
import Icons from '../components/icons';
import Slider from 'react-input-slider';
import Modals from '../components/Modals';
import PersonalInformation from '../components/Modals/PersonalInformation';
import ConfirmYourDetails from '../components/Modals/ConfirmYourDetails';
import ViewTickets from '../components/ViewTickets';
import { AirlineContext } from '../../constants/AirlineContext';
import Loader from '../components/Loader';
import Head from "next/head";
import { useRouter } from 'next/router';
function Search() {
    const router = useRouter();
    const sliderSlides = {
        track: {
            backgroundColor: '#0F172A'
        },
        active: {
            backgroundColor: '#e7e7e7'
        },
        thumb: {
            width: 25,
            height: 25
        },
    }

    const { details, setDetails, tripDetails, setTripDetails, recover, mintingStatusMessage, setMintingStatusMessage } = useContext(AirlineContext)
    const [filterOpen, setFilterOpen] = useState(false)
    const [maxPrice, setMaxPrice] = useState("")
    const [filter, setFilter] = useState("")
    const [titleOfPage, setTitleOfPage] = useState("")
    const [legs, setLegs] = useState("")
    const [pages, setPages] = useState({
        current: 1,
        total: ""
    })
    const [filterTheResults, setfilterTheResults] = useState(false)
    const [modal, setModal] = useState(false)
    const [buttons, setButtons] = useState(["Cancel", "Next", "Back", "Confirm", "Mint"])
    const [step, setStep] = useState(0)
    const [title, setTitle] = useState("")


    const [check, setCheck] = useState(false)

    const [mintStart, setMintStart] = useState(false)

    const handleClick = async () => {
        setMintingStatusMessage([...mintingStatusMessage, "Minting started 🙌"])
        setMintStart(true)
    }

    useEffect(() => {
        step === 0 ? setTitle("Personal Information") : step == 1 ? setTitle("Confirm your details") : setTitle("Your tickets")
    }, [step])

    useEffect(() => {
      if(router.isReady){
        setTitleOfPage(`${router.query.from} - ${router.query.to} Tickets`)
      }
    }, [router.isReady])
    

    return (
        <>
            <Head>
                <title>{titleOfPage}</title>
            </Head>
            <div className='bg-blue w-full md:h-full h-full px-20 py-20 relative'>

                <Modals mintNfts={handleClick} details={details} check={check} modal={modal} setModal={setModal} title={title} buttons={buttons} setStep={setStep} step={step}>
                    {
                        step == 0 ?
                            <PersonalInformation details={details} setDetails={setDetails} />
                            :
                            step == 1 ?
                                <ConfirmYourDetails check={check} setCheck={setCheck} tripDetails={tripDetails} />
                                :
                                <ViewTickets mintStart={mintStart} setMintStart={setMintStart} tripDetails={tripDetails} details={details} />
                    }
                </Modals>


                <div onClick={() => { recover() }} className='flex my-10 justify-between max-w-[1400px]'>
                    <div className='flex gap-2 cursor-pointer'>
                        <Icons.Filter />
                        <p className='text-whiteTwo'>Filter</p>
                        <Icons.DownChevron filterOpen={filterOpen} onClick={() => { setFilterOpen(!filterOpen) }} />
                        <div className='flex gap-2 items-center justify-start'>

                        </div>
                    </div>

                    <div className='flex gap-6'>
                        <Icons.LeftChevron extreme={true} onClick={() => { setPages({ ...pages, current: 0 }) }} />
                        <Icons.LeftChevron onClick={() => { pages.current !== 0 && setPages(prevPage => ({ ...prevPage, current: prevPage.current - 1 })) }} />
                        <p className='text-whiteTwo'>{pages.current + 1} / {pages.total}</p>
                        <Icons.RightChevron onClick={() => { pages.current !== pages.total && setPages(prevPage => ({ ...prevPage, current: prevPage.current + 1 })) }} />
                        <Icons.RightChevron extreme={true} onClick={() => { setPages({ ...pages, current: pages.total - 1 }) }} />
                    </div>
                </div>
                {
                    filterOpen &&
                    <div className='bg-whiteTwo rounded-xl w-fit p-5 flex flex-col gap-4 items-start my-10'>
                        <div className='w-full justify-between flex gap-4 items-center '>
                            <p>Duration:</p>
                            <p> &#60; {filter.duration.value ? filter.duration.value : filter.duration.min} Hours</p>
                            <Slider styles={sliderSlides} onChange={({ x }) => setFilter({ ...filter, duration: { ...filter.duration, value: x } })} x={filter.duration.value} xmin={filter.duration.min} xmax={filter.duration.max} />
                        </div>
                        <div className='w-full justify-between flex gap-4 items-center '>
                            <p>Price:</p>
                            <p> &#60; ${filter.price.value ? filter.price.value : filter.price.min}</p>
                            <Slider styles={sliderSlides} onChange={({ x }) => setFilter({ ...filter, price: { ...filter.price, value: x } })} x={filter.price.value} xmin={maxPrice.min} xmax={maxPrice.max} />
                        </div>
                        <div className='w-full justify-between flex gap-4 items-center '>
                            <p>Stops:</p>
                            <p> &#60; {filter.stops.value ? filter.stops.value : 0}</p>
                            <Slider styles={sliderSlides} onChange={({ x }) => setFilter({ ...filter, stops: { ...filter.stops, value: x } })} x={filter.stops.value ? filter.stops.value : 0} xmin={0} xstep={1} xmax={filter.stops.max} />
                        </div>
                        <div className='bg-yellow flex rounded-lg px-4 py-2 cursor-pointer' onClick={() => setfilterTheResults(true)}>
                            <p>Search</p>
                        </div>
                    </div>
                }
                <SearchResults setModal={setModal} setTripDetails={setTripDetails} tripDetails={tripDetails} setMaxPrice={setMaxPrice} filterTheResults={filterTheResults} setfilterTheResults={setfilterTheResults} pages={pages} setPages={setPages} setLegs={setLegs} filter={filter} setFilter={setFilter} />
            </div>
        </>
    )
}

export default Search