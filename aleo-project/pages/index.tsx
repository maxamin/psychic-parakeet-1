import type {NextPage} from 'next'
import Head from 'next/head'
import {useRouter} from "next/router";
import React, {useState} from "react";
import Header from "@/components/header";
import Content from "@/components/content";
import Layout from "@/components/layout";

const Home: NextPage = () => {
  const router = useRouter()

  const [isLoading, setLoading] = useState(false)

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    setLoading(true);
    event.preventDefault()
    const form = event.currentTarget
    const formElements = form.elements as typeof form.elements & {
      tokenId: HTMLInputElement
    }
    router.push(`/${formElements.tokenId.value}`)
  }

  return (
    <>
      <Head>
        <title>Lil Nouns Pics</title>
        <meta name="description" content="Select and download a Lil Nouns picture in various sizes and formats."/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <Layout>
        <div className="tw-relative tw-bg-gray-50 tw-overflow-hidden">
          <div className="tw-hidden sm:tw-block sm:tw-absolute sm:tw-inset-y-0 sm:tw-h-full sm:tw-w-full" aria-hidden="true">
            <div className="tw-relative tw-h-full tw-max-w-7xl tw-mx-auto">
              <svg
                className="tw-absolute tw-right-full tw-transform tw-translate-y-1/4 tw-translate-x-1/4 lg:tw-translate-x-1/2"
                width={404}
                height={784}
                fill="none"
                viewBox="0 0 404 784"
              >
                <defs>
                  <pattern
                    id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect x={0} y={0} width={4} height={4} className="tw-text-gray-200" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width={404} height={784} fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
              </svg>
              <svg
                className="tw-absolute tw-left-full tw-transform -tw-translate-y-3/4 -tw-translate-x-1/4 md:-tw-translate-y-1/2 lg:-tw-translate-x-1/2"
                width={404}
                height={784}
                fill="none"
                viewBox="0 0 404 784"
              >
                <defs>
                  <pattern
                    id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect x={0} y={0} width={4} height={4} className="tw-text-gray-200" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width={404} height={784} fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)" />
              </svg>
            </div>
          </div>

          <div className="tw-relative tw-pt-6">
            <Header />

            <Content>
              <section>
                <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-my-10">
                  <div className="tw-max-w-3xl tw-mx-auto tw-rounded-lg tw-bg-white tw-shadow tw-divide-y tw-divide-gray-200">

                    <h1 className="tw-px-10 tw-py-3">Lil Noun</h1>

                    {!isLoading && (
                      <div className="tw-px-4 tw-py-5 sm:tw-p-6">
                        <div className="tw-mt-2 tw-max-w-xl tw-text-sm tw-text-gray-500">
                          <p>Enter you Lil Noun token id to go forward.</p>
                        </div>
                        <form className="tw-mt-5 sm:tw-flex sm:tw-items-center" onSubmit={handleSubmit}>
                          <div className="tw-w-full sm:tw-max-w-xs">
                            <label htmlFor="email" className="tw-sr-only">
                              Nouns Id
                            </label>
                            <input
                              min={0}
                              maxLength={4}
                              type="number"
                              name="tokenId"
                              id="tokenId"
                              className="tw-shadow-sm focus:tw-ring-indigo-500 focus:tw-border-indigo-500 tw-block tw-w-full sm:tw-text-sm tw-border-gray-300 tw-rounded-md"
                              placeholder="3322"
                            />
                          </div>
                          <button
                            type="submit"
                            className="tw-mt-3 tw-w-full tw-inline-flex tw-items-center tw-justify-center tw-px-4 tw-py-2 tw-border tw-border-transparent tw-shadow-sm tw-font-medium tw-rounded-md tw-text-white tw-bg-indigo-600 hover:tw-bg-indigo-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-indigo-500 sm:tw-mt-0 sm:tw-ml-3 sm:tw-w-auto sm:tw-text-sm"
                          >
                            Go
                          </button>
                        </form>
                      </div>
                    )}

                    {isLoading && (
                      <div className="tw-px-4 tw-py-5 sm:tw-p-6">
                        <p>Loading...</p>
                      </div>
                    )}

                  </div>
                </div>
              </section>
            </Content>

            {/*<Footer />*/}
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Home
