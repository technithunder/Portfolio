import Joi from 'joi';

export const scheduleCallSchema = Joi.object({
    date: Joi.date().greater('now').required().messages({
        'date.greater': 'Date must be in the future',
        'any.required': 'Date is required'
    }),
    timeSlot: Joi.string().required().messages({
        'any.required': 'Time slot is required'
    }),
    userName: Joi.string().required().messages({
        'any.required': 'User name is required'
    }),
    userPhone: Joi.string().required().messages({
        'any.required': 'Phone number is required'
    }),
    userEmail: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    description: Joi.string().optional()
});

export const updateScheduleCallSchema = Joi.object({
    date: Joi.date().greater('now').optional().messages({
        'date.greater': 'Date must be in the future'
    }),
    timeSlot: Joi.string().optional(),
    userName: Joi.string().optional(),
    userPhone: Joi.string().optional(),
    userEmail: Joi.string().email().optional().messages({
        'string.email': 'Invalid email format'
    }),
    description: Joi.string().optional()
});
