import Joi from "joi";

export const VisaTypeSchema = Joi.object({
    id:Joi.number(),
    value:Joi.string(),
    label:Joi.string().required().messages({
        'string.empty':'Visa type is required'
    })
}) 