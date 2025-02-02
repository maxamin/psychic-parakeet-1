import Joi from 'joi'

export const FileListValidation = Joi.extend((joi) => ({
  type: 'fileList',
  base: joi.object(),
  coerce: (value, helpers) => {
    if (value instanceof FileList) {
      return { value }
    }
    return { errors: helpers.error('fileList.base') }
  },
  messages: {
    'fileList.base': 'must be a FileList object'
  }
}))

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
