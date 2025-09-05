import Joi from 'joi';

export const createScheduleCallPaymentSchema = Joi.object({
    scheduleCallId: Joi.number().required().messages({
        'any.required': 'Schedule call ID is required'
    }),
    amount: Joi.number().required().positive().messages({
        'any.required': 'Amount is required',
        'number.positive': 'Amount must be a positive number'
    })
});

export const updateScheduleCallPaymentSchema = Joi.object({
    orderId: Joi.string().required().messages({
        'any.required': 'Order ID is required'
    }),
    paymentId: Joi.string().required().messages({
        'any.required': 'Payment ID is required'
    }),
    signatureId: Joi.string().required().messages({
        'any.required': 'Signature ID is required'
    })
});
