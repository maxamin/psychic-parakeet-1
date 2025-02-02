import Joi from 'joi'

export default function JoiValidate(schema, body) {
  const { error, value } = schema.validate(body, { abortEarly: false })

  if (error) throw new Joi.ValidationError(error.message, error.details, error)

  return value
}
