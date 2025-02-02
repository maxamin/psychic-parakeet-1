import React, { useEffect, useState } from 'react'
import Trip from './Trip'
import { useRouter } from "next/router";
import { searchForFlight, filterAndSend } from "../../services/searchService"
import Loader from './Loader';

function SearchResults({ setModal, tripDetails, setTripDetails, setMaxPrice, filter, setFilter, setLegs, setPages, pages, setfilterTheResults, filterTheResults }) {
    const router = useRouter();

    const [trips, setTrips] = useState([])

    const filterAndSetTrips = async (filter) => {
        await filterAndSend(filter)
            .then((res) => {
                setPages(res.pages)
                setLegs(res.legsCount)
                setFilter(res.filter)
                setTrips(res.totalTrips)
            })
            .catch((err) => {
                console.log("Error!", err);
            });
    }

    const searchFlights = async () => {
        await searchForFlight({
            // from: data.from,
            // to: data.to,
            // date: data.departure,
            // adults: data.adults,
            // children: data.children,
            // infants: data.infants
        })
            .then((res) => {
                setMaxPrice(res.filter.price)
                setPages(res.pages)
                setLegs(res.legsCount)
                setFilter(res.filter)
                setTrips(res.totalTrips)
            })
            .catch((err) => {
                console.log("Error!", err);
            });

    }

    useEffect(() => {
        // if (!router.isReady) return;
        // const data = router.query
        searchFlights();
    }, [])

    useEffect(() => {
        if (filterTheResults && filter) {
            filterAndSetTrips(filter);
            setfilterTheResults(false)
        }
    }, [filterTheResults])



    return (
        <div className='bg-whiteTwo rounded-xl w-full p-10 max-w-[1400px] '>
            <div className='flex flex-col gap-6'>
                {
                    trips.length > 0 ? trips.slice(pages.current * 10, (pages.current + 1) * 10).map((trip, index) => {
                        return (
                            <Trip setModal={setModal} setTripDetails={setTripDetails} trip={trip} index={index} />
                        )
                    })
                        :
                        <Loader />
                }
            </div>
        </div>
    )
}

export default SearchResults