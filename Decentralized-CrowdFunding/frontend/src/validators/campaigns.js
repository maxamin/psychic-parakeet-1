import Joi from 'joi'
import { FileListValidation } from './index'

/*
  by default convert string to number like '18' => 18 if it has Joi.number()
  by default can't be empty
  by default any attribute X that is not written in the schema will throw ['X is not allowed'] 
*/

export const campaignCreateSchema = Joi.object({
  title: Joi.string().required(),
  desc: Joi.string().required(),
  category: Joi.string().required(),
  message: Joi.string(),
  target: Joi.number().integer().min(1).required(),
  softcap: Joi.number().integer().min(1).required(),
  image: FileListValidation.fileList().required()
})

export const campaignUpdateSchema = Joi.object({
  desc: Joi.string().required(),
  category: Joi.string().required(),
  message: Joi.string()
})

export const campaignIdSchema = Joi.object({
  campaignId: Joi.number().integer().min(0).required()
})

export const donationAmountSchema = Joi.object({
  donationAmount: Joi.number()
    .min(1 / 1e18)
    .required()
})
