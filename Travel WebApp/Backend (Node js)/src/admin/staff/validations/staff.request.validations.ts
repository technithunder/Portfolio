import Joi from 'joi';

export const staffSchema = Joi.object({
    user_name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
});

    