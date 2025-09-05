import Joi from 'joi'

export const VisaCategorySchema = Joi.object({
  label: Joi.string().min(2).max(50).required(),
  id:Joi.number()
});
