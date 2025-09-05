import Joi from "joi";

const createScheduleCallAmountSchema = Joi.object({
    amount: Joi.number().required(),
    timeDuration: Joi.string().required(),
});

export { createScheduleCallAmountSchema };
