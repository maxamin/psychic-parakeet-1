import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {DefaultSeo} from "next-seo";
import SEO from '@/next-seo.config';
import {londrinaSolid, ptRootUI} from "@/styles/fonts";

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-pt-root-ui: ${ptRootUI.style.fontFamily};
          --font-londrina-solid: ${londrinaSolid.style.fontFamily};
        }
      `}</style>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
