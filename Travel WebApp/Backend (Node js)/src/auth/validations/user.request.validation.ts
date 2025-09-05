import Joi from 'joi';

const emailSchema = Joi.string().email().messages({
  'string.email': 'Invalid email format',
  'string.empty': 'Email is required',
});

export const userSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Invalid email format',
  }),
  phoneNumber: Joi.string().required().messages({
    'string.empty': "Phone number is required"
  }),
  countryCode: Joi.string().required().messages({
    'string.empty': "Country code is required"
  }),
});

export const verifyOtpSchema = Joi.object({
  phoneNumber: Joi.string().required().messages({
    'string.empty': "Phone number is required"
  }),
  countryCode: Joi.string().required().messages({
    'string.empty': "Country code is required"
  }),
  code: Joi.string().required().messages({
    'string.empty': "Code is required"
  }),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Invalid email format',
  }),
  phoneNumber: Joi.string().optional(),
  city: Joi.string().optional(),
  alternateNo: Joi.string().optional(),
  userPhoto: Joi.string().optional(),
  passportFront: Joi.string().optional(),
  passportBack: Joi.string().optional(),
  incomeTaxReturn: Joi.string().optional(),
  adharCard: Joi.string().optional(),
  panCard: Joi.string().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
})
