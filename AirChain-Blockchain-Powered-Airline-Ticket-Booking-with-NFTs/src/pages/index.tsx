import Head from "next/head";
import Spline from "@splinetool/react-spline";
import SearchFlights from "../components/form/SearchFlights";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>AirChain</title>
        <meta name="description" content="Web3 Application to mint NFT tickets!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="wrapper absolute w-screen h-screen z-0 top-0 right-0">
        <div className="flex absolute w-full bg-transparent text-center justify-start items-center p-8">
          <p onClick={ () => { router.push('/my-tickets')}} className="font-semibold text-xl cursor-pointer">View my tickets</p>
        </div>
        <Spline scene="https://prod.spline.design/5JrIbCwstQlsFj0K/scene.splinecode" />
      </div>
      <SearchFlights />
    </>
  );
}
