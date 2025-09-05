import Joi from 'joi';

export const photoSchema = Joi.object({
    step: Joi.number().integer().required(),
    visaId:Joi.number().required(),
    parentUserId:Joi.number().required(),
    childUserId:Joi.number().required(),
    photo: Joi.any(),
})

export const visaApplicationSchema = Joi.object({
    parentUserId: Joi.number().required(),
    visaId: Joi.number().required(),
    travelDate: Joi.string().required(),
    visaType: Joi.string().required(),
    visaCategory: Joi.string().required()
})
    
export const passportSchema = Joi.object({
    step: Joi.number().integer().required(),
    visaId:Joi.number().required(),
    parentUserId:Joi.number().required(),
    childUserId:Joi.number().required(),
    id: Joi.number().integer().required(),
    passport: Joi.any(),

})

export const detailsSchema = Joi.object({
    step: Joi.number().integer().required(),
    visaId:Joi.number().required(),
    parentUserId:Joi.number().required(),
    childUserId:Joi.number().required(),
    id: Joi.number().integer().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dob: Joi.string().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    placeOfBirth: Joi.string().required(),
    passportNumber: Joi.string().required(),
    passportFrom: Joi.string().required(),
    passportIssuedOn: Joi.string().required(),
    passportValidUntil: Joi.string().required(),
    maritalStatus:Joi.string(),
    fatherName:Joi.string(),
    motherName:Joi.string()
})

export const applyForVisaSchema = Joi.object({
    appId: Joi.number().required(),
    parentUserId: Joi.number().required(),
    visaId: Joi.number().required(),
    childUsers: Joi.array().items(Joi.number()).required()
})
