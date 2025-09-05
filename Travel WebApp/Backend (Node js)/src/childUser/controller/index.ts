import { Request, Response } from 'express';
import ChildUser from '../models/ChildUser';
import { HTTP_STATUS_CODES, sendResponse } from '@/constants/api-response';
import { strings } from '@/constants/string.constants';
import { VisaApplication } from '@/visaApplication/model';
import logger from '@/utils/logger';
import { uploadToS3Bucket } from '@/utils/aws';
import { TextractService } from '@/utils/textract';
import { detailsSchema, documentSchema, passportSchema, photoSchema } from '../validations/childUser.request.validation';

export namespace ChildUserController {
    function isLessThanSixMonths(expDate) {
        const today = new Date();
        const sixMonthsLater = new Date();
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

        const expiryDate = new Date(expDate);

        return expiryDate < sixMonthsLater;
    }
    // export const addChildUser = async (req: Request, res: Response) => {
    //   try {
    //     const { parentUserId, visaType, expectedVisaDate, childUsers, visaCategory } = req.body;
    //     if (!parentUserId || !visaType) {
    //       return sendResponse(res, false, null, null, strings.missing_required_fields, HTTP_STATUS_CODES.BAD_REQUEST);
    //     }

    //     const childCount = Number(childUsers);
    //     if (isNaN(childCount) || childCount < 1 || childCount > 9) {
    //       return sendResponse(res, false, null, null, strings.max_child_users, HTTP_STATUS_CODES.BAD_REQUEST);
    //     }

    //     const existingChildren = await ChildUser.findAll({ where: { parentUserId } });
    //     const existingCount = existingChildren.length;

    //     if (childCount > existingCount) {
    //       const newChildren = [];
    //       for (let i = existingCount; i < childCount; i++) {
    //         const child = await ChildUser.create({
    //           parentUserId,
    //           name: `Child ${i + 1}`,
    //           visaType,
    //           visaCategory,
    //           expectedVisaDate
    //         });
    //         newChildren.push(child);
    //       }
    //       existingChildren.push(...newChildren);
    //     } else if (childCount < existingCount) {
    //       const toRemove = existingChildren.slice(childCount);
    //       const toRemoveIds = toRemove.map((child) => child.id);

    //       await ChildUser.destroy({
    //         where: { id: toRemoveIds },
    //       });

    //       existingChildren.length = childCount;
    //     }

    //     const response = {
    //       parentUserId,
    //       expectedVisaDate,
    //       visaType,
    //       childUsers: childCount,
    //       visaCategory,
    //       createdChildUsers: existingChildren,
    //     };

    //     return sendResponse(res, true, response, strings.childuser_create, null, HTTP_STATUS_CODES.OK);
    //   } catch (err) {
    //     return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    //   }
    // };

    export const addChildUser = async (req: Request, res: Response) => {
        try {
            const { step, parentUserId, id, isNew, visaId } = req.body;
            let extractedData: any = {};
            let extractedFrontData: any = {};
            let extractedBackData: any = {};

            if (!parentUserId) {
                return sendResponse(res, false, null, null, strings.missing_required_fields, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const stepNumber = parseInt(step);
            if (![1, 2, 3, 4].includes(stepNumber)) {
                return sendResponse(res, false, null, null, strings.invalid_step, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            let existingChild = null;
            if (!isNew && id) {
                existingChild = await ChildUser.findOne({ where: { id } });
                if (!existingChild) {
                    return sendResponse(res, false, null, null, strings.child_user_not_found, HTTP_STATUS_CODES.NOT_FOUND);
                }
            }

            if (stepNumber === 1) {
                const { error } = photoSchema.validate(req.body);
                if (error) return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);

                const { photo } = req.body;
                let photoImageUrl = /^https?:\/\//.test(photo) ? photo : (await uploadToS3Bucket(photo)).s3FileUrl; // Process documents

                if (isNew) {
                    existingChild = await ChildUser.create({
                        parentUserId,
                        photo: photoImageUrl,
                        step: stepNumber,
                        visaId,
                        status: 'pending'
                    });
                } else {
                    await existingChild.update({
                        photo: photoImageUrl,
                        step: stepNumber
                    });
                }

                return sendResponse(res, true, existingChild, strings.photo_uploaded, null, HTTP_STATUS_CODES.OK);
            }

            if (stepNumber === 2) {
                const { error } = passportSchema.validate(req.body);
                if (error) {
                    return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
                }

                const { passportFront, passportBack } = req.body;
                let passportFrontUrl = existingChild.passport?.front || '';
                let passportBackUrl = existingChild.passport?.back || '';
                let extractedFrontData: any = {};
                let extractedBackData: any = {};
                // Handle passportFront
                if (passportFront && !/^https?:\/\//.test(passportFront)) {
                    const frontResponse = await uploadToS3Bucket(passportFront);
                    passportFrontUrl = frontResponse.s3FileUrl;

                    const frontAnalyzedData = await TextractService.analyzeIdDocument(process.env.AWS_BUCKET_NAME!, frontResponse.fileKey);
                    extractedFrontData = TextractService.extractDataFromAnalyzeId(frontAnalyzedData);
                    console.log(extractedFrontData, 'extractedFrontData');
                    if (extractedFrontData.ID_TYPE !== 'PASSPORT') {
                        return sendResponse(res, false, null, null, strings.valid_passport_required, HTTP_STATUS_CODES.BAD_REQUEST);
                    }

                    if (isLessThanSixMonths(extractedFrontData.EXPIRATION_DATE)) {
                        return sendResponse(res, false, null, null, strings.passport_valid, HTTP_STATUS_CODES.BAD_REQUEST);
                    }
                } else if (/^https?:\/\//.test(passportFront)) {
                    passportFrontUrl = passportFront;
                }
                console.log(extractedFrontData, 'extractedFrontData');

                // Handle passportBack
                if (passportBack && !/^https?:\/\//.test(passportBack)) {
                    const backResponse = await uploadToS3Bucket(passportBack);
                    passportBackUrl = backResponse.s3FileUrl;
                    const backAnalyzedData = await TextractService.analyzeIdDocument(process.env.AWS_BUCKET_NAME!, backResponse.fileKey);
                    extractedBackData = TextractService.extractDataFromAnalyzeId(backAnalyzedData);
                    console.log(extractedBackData, 'lkl');
                } else if (/^https?:\/\//.test(passportBack)) {
                    passportBackUrl = passportBack;
                }
                // if (
                //     Object.keys(extractedFrontData).length &&
                //     Object.keys(extractedBackData).length
                // ) {
                // const mismatchFields = [];
                // function checkMismatch(field: string, label: string) {
                //     const frontVal = extractedFrontData?.[field]?.trim?.();
                //     const backVal = extractedBackData?.[field]?.trim?.();

                //     if (frontVal && backVal && frontVal !== backVal) {
                //       mismatchFields.push(label);
                //     }
                //   }
                //   checkMismatch("DOCUMENT_NUMBER", "document number");
                // if (extractedFrontData.PASSPORT_NUMBER !== extractedBackData.PASSPORT_NUMBER) {
                //     mismatchFields.push('passport number');
                // }

                // if (mismatchFields.length > 0) {
                //     return sendResponse(
                //         res,
                //         false,
                //         null,
                //         null,
                //         `Mismatch detected in ${mismatchFields.join(', ')} between front and back of passport.`,
                //         HTTP_STATUS_CODES.BAD_REQUEST
                //     );
                // }}
                await existingChild.update({
                    passport: {
                        front: passportFrontUrl,
                        back: passportBackUrl
                    },
                    extractedVisaDetails: {
                        ...extractedFrontData,
                        ...extractedBackData
                    },
                    step: stepNumber
                });

                return sendResponse(res, true, existingChild, strings.passport_uploaded, null, HTTP_STATUS_CODES.OK);
            }

            if (stepNumber === 3) {
                const { error } = detailsSchema.validate(req.body);
                if (error) {
                    return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
                }

                extractedData = existingChild.extractedVisaDetails || {};

                const visaDetails = {
                    firstName: req.body.firstName || extractedFrontData.FIRST_NAME || '',
                    lastName: req.body.lastName || extractedFrontData.LAST_NAME || '',
                    dob: req.body.dob || extractedFrontData.DATE_OF_BIRTH || '',
                    gender: req.body.gender || extractedBackData.GENDER || '',
                    placeOfBirth: req.body.placeOfBirth || extractedFrontData.PLACE_OF_BIRTH || '',
                    passportNumber: req.body.passportNumber || extractedFrontData.DOCUMENT_NUMBER || '',
                    passportFrom: req.body.passportFrom || extractedBackData.COUNTRY || '',
                    passportIssuedOn: req.body.passportIssuedOn || extractedFrontData.DATE_OF_ISSUE || extractedBackData.DATE_OF_ISSUE || '',
                    passportValidUntil: req.body.passportValidUntil || extractedFrontData.EXPIRATION_DATE || extractedBackData.EXPIRATION_DATE || '',
                    fatherName: req.body.fatherName || extractedBackData.FATHER_NAME || '',
                    motherName: req.body.motherName || extractedBackData.MOTHER_NAME || '',
                    phoneNumber: req.body.phoneNumber || extractedBackData.PHONE_NUMBER || '',
                    email: req.body.email || extractedBackData.EMAIL || '',
                    maritalStatus: req.body.maritalStatus || ''
                };

                await existingChild.update({
                    extractedVisaDetails: extractedData,
                    details: visaDetails,
                    step: stepNumber
                });

                return sendResponse(res, true, existingChild, strings.additional_details_updated, null, HTTP_STATUS_CODES.OK);
            }

            if (stepNumber === 4) {
                const { error } = documentSchema.validate(req.body);
                if (error) {
                    return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
                }

                const { documentName, document } = req.body;

                // Upload the new document
                const documentUrl = /^https?:\/\//.test(document) ? document : (await uploadToS3Bucket(document)).s3FileUrl;

                // Get existing documents and append the new one
                const existingDocuments = existingChild.documents || [];
                const updatedDocuments = [
                    ...existingDocuments,
                    {
                        documentName,
                        documentUrl
                    }
                ];

                await existingChild.update({
                    documents: updatedDocuments,
                    step: stepNumber
                });

                return sendResponse(res, true, existingChild, strings.documents_updated, null, HTTP_STATUS_CODES.OK);
            }
        } catch (error) {
            logger.error('Error processing child user application:', error);
            return sendResponse(res, false, null, null, strings.internal_server_error, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const getChildUsers = async (req: Request, res: Response) => {
        try {
            const { parentUserId } = req.query;
            const childUsers = await ChildUser.findAll({ where: { parentUserId }, order: [['id', 'DESC']] });
            return sendResponse(res, true, childUsers, strings.child_users_fetched, null, HTTP_STATUS_CODES.OK);
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const getAllChildUsers = async (req: Request, res: Response) => {
        try {
            const childUsers = await ChildUser.findAll({ order: [['id', 'DESC']] });
            return sendResponse(res, true, childUsers, strings.child_users_fetched, null, HTTP_STATUS_CODES.OK);
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };
    export const deleteChildUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.query;
            const childUser = await ChildUser.findByPk(Number(id));
            if (!childUser) {
                return sendResponse(res, false, null, null, strings.child_user_not_found, HTTP_STATUS_CODES.NOT_FOUND);
            }
            await childUser.destroy();
            return sendResponse(res, true, null, strings.child_user_deleted, null, HTTP_STATUS_CODES.OK);
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const getSingleChildUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.query;
            console.log(id);
            if (!id) {
                return sendResponse(res, false, null, null, strings.missing_id, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const childUser = await ChildUser.findOne({
                where: { id: Number(id) }
            });

            if (!childUser) {
                return sendResponse(res, false, null, null, strings.child_user_not_found, HTTP_STATUS_CODES.NOT_FOUND);
            }

            // const visaApplication = await VisaApplication.findOne({
            //   where: { childUserId: Number(id) },
            //   attributes: ["id"],
            // });

            return sendResponse(
                res,
                true,
                {
                    childUser
                    // visaApplicationId: visaApplication ? visaApplication.id : null,
                },
                strings.child_user_fetched,
                null,
                HTTP_STATUS_CODES.OK
            );
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };
}
