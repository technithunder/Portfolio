import Joi from 'joi';

export const photoSchema = Joi.object({
    step: Joi.number().integer().required(),
    visaId: Joi.number().required(),
    parentUserId: Joi.number().required(),
    photo: Joi.any(),
    isNew: Joi.boolean(),
    id: Joi.number()
});

export const passportSchema = Joi.object({
    step: Joi.number().integer().required(),
    visaId: Joi.number().required(),
    parentUserId: Joi.number().required(),
    id: Joi.number().integer().required(),
    passportFront: Joi.string().required(),
    passportBack: Joi.string().allow('', null)
});

export const documentSchema = Joi.object({
    step: Joi.number().integer().required(),
    visaId: Joi.number().required(),
    parentUserId: Joi.number().required(),
    id: Joi.number().integer().required(),
    documentName: Joi.string().required(),
    document: Joi.string().required()
});

export const detailsSchema = Joi.object({
    step: Joi.number().integer().required(),
    visaId: Joi.number().required(),
    parentUserId: Joi.number().required(),
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
    maritalStatus: Joi.string(),
    fatherName: Joi.string(),
    motherName: Joi.string(),
    phoneNumber: Joi.string().required().messages({
        'any.required': 'Phone number is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    })
});
