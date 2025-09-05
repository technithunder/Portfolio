
import { sequelize } from '@/config/db.config';
import { HTTP_STATUS_CODES, sendResponse } from '@/constants/api-response';
import { strings } from '@/constants/string.constants';
import { getDBErrorMessage } from '@/utils/db.error';
import { Request, Response } from 'express';
import logger from '@/utils/logger';
import VisaDetailsData from '@/admin/country/models/VisaDetails';
import { additionalDetailsSchema, basicDetailsSchema, documentsSchema, visaDetailSchema } from '../validations/visa.request.validation';
import VisaDetails from '@/admin/country/models/VisaDetails';
import { uploadToS3Bucket } from '@/utils/aws';
import { Op } from 'sequelize';

export namespace VisaController {
    export const createVisaDetails = async (req: Request, res: Response) => {
        const { step } = req.body;

        try {
            const stepValidations = {
                1: basicDetailsSchema,
                2: visaDetailSchema,
                3: documentsSchema,
                4: additionalDetailsSchema
            };

            const { error } = stepValidations[step]?.validate(req.body);

            if (error) {
                return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            if (parseInt(step) === 1) {
                const { countryName, successRate, expectedTime, coverImage } = req.body;

                if (!Array.isArray(coverImage)) {
                    return sendResponse(res, false, null, null, strings.cover_images_length_error, HTTP_STATUS_CODES.BAD_REQUEST);
                }

                if (coverImage.length < 6) {
                    return sendResponse(res, false, null, null, strings.cover_images_length_less_6, HTTP_STATUS_CODES.BAD_REQUEST);
                }

                if (coverImage.length > 6) {
                    return sendResponse(res, false, null, null, strings.cover_images_length_more_6, HTTP_STATUS_CODES.BAD_REQUEST);
                }

                const uploadedImages = [];

                for (const image of coverImage) {
                    const response = await uploadToS3Bucket(image);
                    uploadedImages.push(response.s3FileUrl);
                }

                const basicDetails = { countryName, successRate, expectedTime, coverImage: uploadedImages };

                const visaDetailsData = await VisaDetails.create({ step, basicDetails });

                return sendResponse(res, true, visaDetailsData, strings.basic_details_updated, null, HTTP_STATUS_CODES.OK);
            }

            if (parseInt(step) === 2) {
                const { vizayardFee, visaFee, validityPeriod, visaEntry, visaType, lengthOfStay, id, visaGaurrentedOn, visaTime, visaProcessingDays, approveVisaSampleImage } = req.body;

                if (!id) {
                    return sendResponse(res, false, null, null, strings.missing_visa_id, HTTP_STATUS_CODES.BAD_REQUEST);
                }

                const existingVisaData = await VisaDetails.findOne({ where: { id } });

                if (!existingVisaData) {
                    return sendResponse(res, false, null, null, strings.visa_not_found, HTTP_STATUS_CODES.NOT_FOUND);
                }
                let approveVisaSampleUrl: string
                if (approveVisaSampleImage) {
                    const uploadRes = await uploadToS3Bucket(approveVisaSampleImage); // Assuming it's base64 or file buffer
                    approveVisaSampleUrl = uploadRes.s3FileUrl;
                }
                const visaDetails = { validityPeriod, visaEntry, visaType, lengthOfStay, vizayardFee, visaFee, visaGaurrentedOn, visaTime, visaProcessingDays, approveVisaSampleImage: approveVisaSampleUrl };
                await existingVisaData.update({ visaDetails });

                return sendResponse(res, true, existingVisaData, strings.visa_details_updated, null, HTTP_STATUS_CODES.OK);
            }

            if (parseInt(step) === 3) {
                const { id, step, ...docs } = req.body;
                const documentsRequire = { ...docs };
                const existingData: any = await VisaDetails.findOne({ where: { id } });

                if (existingData) {
                    await existingData.update({ existingData, documents: documentsRequire });

                    const updatedData = await VisaDetails.findOne({ where: { id } });

                    return sendResponse(res, true, updatedData, strings.documents_updated, null, HTTP_STATUS_CODES.OK);
                }
            }

            if (parseInt(step) === 4) {
                const { faqs, id } = req.body;
                const transaction = await sequelize.transaction();

                try {
                    const existingVisaDetails = await VisaDetails.findOne({ where: { id: id } });

                    if (existingVisaDetails) {
                        const additionalDetails = {
                            faqs: faqs
                        };

                        await existingVisaDetails.update({ additionalDetails }, { transaction });

                        await transaction.commit();

                        return sendResponse(res, true, existingVisaDetails, strings.addtional_details_updated, null, HTTP_STATUS_CODES.OK);
                    } else {
                        await transaction.rollback();
                        return sendResponse(res, false, null, null, strings.visa_not_found, HTTP_STATUS_CODES.NOT_FOUND);
                    }
                } catch (error) {
                    await transaction.rollback();
                    logger.error('Error in Step 5:', error);
                    return sendResponse(res, false, null, null, strings.err_internal_error_occurred, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
                }
            }
            return sendResponse(res, false, null, null, strings.invalid_step, HTTP_STATUS_CODES.BAD_REQUEST);
        } catch (error) {
            logger.error('Error storing stepwise data:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    /**
     * Get Visa Details by ID
     */
    export const getVisaDetails = async (req: Request, res: Response) => {
        try {
            const { visaId } = req.params;

            const visaDetails = await VisaDetailsData.findOne({
                where: { id: visaId }
            });

            if (!visaDetails) {
                return sendResponse(res, false, null, null, strings.visa_not_found, HTTP_STATUS_CODES.NOT_FOUND);
            }

            return sendResponse(res, true, visaDetails, strings.get_visa, null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            logger.error('Error in getVisaDetails:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const getAllVisa = async (req: Request, res: Response) => {
        try {
            let { page, limit, query } = req.query;

            const pageNumber = Number(page);
            const limitNumber = Number(limit);
            const isPagination = !isNaN(pageNumber) && !isNaN(limitNumber);

            let whereCondition = {};
            if (query) {
                whereCondition = {
                    basicDetails: {
                        countryName: { [Op.iLike]: `%${query}%` }
                    }
                };
            }

            const findOptions: any = {
                where: whereCondition,
                order: [['createdAt', 'DESC']]
            };

            if (isPagination) {
                findOptions.limit = limitNumber;
                findOptions.offset = (pageNumber - 1) * limitNumber;
            }

            const { rows: visas, count: totalVisas } = await VisaDetails.findAndCountAll(findOptions);

            if (visas.length === 0) {
                return sendResponse(res, false, [], null, strings.matched_visa_not_found, HTTP_STATUS_CODES.OK);
            }

            const totalPages = isPagination ? Math.ceil(totalVisas / limitNumber) : 1;

            return sendResponse(
                res,
                true,
                {
                    visas,
                    ...(isPagination && {
                        page: pageNumber,
                        totalPages,
                        totalVisas
                    })
                },
                strings.get_visa,
                null,
                HTTP_STATUS_CODES.OK
            );
        } catch (error) {
            logger.error('Error in getAllVisa:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };


    export const deleteVisa = async (req: Request, res: Response) => {
        try {
            const { visaId } = req.params;
            const visa = await VisaDetails.findOne({ where: { id: visaId } });
            if (!visa) {
                return sendResponse(res, false, null, null, strings.visa_not_found, HTTP_STATUS_CODES.NOT_FOUND);
            }
            await visa.destroy();
            return sendResponse(res, true, null, strings.visa_deleted, null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            logger.error('Error in deleteVisa:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const updateVisaDetails = async (req: Request, res: Response) => {
        const { step, id } = req.body;

        try {
            const stepNumber = parseInt(step);
            if (![1, 2, 3, 4].includes(stepNumber)) {
                return sendResponse(res, false, null, null, strings.invalid_step, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            if (!id) return sendResponse(res, false, null, null, strings.missing_visa_id, HTTP_STATUS_CODES.BAD_REQUEST);

            const existingVisaData = await VisaDetails.findOne({ where: { id } });
            if (!existingVisaData) return sendResponse(res, false, null, null, strings.visa_not_found, HTTP_STATUS_CODES.NOT_FOUND);

            let updatedVisaData;

            if (stepNumber === 1) {
                const { error } = basicDetailsSchema.validate(req.body);
                if (error) {
                    return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
                }

                const { countryName, successRate, expectedTime, coverImage } = req.body;

                if (!Array.isArray(coverImage)) {
                    return sendResponse(res, false, null, null, strings.cover_images_length_error, HTTP_STATUS_CODES.BAD_REQUEST);
                }

                if (coverImage.length < 6) {
                    return sendResponse(res, false, null, null, strings.cover_images_length_less_6, HTTP_STATUS_CODES.BAD_REQUEST);
                }

                if (coverImage.length > 6) {
                    return sendResponse(res, false, null, null, strings.cover_images_length_more_6, HTTP_STATUS_CODES.BAD_REQUEST);
                }

                const updatedCoverImages = [];

                for (const img of coverImage) {
                    const isUrl = /^https?:\/\//.test(img);

                    if (isUrl) {
                        updatedCoverImages.push(img);
                    } else {
                        const response = await uploadToS3Bucket(img);
                        updatedCoverImages.push(response.s3FileUrl);
                    }
                }

                const basicDetails = { countryName, successRate, expectedTime, coverImage: updatedCoverImages };

                updatedVisaData = await existingVisaData.update({ basicDetails });

                return sendResponse(res, true, updatedVisaData, strings.basic_details_updated, null, HTTP_STATUS_CODES.OK);
            }

            if (stepNumber === 2) {
                const { error } = visaDetailSchema.validate(req.body);
                if (error) return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);

                const { vizayardFee, visaFee, validityPeriod, visaType, visaEntry, lengthOfStay, visaGaurrentedOn, visaTime, visaProcessingDays, approveVisaSampleImage } = req.body;
                let approveVisaSampleUrl = (existingVisaData.visaDetails as { approveVisaSampleImage?: string })?.approveVisaSampleImage;

                if (approveVisaSampleImage && !/^https?:\/\//.test(approveVisaSampleImage)) {
                    // Upload only if it's not already a URL
                    const uploadResponse = await uploadToS3Bucket(approveVisaSampleImage);
                    approveVisaSampleUrl = uploadResponse.s3FileUrl;
                }
                const visaDetails = { validityPeriod, visaType, lengthOfStay, vizayardFee, visaFee, visaEntry, visaGaurrentedOn, visaTime, visaProcessingDays, approveVisaSampleImage: approveVisaSampleUrl };

                updatedVisaData = await existingVisaData.update({ visaDetails });
                return sendResponse(res, true, updatedVisaData, strings.visa_details_updated, null, HTTP_STATUS_CODES.OK);
            }

            if (stepNumber === 3) {
                const { error } = documentsSchema.validate(req.body);
                if (error) return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);

                const { passport, photo, bankStatement, incomeTaxReturn } = req.body;
                const documentsRequire = { passport, photo, bankStatement, incomeTaxReturn };

                updatedVisaData = await existingVisaData.update({ documents: documentsRequire });
                return sendResponse(res, true, updatedVisaData, strings.documents_updated, null, HTTP_STATUS_CODES.OK);
            }

            if (stepNumber === 4) {
                const { error } = additionalDetailsSchema.validate(req.body);
                if (error) return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);

                const transaction = await sequelize.transaction();
                try {
                    const { faqs } = req.body;
                    const additionalDetails = { faqs: faqs };
                    updatedVisaData = await existingVisaData.update({ additionalDetails }, { transaction });

                    await transaction.commit();
                    return sendResponse(res, true, updatedVisaData, strings.addtional_details_updated, null, HTTP_STATUS_CODES.OK);
                } catch (error) {
                    await transaction.rollback();
                    logger.error('Error in Step 4:', error);
                    return sendResponse(res, false, null, null, strings.err_internal_error_occurred, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
                }
            }
        } catch (error) {
            logger.error('Error updating visa details:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const getTrendingVisa = async (req: Request, res: Response) => {
        try {
            const trendingVisas = await VisaDetails.findAll({
                where: { trending: true },
                order: [['trendingOrder', 'ASC']],
            });

            if (trendingVisas.length === 0) {
                return sendResponse(res, false, null, null, strings.matched_visa_not_found, HTTP_STATUS_CODES.OK);
            }

            return sendResponse(res, true, trendingVisas, strings.get_visa, null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            logger.error('Error in getTrendingVisa:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const toggleTrendingStatus = async (req: Request, res: Response) => {
        try {
            const { visaIds, trending } = req.body;

            if (!Array.isArray(visaIds) || typeof trending !== 'boolean') {
                return sendResponse(res, false, null, null, 'Invalid input: visaIds must be an array and trending must be a boolean', HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const [updatedCount] = await VisaDetails.update({ trending }, { where: { id: visaIds } });

            return sendResponse(res, true, { updated: updatedCount, trending }, strings.visa_updated, null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            logger.error('Error in toggleTrendingStatus:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const updateTrendingOrder = async (req: Request, res: Response) => {
        try {
            const trendingList = req.body.trendingVisa;

            if (trendingList.length === 0) {
                return sendResponse(res, false, null, null, "Invalid trending data", HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const transaction = await sequelize.transaction();

            try {
                for (const item of trendingList) {
                    const { visaId, trending } = item;

                    if (typeof visaId !== 'number' || typeof trending !== 'number') continue;

                    await VisaDetails.update(
                        { trendingOrder: trending },
                        { where: { id: visaId }, transaction }
                    );
                }

                await transaction.commit();
                return sendResponse(res, true, null, "Trending order updated successfully", null, HTTP_STATUS_CODES.OK);

            } catch (error) {
                await transaction.rollback();
                throw error;
            }

        } catch (error) {
            logger.error('Error in updateTrendingOrder:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

}
