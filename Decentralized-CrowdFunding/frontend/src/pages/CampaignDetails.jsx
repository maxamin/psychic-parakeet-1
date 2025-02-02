import React, { useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { ethereum, loader } from '../assets'
import { useStateContext } from '../context'
import {
  CountBox,
  Loader,
  Modal,
  MetMaskButton,
  UserRewards
} from '../components'
import { useFetch } from '../hooks'
import { JoiValidate, calculatePercentage, formatError } from '../utils'
import { toast } from 'react-toastify'
import { parseEther } from 'ethers/lib/utils'

import { closeSvg, saveSvg, withdrawSvg, editSvg, refundSvg } from '../assets'
import {
  campaignIdSchema,
  campaignUpdateSchema,
  donationAmountSchema
} from '../validators/campaigns'

const CampaignDetails = () => {
  const { id } = useParams()
  const { campaignContract, signer, address } = useStateContext()

  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({
    desc: '',
    message: '',
    category: ''
  })
  const [modalContent, setModalContent] = useState({
    isOpen: false,
    message: '',
    warningMessage: false,
    onConfirm: null
  })
  const { data: campaign, reFetch } = useFetch(
    `http://localhost:8000/api/v1/campaigns/${id}`
  )
  // console.log(campaign)
  const userDonation = useFetch(
    `http://localhost:8000/api/v1/campaigns/donations/${id}/${address}`,
    null,
    [address]
  )

  const unWithdrawnAmount =
    campaign?.amountCollected - campaign?.withdrawnAmount
  const barPercentage = calculatePercentage(
    campaign?.target,
    campaign?.amountCollected
  )

  const softcapPercentage = calculatePercentage(
    campaign?.target,
    campaign?.softcap
  )

  function activateEditMode() {
    if (campaign?.owner !== address) return
    setEditMode(!editMode)
    setEditForm({
      desc: campaign?.description,
      message: campaign?.message,
      category: campaign?.category
    })
  }

  const handleEdit = async () => {
    if (campaign?.owner !== address) return
    try {
      const { campaignId } = JoiValidate(campaignIdSchema, {
        campaignId: campaign?.pId
      })
      const validatedEditForm = JoiValidate(campaignUpdateSchema, editForm)
      await axios.patch(
        `http://localhost:8000/api/v1/campaigns/${campaignId}`,
        validatedEditForm
      )
      toast.success('Campaign edited successfuly!')
      setEditMode(!editMode)
      await reFetch()
    } catch (error) {
      toast.error(formatError(error))
    }
  }

  const handleDonate = async () => {
    if (campaign?.owner === address) return
    setIsLoading(true)
    try {
      const { campaignId } = JoiValidate(campaignIdSchema, {
        campaignId: campaign?.pId
      })

      const { donationAmount } = JoiValidate(donationAmountSchema, {
        donationAmount: amount
      })
      await campaignContract.connect(signer).fundInEth(campaignId, {
        value: parseEther(donationAmount?.toString())
      })
      toast.success('Funded!')
      await reFetch()
    } catch (error) {
      toast.error(formatError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (campaign?.owner !== address) return
    setIsLoading(true)
    try {
      const { campaignId } = JoiValidate(campaignIdSchema, {
        campaignId: campaign?.pId
      })
      await campaignContract.connect(signer).withdrawFunds(campaignId)
      toast.success('Funds withdrawn successfully!')
      await reFetch()
    } catch (error) {
      toast.error(formatError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = async () => {
    if (campaign?.owner !== address) return
    setIsLoading(true)
    try {
      const { campaignId } = JoiValidate(campaignIdSchema, {
        campaignId: campaign?.pId
      })
      await campaignContract.connect(signer).closeCampaign(campaignId)
      toast.success('Campaign closed!')
      await reFetch()
    } catch (error) {
      toast.error(formatError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefund = async () => {
    if (campaign?.owner === address) return
    setIsLoading(true)
    try {
      const { campaignId } = JoiValidate(campaignIdSchema, {
        campaignId: campaign?.pId
      })
      await campaignContract.connect(signer).refund(campaignId)
      toast.success('Refunded!')
      await userDonation.reFetch()
    } catch (error) {
      toast.error(formatError(error))
    } finally {
      setIsLoading(false)
    }
  }

  // {isModalOpen && (

  return (
    <div>
      {isLoading && <Loader />}
      <Modal modalContent={modalContent} setModalContent={setModalContent} />
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-col flex-1">
          {campaign ? (
            <img
              src={campaign?.image}
              alt="campaign"
              className="w-full h-[410px] object-cover rounded-xl"
            />
          ) : (
            <img
              src={loader}
              alt="loader"
              className="w-[100px] h-[100px] object-contain mx-auto"
            />
          )}
          <div className="relative w-full mt-2 mb-3 bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className={`${
                campaign?.status === 'Open' ? 'bg-[#23be73]' : 'bg-[#c70039]'
              } text-xl font-medium text-white text-center p-0.5 leading-none rounded-full`}
              style={{ width: barPercentage <= 100 && barPercentage + '%' }}
            >
              {barPercentage}%
            </div>
            <div
              className="absolute top-0 w-1 h-full bg-dark dark:bg-gray-300"
              style={{ left: softcapPercentage + '%' }}
            ></div>
            <p
              className="absolute text-xs top-6 dark:text-light"
              style={{ left: 'calc(' + softcapPercentage + '% - 25px)' }}
            >
              Softcap ({softcapPercentage}%)
            </p>
          </div>
        </div>
        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[15px]">
          <CountBox
            title="Status"
            value={campaign?.status}
            styles={{
              text: campaign?.status === 'Open' ? 'primary' : '[#c70039]'
            }}
          />
          <CountBox
            title={`Raised of ${campaign?.target}`}
            value={campaign?.amountCollected.toString()}
          />
          <CountBox
            title="Total Funds"
            value={campaign?.donations?.length.toString()}
          />
        </div>
      </div>
      <div className="flex gap-2 mt-6 flex-wrap">
        {campaign?.owner !== address ? (
          <button
            // onClick={handleRefund}
            onClick={() =>
              setModalContent({
                isOpen: true,
                message: `are you sure you want to refund ${userDonation?.data}$ from your campaign donation? (irreversible action!!)`,
                onConfirm: handleRefund
              })
            }
            className={`flex items-center justify-center gap-1 px-2 py-1 text-sm font-bold text-green-700 transition duration-200 ease-in-out bg-green-100 border border-green-600 rounded cursor-pointer hover:scale-105 focus:outline-none hover:bg-green-700 hover:text-green-100
          ${
            !(
              userDonation?.data > 0 &&
              campaign?.softcap > campaign?.amountCollected
            ) && 'grayscale pointer-events-none opacity-50'
          }`}
          >
            <div className="flex leading-5">{refundSvg()}</div>
            Refund ({userDonation.data}$)
          </button>
        ) : (
          <>
            <button
              // onClick={handleWithdraw}
              onClick={() =>
                setModalContent({
                  isOpen: true,
                  message: `are you sure you want to withdraw ${unWithdrawnAmount}$ from your campaign funds? (irreversible action!!)`,
                  onConfirm: handleWithdraw
                })
              }
              className={`flex items-center justify-center gap-1 px-2 py-1 text-sm font-bold text-green-700 transition duration-200 ease-in-out bg-green-100 border border-green-600 rounded cursor-pointer hover:scale-105 focus:outline-none hover:bg-green-700 hover:text-green-100
              ${
                !(
                  unWithdrawnAmount > 0 &&
                  campaign?.amountCollected > campaign?.softcap
                ) && 'grayscale pointer-events-none opacity-50'
              }`}
            >
              <div className="flex mt-1 leading-5">{withdrawSvg()}</div>
              Withdraw ({unWithdrawnAmount}
              $)
            </button>
            {campaign?.status == 'Open' && (
              <>
                <button
                  // onClick={handleEdit}
                  onClick={() =>
                    setModalContent({
                      isOpen: true,
                      message: 'Are you sure you want to edit this campaign?',
                      onConfirm: handleEdit
                    })
                  }
                  className={`${
                    !editMode && 'hidden'
                  } flex justify-center px-4 py-2 text-base font-bold text-green-700 transition duration-200 ease-in-out bg-green-100 border border-green-600 rounded cursor-pointer hover:scale-105 focus:outline-none hover:bg-green-700 hover:text-green-100 `}
                >
                  <div className="flex leading-5">
                    {saveSvg()}
                    Save
                  </div>
                </button>
                <button
                  onClick={activateEditMode}
                  className={`${
                    editMode && 'hidden'
                  } flex justify-center px-4 py-2 text-base font-bold text-green-700 transition duration-200 ease-in-out bg-green-100 border border-green-600 rounded cursor-pointer hover:scale-105 focus:outline-none hover:bg-green-700 hover:text-green-100 `}
                >
                  <div className="flex leading-5">
                    {editSvg()}
                    Edit
                  </div>
                </button>
                <button
                  // onClick={handleClose}
                  onClick={() =>
                    setModalContent({
                      isOpen: true,
                      message:
                        'Are you sure you want to close this campaign? (irreversible action!!)',
                      warningMessage: true,
                      onConfirm: handleClose
                    })
                  }
                  className="flex items-center justify-center gap-1 px-4 py-2 text-sm font-bold text-red-700 transition duration-200 ease-in-out bg-red-100 border border-red-600 rounded cursor-pointer hover:scale-105 focus:outline-none hover:bg-red-700 hover:text-red-100"
                >
                  <div className="flex leading-5">{closeSvg()}</div>
                  Close
                </button>
              </>
            )}
          </>
        )}
      </div>

      <div className="mt-[23px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] dark:text-white uppercase mb-3">
              Creator
            </h4>
            <div className="flex gap-2">
              <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-light dark:bg-[#2c2f32]">
                <img
                  src={ethereum}
                  alt="user"
                  className="w-[70%] h-[70%] object-contain"
                />
              </div>
              <div className="flex flex-row items-center truncate">
                <h4 className="font-epilogue font-bold text-[15px] dark:text-white">
                  {campaign?.owner}
                </h4>
                <UserRewards address={campaign?.owner} />
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] dark:text-white uppercase">
              Story
            </h4>
            <div className="mt-[20px]">
              {editMode ? (
                <textarea
                  defaultValue={campaign?.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, desc: e.target.value })
                  }
                  rows={10}
                  placeholder="Enter your story here..."
                  className="w-full sm:min-w-[300px] py-[15px] px-[15px] sm:px-[25px] outline-none border-[1px] border-[#a5a5a6] dark:border-[#3a3a43] bg-transparent font-epilogue dark:text-white text-[16px] placeholder:text-[#4b5264] rounded-[10px]"
                />
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify break-all">
                  {campaign?.description}
                </p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] dark:text-white uppercase">
              Funds
            </h4>
            <div className="mt-[10px] flex flex-col gap-4">
              {campaign?.donations && campaign?.donations?.length > 0 ? (
                campaign?.donations?.map((item, index) => (
                  <div
                    key={`${item.funder}-${index}`}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex flex-wrap items-center justify-between">
                      <p className="font-epilogue font-bold text-[15px] dark:text-white leading-[26px] break-all">
                        {item.funder}
                      </p>
                      <UserRewards address={item.funder} />
                    </div>
                    <p className="font-epilogue text-[16px] font-bold dark:text-white leading-[26px]">
                      {item.fundedAmount}$
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  No donators yet. Be the first!
                </p>
              )}
            </div>
          </div>
        </div>
        {campaign?.status == 'Open' && (
          <div className="flex-1">
            <h4 className="font-epilogue font-semibold text-[18px] dark:text-white uppercase">
              Fund
            </h4>

            <div className="mt-[20px] flex flex-col p-6 bg-light dark:bg-[#1c1c24] rounded-[10px]">
              <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center dark:text-[#808191]">
                Fund this campaign
              </p>
              <div className="mt-[30px]">
                <input
                  type="number"
                  pattern="[0-9]+"
                  placeholder="ETH 0.1"
                  step="0.01"
                  className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue dark:text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <div className="my-[10px] p-4 bg-gray-300 dark:bg-[#13131a] rounded-[10px]">
                  <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] dark:text-white">
                    Thanks Notation:
                  </h4>
                  {editMode ? (
                    <input
                      defaultValue={campaign?.message}
                      onChange={(e) =>
                        setEditForm({ ...editForm, message: e.target.value })
                      }
                      type="text"
                      placeholder="please..."
                      className="w-full sm:min-w-[250px] py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#a5a5a6] dark:border-[#3a3a43] bg-transparent font-epilogue dark:text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px]"
                    />
                  ) : (
                    <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                      {campaign?.message}
                    </p>
                  )}
                </div>

                {address ? (
                  <button
                    type="button"
                    onClick={handleDonate}
                    className={`w-full hover:scale-105 text-gray-900 bg-gray-100 dark:bg-gray-800 dark:text-white focus:ring-4 focus:outline-none focus:ring-gray-100 font-bold rounded-lg text-md px-5 py-2.5 text-center justify-center inline-flex items-center dark:focus:ring-gray-500
                    ${
                      campaign?.owner == address &&
                      'pointer-events-none opacity-50'
                    }`}
                  >
                    <svg
                      className="w-8 h-8 mr-2 ml-1 text-[#626890] dark:text-white"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="ethereum"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path
                        fill="currentColor"
                        d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"
                      ></path>
                    </svg>
                    Fund in Ethereum
                  </button>
                ) : (
                  <MetMaskButton />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CampaignDetails
