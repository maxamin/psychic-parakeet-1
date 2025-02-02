import Joi from 'joi'

// by default convert string to number like '18' => 18 if it has Joi.number()
// by default can't be empty
// by default any attribute that is not written in the schema will throw ['"..." is not allowed']

export const campaignCreationSchema = Joi.object({
  campaignId: Joi.number().integer().min(0).required(),
  desc: Joi.string().required(),
  category: Joi.string().required(),
  message: Joi.string(),
  featured: Joi.boolean()
})

export const campaignQuerySchema = Joi.object({
  q: Joi.string().empty('').default(' ')
})

export const campaignUpdateSchema = Joi.object({
  desc: Joi.string(),
  message: Joi.string(),
  category: Joi.string(),
  featured: Joi.boolean()
})

export const campaignIdSchema = Joi.object({
  campaignId: Joi.number().integer().min(0).required()
})
