import React, { useContext, useEffect, useState } from "react";
import { AirlineContext } from "../../constants/AirlineContext";
import Loader from "../components/Loader";
import Ticket from "../components/Ticket";
import Head from "next/head";
function MyTickets() {
  const [loading, setLoading] = useState(true);
  const { fetchNFTs } = useContext(AirlineContext);
  const [ticketData, setTicketData] = useState("");

  useEffect(() => {
    fetchNFTs(setLoading).then((res) => {
      setTicketData(res);
    });
  }, []);

  return (
    <div className="bg-blue w-full md:h-full min-h-screen px-20 py-20 flex flex-col ">
      <p className="text-white text-3xl text-center mb-20">My Tickets</p>
      {loading ? (
        <Loader />
      ) : (
        ticketData.map((ticket, index) => {
          return <Ticket key={index} data={ticket} />;
        })
      )}
    </div>
  );
}

export default MyTickets;
