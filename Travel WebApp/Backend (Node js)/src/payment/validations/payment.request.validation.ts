import Joi from 'joi';

export const createOrderSchema = Joi.object({
    visaId: Joi.number().required().messages({
        'any.required': 'Visa ID is required'
    }),
    childUsers: Joi.array().items(Joi.number()).min(1).required().messages({
        'any.required': 'Child users are required',
        'array.min': 'At least one child user is required'
    }),
    applicationId: Joi.number().required().messages({
        'any.required': 'Application ID is required'
    }),

});

export const updatePaymentSchema = Joi.object({
    orderId: Joi.string().required().messages({
        'any.required': 'Order ID is required'
    }),
    paymentId: Joi.string().required().messages({
        'any.required': 'Payment ID is required'
    }),
    signatureId: Joi.string().required().messages({
        'any.required': 'Signature ID is required'
    }),
    description: Joi.string().allow(null, '').optional()
});
