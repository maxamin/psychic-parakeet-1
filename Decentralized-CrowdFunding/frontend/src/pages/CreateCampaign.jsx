import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { parseEther } from 'ethers/lib/utils'

import { useStateContext } from '../context'
import { CustomButton, FormField, Loader, MetMaskButton } from '../components'
import { JoiValidate, formatError } from './../utils'
import { campaignIdSchema, campaignCreateSchema } from '../validators/campaigns'
import { imagePlaceholder } from '../assets'

const CreateCampaign = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [chosenImage, setChosenImage] = useState(imagePlaceholder)

  const [form, setForm] = useState({
    title: '',
    category: '',
    desc: '',
    message: '',
    target: '',
    softcap: '',
    image: {}
  })

  const { campaignContract, signer, address } = useStateContext()

  const handleFormFieldChange = (fieldName, e) => {
    const { value, files } = e.target

    if (fieldName === 'image') {
      if (files && files[0]?.type.startsWith('image/')) {
        setForm({ ...form, image: files })
        setChosenImage(URL.createObjectURL(files[0]))
      } else {
        toast.error('Only images are allowed!')
      }
    } else {
      setForm({ ...form, [fieldName]: value })
    }
  }

  const uploadToIpfs = async (image) => {
    const formData = new FormData()
    formData.append('file', image[0])

    const imageUrl = await axios.post(
      'http://localhost:8000/api/v1/campaigns/uploadImage',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return imageUrl.data
  }

  const contractCreateCampaign = async (target, softcap, title, imageUrl) => {
    const tx = await campaignContract
      .connect(signer)
      .createCampaign(
        parseEther(target.toString()),
        parseEther(softcap.toString()),
        1,
        title,
        imageUrl
      )
    const receipt = await tx.wait()
    const startedEvent = receipt.events.find(
      (event) => event.event === 'Started'
    )
    const { campaignId } = JoiValidate(campaignIdSchema, {
      campaignId: parseInt(startedEvent.args.campaignId)
    })
    return campaignId
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const validatedForm = JoiValidate(campaignCreateSchema, form)
      const { target, softcap, title, desc, category, message, image } =
        validatedForm

      if (softcap > target) throw new Error('Softcap must be less than target!')

      const imageUrl = await uploadToIpfs(image)
      const campaignId = await contractCreateCampaign(
        target,
        softcap,
        title,
        imageUrl
      )

      await axios.post('http://localhost:8000/api/v1/campaigns/', {
        campaignId,
        desc,
        category,
        message
      })

      toast.success('Campaign created successfully!')
      navigate(`/campaign-details/${campaignId}/${encodeURIComponent(title)}`)
    } catch (error) {
      toast.error(formatError(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-light dark:bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#717171] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start a Campaign
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px] flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
          <FormField
            labelName="Campaign Category *"
            placeholder="Write one"
            inputType="text"
            value={form.category}
            handleChange={(e) => handleFormFieldChange('category', e)}
          />
        </div>
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Goal *"
            placeholder="100$"
            inputType="number"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField
            labelName="Softcap *"
            placeholder="Must be > 30% of goal!"
            inputType="number"
            value={form.softcap}
            handleChange={(e) => handleFormFieldChange('softcap', e)}
          />
        </div>
        <FormField
          labelName="Story *"
          placeholder="Write your story..."
          isTextArea
          inputType="text"
          value={form.desc}
          handleChange={(e) => handleFormFieldChange('desc', e)}
        />
        <FormField
          labelName="Short Message"
          placeholder="please..."
          isNotRequired
          inputType="text"
          value={form.message}
          handleChange={(e) => handleFormFieldChange('message', e)}
        />
        {/* <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
        </div> */}

        {/* <FormField
          labelName="Campaign image *"
          inputType="file"
          isImage
          handleChange={(e) => handleFormFieldChange('image', e)}
        /> */}
        <label className="flex flex-col flex-1 w-full">
          <span className="font-epilogue font-medium text-[14px] leading-[22px] dark:text-[#808191] mb-[10px]">
            Campaign image *
          </span>
          <div className="flex items-center space-x-6 cursor-pointer">
            <div className="shrink-0">
              <img
                className="object-cover w-20 h-20 rounded-full"
                src={chosenImage}
                alt="Chosen campaign image"
              />
            </div>
            <div className="block">
              <input
                required
                type="file"
                accept="image/*"
                onChange={(e) => handleFormFieldChange('image', e)}
                className="block w-full text-sm text-slate-700 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3d8663] file:text-white hover:file:bg-green-700"
              />
            </div>
          </div>
        </label>

        <div className="flex justify-center items-center mt-[10px] px-5">
          {address ? (
            <CustomButton
              btnType="submit"
              title="Submit new campaign"
              styles="bg-primary"
              handleClick={handleSubmit}
            />
          ) : (
            <MetMaskButton />
          )}
          {/* <button onClick={handleSubmit}></button> */}
        </div>
      </form>
    </div>
  )
}

export default CreateCampaign
