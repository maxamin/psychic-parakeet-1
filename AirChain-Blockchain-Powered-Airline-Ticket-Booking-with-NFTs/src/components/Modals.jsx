import React, { useContext } from 'react'
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { AirlineContext } from '../../constants/AirlineContext';
import Loader from './Loader';

function Modals({ mintNfts, modal, setModal, check, buttons, title, setHeader, children, setStep, step }) {

    const { mintingStatusMessage, setMintingStatusMessage } = useContext(AirlineContext)

    return (
        <Modal
            blur
            closeButton
            aria-labelledby="modal-title"
            open={modal}
            onClose={() => { setModal(false); setStep(0) }}
            css={{ paddingTop: "0" }}
        >
            {
                mintingStatusMessage.length > 0 &&
                <div className='bg-white w-[350px] h-full shadow-xl flex flex-col items-center left-6 rounded-2xl py-10 px-5 absolute z-10  '>
                    <p className='text-lg font-semibold'>Minting your NFT(s)</p>
                    <Loader minting={true} />
                    <div className='flex items-center flex-col justify-center w-full'>
                        {
                            mintingStatusMessage.slice(-3).map((message, index) => {
                                return (
                                    <div className='flex flex-col items-center gap-2 duration-300 transition-all ease-in-out justify-center'>
                                        <p className='text-blue font-semibold'>{message}</p>
                                        {
                                            mintingStatusMessage.length - 1 != index &&
                                        <div className='w-[3px] h-[40px] bg-blue'></div>
                                        }
                                    </div>

                                )
                            })
                        }

                    </div>
                </div>
            }
            <Modal.Header css={{ backgroundColor: "#E0D817", paddingTop: "16px" }}>
                <p className='text-xl font-semibold'>{title}</p>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer justify='center'>
                <div className='flex gap-4'>
                    {
                        step == 0 &&
                        <div onClick={() => { setStep((prev) => prev + 1) }} className='bg-blue px-4 py-2 rounded-xl cursor-pointer'>
                            <p className='text-whiteTwo'>{buttons[1]}</p>
                        </div>
                    }
                    {
                        step == 1 &&
                        <>
                            <div onClick={() => { setStep((prev) => prev - 1) }} className='bg-whiteTwo px-4 py-2 rounded-xl cursor-pointer'>
                                <p className='text-blue'>{step == 0 ? buttons[0] : buttons[2]}</p>
                            </div>
                            {
                                check ?
                                    <div onClick={() => { step == 2 ? setModal(false) : setStep((prev) => prev + 1) }} className='bg-blue px-4 py-2 rounded-xl cursor-pointer'>
                                        <p className='text-whiteTwo'>{buttons[3]}</p>
                                    </div>
                                    :
                                    <div className='bg-gray-300 px-4 py-2 rounded-xl  cursor-not-allowed'>
                                        <p className='text-whiteTwo'>{buttons[3]}</p>
                                    </div>
                            }
                        </>
                    }
                    {
                        step == 2 &&
                        <>
                            <div onClick={() => { mintNfts() }} className='bg-blue px-4 py-2 rounded-xl cursor-pointer'>
                                <p className='text-whiteTwo'>{buttons[4]}</p>
                            </div>
                        </>
                    }
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default Modals