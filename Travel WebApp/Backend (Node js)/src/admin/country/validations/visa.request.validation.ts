import Joi from 'joi';

// Basic Details Schema
export const basicDetailsSchema = Joi.object({
    id: Joi.number().messages({
        'number.base': 'Id must be a number.'
    }),
    step: Joi.number().required().messages({
        'any.required': 'Step is required.',
        'number.base': 'Step must be a number.'
    }),
    countryName: Joi.string().required().messages({
        'any.required': 'Country Name is required.',
        'string.base': 'Country Name must be a string.'
    }),
    expectedTime: Joi.string().required().messages({
        'any.required': 'Expected Time is required.',
        'string.base': 'Expected Time must be a string.'
    }),
    successRate: Joi.number().required().messages({
        'any.required': 'Total Visa Completed is required.',
        'number.base': 'Total Visa Completed must be a number.'
    }),
    coverImage: Joi.any()
});

// Visa Details Schema
export const visaDetailSchema = Joi.object({
    step: Joi.number().required().messages({
        'any.required': 'Step is required.',
        'number.base': 'Step must be a number.'
    }),
    id: Joi.number().required().messages({
        'any.required': 'Id is required.',
        'number.base': 'Id must be a number.'
    }),
    visaType: Joi.string().required().messages({
        'any.required': 'Visa Type is required.',
        'string.base': 'Visa Type must be a string.'
    }),
    visaEntry: Joi.string().required().messages({
        'any.required': 'Visa Entry is required.',
        'string.base': 'Visa Entry must be a string.'
    }),
    validityPeriod: Joi.string().required().messages({
        'any.required': 'Validity Period is required.',
        'string.base': 'Validity Period must be a string.'
    }),
    lengthOfStay: Joi.string().required().messages({
        'any.required': 'Length of Stay is required.',
        'string.base': 'Length of Stay must be a string.'
    }),
    visaFee: Joi.number().required().messages({
        'any.required': 'Visa Fees are required.',
        'number.base': 'Visa Fees must be a number.'
    }),
    vizayardFee: Joi.number().required().messages({
        'any.required': 'Visayard Fees are required.',
        'number.base': 'Visayard Fees must be a number.'
    }),
    visaGaurrentedOn: Joi.string().required().messages({
        'any.required': 'Visa Gaurrented On is required.',
        'string.base': 'Visa Gaurrented On must be a string.'
    }),
    visaTime: Joi.string().required().messages({
        'any.required': 'Visa Time is required.',
        'string.base': 'Visa Time must be a string.'
    }),
    visaProcessingDays: Joi.number().required().messages({
        'any.required': 'Visa Processing Days are required.',
        'number.base': 'Visa Processing Days must be a number.'
    }),
    approveVisaSampleImage:Joi.any()
});

// Documents Schema
export const documentsSchema = Joi.object({
    step: Joi.number().required().messages({
        'any.required': 'Step is required.',
        'number.base': 'Step must be a number.'
    }),
    id: Joi.number().required().messages({
        'any.required': 'Id is required.',
        'number.base': 'Id must be a number.'
    })
})
    .pattern(Joi.string(), Joi.boolean().optional())
    .messages({
        'boolean.base': 'Document fields must be boolean values.'
    });

// export const pricingSchema = Joi.object({
//   id: Joi.number().required().messages({
//     'any.required': 'ID is required.',
//   }),
//   step: Joi.number().integer().min(1).required().messages({
//     'number.required': 'Step is required.',
//   }),
//   visaFee: Joi.number().required().messages({
//     'number.required': 'Visa Fee" is required.',
//   }),
//   visayardFee: Joi.number().required().messages({
//     'number.required': '"Visayard Fee is required.',
//   }),
//   govtVisaFee: Joi.number().required().messages({
//     'number.required': 'Government Visa Fee is required.',
//   }),
// });

// export const visaProgressStatusSchema = Joi.object({
//   id: Joi.number().required().messages({
//     'any.required': 'ID is required.',
//   }),
//   step: Joi.any().required().messages({
//     'any.required':'Step is required.',
//   }),
//   startDate: Joi.string().required().messages({
//     'any.required': 'Start Date is required.',
//   }),
//   endDate: Joi.string().required().messages({
//     'any.required': 'End Date is required.',
//   }),
//   steps: Joi.any().required().messages({
//     'any.required': 'Steps are required.',
//   }),
// });

//additional Details schema
export const additionalDetailsSchema = Joi.object({
    id: Joi.number().required().messages({
        'any.required': 'ID is required.',
        'number.base': 'ID must be a number.'
    }),
    step: Joi.number().required().messages({
        'number.base': 'Step must be a number.'
    }),
    partnersWeWorkWith: Joi.array().items(Joi.string()).optional(),
    faqs: Joi.any().required().messages({
        'any.required': 'FAQs is required.'
    })
});
