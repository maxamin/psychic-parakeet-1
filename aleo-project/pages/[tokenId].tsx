import React, {Fragment, useEffect, useState} from "react";
import {GetStaticPaths, GetStaticProps, GetStaticPropsContext} from "next";
import Image from "next/image";
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'
import {Listbox, Transition} from "@headlessui/react";
import Head from "next/head";
import {NextSeo} from "next-seo";
import Content from "@/components/content";
import Header from "@/components/header";
import clsx from "clsx";
import Layout from "@/components/layout";

const mimeOptions = [
  {name: 'SVG', value: 'svg'},
  {name: 'PNG', value: 'png'},
  {name: 'JPG', value: 'jpeg'},
  {name: 'WebP', value: 'webp'},
]

const sizeOptions = [
  {name: '256', value: 256},
  {name: '512', value: 512},
  {name: '1024', value: 1024},
  {name: '2048', value: 2048},
]

const moodOptions = [
  {name: 'Natural', value: ''},
  // {name: 'Aggravated', value: 'aggravated'},
  {name: 'Angry', value: 'angry'},
  {name: 'Asleep', value: 'asleep'},
  // {name: 'Crying', value: 'crying'},
  {name: 'Glad', value: 'glad'},
  // {name: 'Glance Down', value: 'glance-down'},
  {name: 'Glance Up', value: 'glance-up'},
  {name: 'Happy', value: 'happy'},
  // {name: 'Sad', value: 'sad'},
  {name: 'Sleepy', value: 'sleepy'},
  // {name: 'Sus', value: 'sus'},
  {name: 'Wink', value: 'wink'},
]

const backOptions = [
  {name: 'Default', value: ''},
  {name: 'Transparent', value: 'transparent'},
]

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`${process.env.MAIN_PRIVATE_API_URL}/nouns`);

  const range = response.headers.get('content-range')
  const count = range?.split('/')[1] as unknown as number;

  const paths = Array.from({length: count}, (_, k) => k)
    .filter(tokenId => tokenId !== 404 && tokenId !== 500)
    .map((tokenId) => ({params: {tokenId: `${tokenId}`},}));

  return ({
    paths,
    fallback: false, // can also be true or 'blocking'
  });
};

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const tokenId = context.params!.tokenId;

  if (!tokenId) return {notFound: true};

  return ({
    props: {tokenId},
  });
};

const Noun = ({tokenId}: { tokenId: string }) => {
  const [image, setImage] = useState<any>({})
  const [isLoading, setLoading] = useState(false)

  const [mime, setMime] = useState(mimeOptions[0])
  const [size, setSize] = useState(sizeOptions[0])
  const [back, setBack] = useState(backOptions[0])
  const [mood, setMood] = useState(moodOptions[0])

  useEffect(() => {
    fetchImage(tokenId)
  }, [tokenId])

  const fetchImage = (tokenId: string, size?: number, mime?: string, back?: string, mood: string = '') => {
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/nouns/${tokenId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({size, mime, back, mood})
    })
      .then((res) => res.json())
      .then((data) => {
        const {data: {image}} = data;
        setImage(image)
        setLoading(false)
      })
  }

  return (
    <>
      <NextSeo
        title={`Lil Nouns Pics - Lil Noun #${tokenId}`}
        description={`Download a Lil Noun #${tokenId} picture in various sizes and formats.`}
      />

      <Head>
        <title>{`Lil Nouns Pics - Lil Noun #${tokenId}`}</title>
        <meta
          name="description"
          content={`Download a Lil Noun #${tokenId} picture in various sizes and formats.`}
        />
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
              <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-my-10">
                <div className="tw-max-w-3xl tw-mx-auto tw-rounded-lg tw-bg-white tw-shadow tw-divide-y tw-divide-gray-200">

                  <h1 className="tw-px-10 tw-py-3">{mime.name} - {size.name} - {back ? 'Normal' : 'Transparent'} - {mood.name}</h1>

                  <div className="tw-grid tw-grid-cols-10">
                    <div className="tw-col-span-10 sm:tw-col-span-5">
                      <div className="tw-px-10 tw-py-10">
                        <a
                          href={image.body}
                          download={`noun-${tokenId}@${image.size}`}
                        >
                          <Image
                            alt={""}
                            src={!isLoading ? image.body : "/assets/images/lil-loading-skull.gif"}
                            width={256}
                            height={256}
                            className="tw-border tw-border-neutral-300 tw-rounded-md"
                          />
                        </a>
                      </div>
                    </div>

                    <div className="tw-col-span-10 sm:tw-col-span-5">
                      <div className="tw-py-10 tw-px-10">
                        <Listbox value={mime} onChange={setMime}>
                          {({open}) => (
                            <>
                              <Listbox.Label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Type</Listbox.Label>
                              <div className="tw-mt-1 tw-relative">
                                <Listbox.Button
                                  className="tw-bg-white tw-relative tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-pl-3 tw-pr-10 tw-py-2 tw-text-left tw-cursor-default focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-indigo-500 focus:tw-border-indigo-500 sm:tw-text-sm">
                                  <span className="tw-block tw-truncate">{mime.name}</span>
                                  <span className="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2 tw-pointer-events-none">
                              <ChevronUpDownIcon className="tw-h-5 tw-w-5 tw-text-gray-400" aria-hidden="true"/>
                            </span>
                                </Listbox.Button>

                                <Transition
                                  show={open}
                                  as={Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options
                                    className="tw-absolute tw-z-10 tw-mt-1 tw-w-full tw-bg-white tw-shadow-lg tw-max-h-60 tw-rounded-md tw-py-1 tw-text-base tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-overflow-auto focus:tw-outline-none sm:tw-text-sm">
                                    {mimeOptions.map((option) => (
                                      <Listbox.Option
                                        key={option.name}
                                        className={({active}) =>
                                          clsx(
                                            active ? 'tw-text-white tw-bg-indigo-600' : 'tw-text-gray-900',
                                            'tw-cursor-default stw-elect-none tw-relative tw-py-2 tw-pl-3 tw-pr-9'
                                          )
                                        }
                                        value={option}
                                      >
                                        {({selected, active}) => (
                                          <>
                                          <span
                                            className={clsx(selected ? 'tw-font-semibold' : 'tw-font-normal', 'tw-block tw-truncate')}>
                                            {option.name}
                                          </span>

                                            {selected ? (
                                              <span
                                                className={clsx(
                                                  active ? 'tw-text-white' : 'tw-text-indigo-600',
                                                  'tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-4'
                                                )}
                                              >
                                              <CheckIcon className="tw-h-5 tw-w-5" aria-hidden="true"/>
                                            </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </>
                          )}
                        </Listbox>

                        <Listbox value={size} onChange={setSize}>
                          {({open}) => (
                            <>
                              <Listbox.Label className="tw-mt-3 tw-block tw-text-sm tw-font-medium tw-text-gray-700">Size</Listbox.Label>
                              <div className="tw-mt-1 tw-relative">
                                <Listbox.Button
                                  className="tw-bg-white tw-relative tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-pl-3 tw-pr-10 tw-py-2 tw-text-left tw-cursor-default focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-indigo-500 focus:tw-border-indigo-500 sm:tw-text-sm">
                                  <span className="tw-block tw-truncate">{size.name}</span>
                                  <span className="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2 tw-pointer-events-none">
                              <ChevronUpDownIcon className="tw-h-5 tw-w-5 tw-text-gray-400" aria-hidden="true"/>
                            </span>
                                </Listbox.Button>

                                <Transition
                                  show={open}
                                  as={Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options
                                    className="tw-absolute tw-z-10 tw-mt-1 tw-w-full tw-bg-white tw-shadow-lg tw-max-h-60 tw-rounded-md tw-py-1 tw-text-base tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-overflow-auto focus:tw-outline-none sm:tw-text-sm">
                                    {sizeOptions.map((option) => (
                                      <Listbox.Option
                                        key={option.name}
                                        className={({active}) =>
                                          clsx(
                                            active ? 'tw-text-white tw-bg-indigo-600' : 'tw-text-gray-900',
                                            'tw-cursor-default tw-select-none tw-relative tw-py-2 tw-pl-3 tw-pr-9'
                                          )
                                        }
                                        value={option}
                                      >
                                        {({selected, active}) => (
                                          <>
                                          <span
                                            className={clsx(selected ? 'tw-font-semibold' : 'tw-font-normal', 'tw-block tw-truncate')}>
                                            {option.name}
                                          </span>

                                            {selected ? (
                                              <span
                                                className={clsx(
                                                  active ? 'tw-text-white' : 'tw-text-indigo-600',
                                                  'tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-4'
                                                )}
                                              >
                                              <CheckIcon className="tw-h-5 tw-w-5" aria-hidden="true"/>
                                            </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </>
                          )}
                        </Listbox>

                        <Listbox value={mood} onChange={setMood}>
                          {({open}) => (
                            <>
                              <Listbox.Label className="tw-mt-3 tw-block tw-text-sm tw-font-medium tw-text-gray-700">Mood</Listbox.Label>
                              <div className="tw-mt-1 tw-relative">
                                <Listbox.Button
                                  className="tw-bg-white tw-relative tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-pl-3 tw-pr-10 tw-py-2 tw-text-left tw-cursor-default focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-indigo-500 focus:tw-border-indigo-500 sm:tw-text-sm">
                                  <span className="tw-block tw-truncate">{mood.name}</span>
                                  <span className="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2 tw-pointer-events-none">
                              <ChevronUpDownIcon className="tw-h-5 tw-w-5 tw-text-gray-400" aria-hidden="true"/>
                            </span>
                                </Listbox.Button>

                                <Transition
                                  show={open}
                                  as={Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options
                                    className="tw-absolute tw-z-10 tw-mt-1 tw-w-full tw-bg-white tw-shadow-lg tw-max-h-60 tw-rounded-md tw-py-1 tw-text-base tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-overflow-auto focus:tw-outline-none sm:tw-text-sm">
                                    {moodOptions.map((option) => (
                                      <Listbox.Option
                                        key={option.name}
                                        className={({active}) =>
                                          clsx(
                                            active ? 'tw-text-white tw-bg-indigo-600' : 'tw-text-gray-900',
                                            'tw-cursor-default tw-select-none tw-relative tw-py-2 tw-pl-3 tw-pr-9'
                                          )
                                        }
                                        value={option}
                                      >
                                        {({selected, active}) => (
                                          <>
                                          <span
                                            className={clsx(selected ? 'tw-font-semibold' : 'tw-font-normal', 'tw-block tw-truncate')}>
                                            {option.name}
                                          </span>

                                            {selected ? (
                                              <span
                                                className={clsx(
                                                  active ? 'tw-text-white' : 'tw-text-indigo-600',
                                                  'tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-4'
                                                )}
                                              >
                                              <CheckIcon className="tw-h-5 tw-w-5" aria-hidden="true"/>
                                            </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </>
                          )}
                        </Listbox>

                        <Listbox value={back} onChange={setBack}>
                          {({open}) => (
                            <>
                              <Listbox.Label className="tw-mt-3 tw-block tw-text-sm tw-font-medium tw-text-gray-700">Back</Listbox.Label>
                              <div className="tw-mt-1 tw-relative">
                                <Listbox.Button
                                  className="tw-bg-white tw-relative tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-pl-3 tw-pr-10 tw-py-2 tw-text-left tw-cursor-default focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-indigo-500 focus:tw-border-indigo-500 sm:tw-text-sm">
                                  <span className="tw-block tw-truncate">{back.name}</span>
                                  <span className="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2 tw-pointer-events-none">
                              <ChevronUpDownIcon className="tw-h-5 tw-w-5 tw-text-gray-400" aria-hidden="true"/>
                            </span>
                                </Listbox.Button>

                                <Transition
                                  show={open}
                                  as={Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options
                                    className="tw-absolute tw-z-10 tw-mt-1 tw-w-full tw-bg-white tw-shadow-lg tw-max-h-60 tw-rounded-md tw-py-1 tw-text-base tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-overflow-auto focus:tw-outline-none sm:tw-text-sm">
                                    {backOptions.map((option) => (
                                      <Listbox.Option
                                        key={option.name}
                                        className={({active}) =>
                                          clsx(
                                            active ? 'tw-text-white tw-bg-indigo-600' : 'tw-text-gray-900',
                                            'tw-cursor-default tw-select-none tw-relative tw-py-2 tw-pl-3 tw-pr-9'
                                          )
                                        }
                                        value={option}
                                      >
                                        {({selected, active}) => (
                                          <>
                                          <span
                                            className={clsx(selected ? 'tw-font-semibold' : 'tw-font-normal', 'tw-block tw-truncate')}>
                                            {option.name}
                                          </span>

                                            {selected ? (
                                              <span
                                                className={clsx(
                                                  active ? 'tw-text-white' : 'tw-text-indigo-600',
                                                  'tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-4'
                                                )}
                                              >
                                              <CheckIcon className="tw-h-5 tw-w-5" aria-hidden="true"/>
                                            </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </>
                          )}
                        </Listbox>
                      </div>
                    </div>

                  </div>
                  <div className="tw-p-3 tw-w-full">
                    <button
                      disabled={isLoading}
                      onClick={() => fetchImage(tokenId, size.value, mime.value, back.value, mood.value)}
                      type="submit"
                      className="tw-mt-2 tw-w-full tw-bg-zinc-200 tw-border tw-border-neutral-300 tw-rounded-md tw-py-3 tw-px-8 tw-flex tw-items-center tw-justify-center tw-text-base tw-font-medium tw-text-neutral-800 tw-opacity-50 hover:tw-bg-zinc-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-offset-gray-50 focus:tw-ring-zinc-500"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            </Content>

            {/*<Footer />*/}
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Noun
