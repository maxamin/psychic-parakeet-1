import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AirlineProvider } from "../../constants/AirlineContext";

const Airlines = ({ Component, pageProps }: AppProps) => {
  return (
    <AirlineProvider>
      <Component {...pageProps} />
    </AirlineProvider>
  );
};

export default Airlines;
