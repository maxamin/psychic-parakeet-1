import Joi from 'joi'

export const mongoIdSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'database ID')
    .required()
})

export const ethAdressSchema = Joi.object({
  address: Joi.string()
    .regex(/^(0x)?[0-9a-fA-F]{40}$/, 'Ethereum address')
    .required()
})

export const objectSchema = Joi.object({
  object: Joi.object().required()
}).messages({
  'any.required': 'invalid input'
})
