import { HTTP_STATUS_CODES, sendResponse } from '@/constants/api-response';
import { strings } from '@/constants/string.constants';
import { Request, Response } from 'express';
import logger from '@/utils/logger';
import { ChildUser, VisaApplication, VisaApplicant, VisaApplicationStatus, User, VisaDetails } from '@/visaApplication/model';
import { getDBErrorMessage } from '@/utils/db.error';
import { Op, Sequelize } from 'sequelize';
import VisaDetailsData from '@/admin/country/models/VisaDetails';
import { applyForVisaSchema, visaApplicationSchema } from '../validation/visaApp.request.validation';
import Order from '@/payment/models/Order';
import AdminUser from '@/admin/login/model/AdminUser';
import { CustomRequest } from '@/middleware/authenticatUser';
import { uploadToS3Bucket } from '@/utils/aws';

export namespace VisaApplicationController {
    /**
     * Create Visa Details
     */
    const norm = (s?: string) => (typeof s === 'string' ? s.trim().toLowerCase() : '');

    export const createVisaApplication = async (req: Request, res: Response) => {
        try {
            const { error, value } = visaApplicationSchema.validate(req.body);
            if (error) {
                return sendResponse(res, false, null, error.details[0].message, null, HTTP_STATUS_CODES.BAD_REQUEST);
            }
            const { parentUserId, visaType, visaCategory, travelDate, visaId } = value;

            const visaApplication = await VisaApplication.create({
                parentUserId,
                visaType,
                visaCategory,
                travelDate,
                visaId
            });

            return sendResponse(res, true, visaApplication, strings.visa_application_created, null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            console.log('Error in createVisaApplication:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const getAllVisaApplication = async (req: Request, res: Response) => {
        try {
            const { page, limit, query, status, parentUserId } = req.query;

            const pageNumber = Math.max(1, Number(page) || 1);
            const limitNumber = Math.max(1, Number(limit) || 10);
            const offset = (pageNumber - 1) * limitNumber;

            let whereCondition: any = {
                deletedAt: null
            };

            // Text search
            if (query) {
                whereCondition = {
                    ...whereCondition,
                    [Op.or]: [
                        Sequelize.literal(`details->>'firstName' ILIKE '%${query}%'`),
                        Sequelize.literal(`details->>'lastName' ILIKE '%${query}%'`)
                    ]
                };
            }

            if (status && status !== 'all') {
                whereCondition.status = status;
            }

            if (parentUserId) {
                whereCondition.parentUserId = parentUserId;
            }

            const totalVisaApplication = await VisaApplication.count({
                where: whereCondition
            });

            const visaApplications = await VisaApplication.findAll({
                where: whereCondition,
                limit: limitNumber,
                offset,
                order: [['createdAt', 'DESC'], ['id', 'DESC']],
                include: [
                    {
                        model: VisaDetailsData,
                        as: 'visaDetail',
                        required: false
                    },
                    {
                        model: VisaApplicant,
                        as: 'applicants',
                        include: [
                            {
                                model: ChildUser,
                                as: 'childUser',
                                attributes: ['id', 'details', 'photo', 'passport', 'extractedVisaDetails']
                            }
                        ]
                    },
                    {
                        model: AdminUser,
                        as: 'assignedUser',
                        attributes: ['id', 'user_name']
                    },
                    {
                        model: User,
                        as: 'parentUser',
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            });

            const totalPages = Math.ceil(totalVisaApplication / limitNumber);

            if (visaApplications.length === 0) {
                return sendResponse(
                    res,
                    false,
                    null,
                    null,
                    strings.matched_visa_application_not_found,
                    HTTP_STATUS_CODES.OK
                );
            }

            const formattedApplications = visaApplications.map(app => {
                const json = app.toJSON();
                return {
                    ...json,
                    assignTo: json.assignedUser || null,
                };
            });

            return sendResponse(
                res,
                true,
                {
                    visaApplications: formattedApplications,
                    page: pageNumber,
                    totalPages,
                    totalVisaApplication
                },
                strings.get_visa,
                null,
                HTTP_STATUS_CODES.OK
            );
        } catch (error) {
            console.log('Error in getAllVisaApplication:', error);
            return sendResponse(
                res,
                false,
                null,
                null,
                strings.internal_server_error || 'Something went wrong',
                HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
            );
        }
    };


    export const getVisaApplication = async (req: Request, res: Response) => {
        try {
            const { appId } = req.params;
            const visaDetails = await VisaApplication.findOne({
                where: { id: appId },
                include: [
                    {
                        model: VisaDetailsData,
                        as: 'visaDetail',
                        required: false
                    },
                    {
                        model: VisaApplicationStatus,
                        as: 'statusLogs',
                        attributes: ['status', 'remarks', 'document', 'changedAt', 'changedBy'],
                        required: false,
                        order: [['changedAt', 'ASC']]
                    },
                    {
                        model: AdminUser,
                        as: 'assignedUser',
                        attributes: ['id', 'user_name']
                    },
                    {
                        model: VisaApplicant,
                        as: 'applicants',
                        include: [
                            {
                                model: ChildUser,
                                as: 'childUser',
                                attributes: ['id', 'details', 'photo', 'passport', 'extractedVisaDetails', 'documents', 'visaId'],
                                include: [
                                    {
                                        model: VisaDetails,
                                        as: 'visa',
                                        attributes: ['id', 'documents'],
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            if (!visaDetails) {
                return sendResponse(res, false, null, null, strings.visa_not_found, HTTP_STATUS_CODES.NOT_FOUND);
            }

            // Fetch payment info related to the application
            const paymentDetails = await Order.findAll({
                where: { applicationId: appId },
                attributes: [
                    'id',
                    'amount',
                    'orderId',
                    'status',
                    'paymentId',
                    'signatureId',
                    'description',
                    'createdAt'
                ]
            });

            // Fetch parent user's contact details
            const user = await User.findByPk(visaDetails.parentUserId, {
                attributes: ['email', 'phoneNumber']
            });

            const ordersWithUserInfo = paymentDetails.map(order => ({
                ...order.toJSON(),
                user
            }));

            const rawResult = visaDetails.toJSON();
            const { assignedUser, applicants, ...rest } = rawResult;

            // Process applicants and compute missing/matched documents
            const applicantsWithDocs = (applicants || []).map((appl: any) => {
                const cu = appl.childUser;
                if (!cu) return appl;

                // Uploaded documents (ignoring photo & passport fields)
                const uploadedDocs = Array.isArray(cu.documents) ? cu.documents : [];
                const uploadedValues = new Set(
                    uploadedDocs
                        .map((d: any) => (d && typeof d.documentName === 'string' ? norm(d.documentName) : null))
                        .filter(Boolean)
                );

                // Required documents from VisaDetails (array of {label, value})
                const requiredDocs = cu?.visa?.documents || [];

                const requiredList = Array.isArray(requiredDocs)
                    ? requiredDocs
                    : [];
                const docsToCheck = requiredList.filter(
                    (doc: any) => doc.value !== "photo" && doc.value !== "passport"
                );

                // Separate matched and missing documents
                // const matchedDocuments = docsToCheck.filter((doc: any) =>
                //     uploadedValues.has(norm(doc.label))
                // );

                const missingDocuments = docsToCheck.filter((doc: any) =>
                    !uploadedValues.has(norm(doc.label))
                );

                return {
                    ...appl,
                    childUser: {
                        ...cu,
                        missingDocuments,  // [{label, value}, ...]
                    }
                };
            });

            const finalResult = {
                ...rest,
                applicants: applicantsWithDocs,
                assignTo: assignedUser,
                paymentDetails: ordersWithUserInfo
            };

            return sendResponse(res, true, finalResult, strings.visa_app_found, null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            logger.error('Error in get visa application:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };


    export const updateVisaApplicationStatus = async (req: CustomRequest, res: Response) => {
        try {
            const { appId, remarks, status, document } = req.body;
            const changedBy = req.user?.id
            let documentUrl: string | null = null;
            if (document) {
                documentUrl = /^https?:\/\//.test(document) ? document : (await uploadToS3Bucket(document)).s3FileUrl;
            }

            const visaApplication = await VisaApplication.findByPk(appId);
            if (!visaApplication) {
                return sendResponse(res, false, null, 'Application not found', 'Invalid appId', HTTP_STATUS_CODES.NOT_FOUND);
            }

            const newStatus = await VisaApplicationStatus.create({
                appId,
                document: documentUrl,
                remarks,
                status,
                changedBy
            });
            await visaApplication.update({ status });
            return sendResponse(res, true, newStatus, 'Application document & status updated successfully', null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            console.log('Error in updateVisaApplicationDocument:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const deleteVisaApplication = async (req: Request, res: Response) => {
        try {
            const { id } = req.query;
            const visaDetails = await VisaApplication.findOne({ where: { id: id } });
            if (!visaDetails) {
                return sendResponse(res, false, null, null, strings.visa_not_found, HTTP_STATUS_CODES.NOT_FOUND);
            }
            await visaDetails.update({ deletedAt: new Date() });
            return sendResponse(res, true, null, strings.visa_app_deleted, null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            logger.error('Error in soft delete visa application:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const applyforVisa = async (req: Request, res: Response) => {
        const { error } = applyForVisaSchema.validate(req.body);
        if (error) return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
        try {
            const { appId, parentUserId, visaId, childUsers } = req.body;
            if (!appId || !Array.isArray(childUsers) || childUsers.length === 0) {
                return sendResponse(res, false, null, 'Invalid input', 'Missing required fields', HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const existingApplication = await VisaApplication.findByPk(appId);
            if (!existingApplication) {
                return sendResponse(res, false, null, 'Application not found', 'Invalid appId', HTTP_STATUS_CODES.NOT_FOUND);
            }

            let newApplicants = [];
            const validChildUsers = childUsers.filter((id: any) => Number(id));

            for (const childUserId of validChildUsers) {
                try {
                    const newApplicant = await VisaApplicant.create({
                        visaApplicationId: appId,
                        childUserId: Number(childUserId),
                        status: 'pending'
                    });

                    newApplicants.push(newApplicant);
                } catch (error: any) {
                    if (error.name === 'SequelizeUniqueConstraintError') {
                        console.log(`Duplicate entry: Child user ${childUserId} already exists in this application`);
                        continue;
                    }
                    if (error.name === 'SequelizeForeignKeyConstraintError') {
                        console.log(`Foreign Key Error: Invalid childUserId: ${childUserId}`);
                        return sendResponse(
                            res,
                            false,
                            null,
                            `Invalid childUserId: ${childUserId}`,
                            'This child user ID does not exist in the database',
                            HTTP_STATUS_CODES.BAD_REQUEST
                        );
                    }
                    throw error;
                }
            }

            // Fetch the updated application with applicants
            const updatedApplication = await VisaApplication.findByPk(appId, {
                include: [
                    {
                        model: VisaApplicant,
                        as: 'applicants',
                        include: [
                            {
                                model: ChildUser,
                                as: 'childUser'
                            }
                        ]
                    }
                ]
            });

            return sendResponse(res, true, updatedApplication, 'Child applicants added to visa application successfully', null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            console.log('Error in applyforVisa:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const assignVisaApplication = async (req: Request, res: Response) => {
        try {
            const { appId, assignTo } = req.body;
            const application = await VisaApplication.findByPk(appId, {
                include: {
                    model: AdminUser,
                    as: 'assignedUser',
                    attributes: ['id', 'name']
                }
            });

            const { assignTo: _, assignedUser, ...rest } = application?.toJSON();
            const data = {
                ...rest,
                assignTo: assignedUser
            }
            const visaApplication = await VisaApplication.findByPk(appId);
            if (!visaApplication) {
                return sendResponse(res, false, null, 'Application not found', 'Invalid appId', HTTP_STATUS_CODES.NOT_FOUND);
            }
            await visaApplication.update({ assignTo });
            return sendResponse(res, true, data, 'Application assigned successfully', null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            console.log('Error in assignVisaApplication:', error);
            return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const updateVisaApplicationDocument = async (req: CustomRequest, res: Response) => {
        try {
            const { appId, remarks, status, document } = req.body;
            const changedBy = req.user?.id;

            let documentUrl: string | null = null;
            if (document) {
                documentUrl = /^https?:\/\//.test(document)
                    ? document
                    : (await uploadToS3Bucket(document)).s3FileUrl;
            }

            const visaApplication = await VisaApplication.findByPk(appId);
            if (!visaApplication) {
                return sendResponse(
                    res,
                    false,
                    null,
                    'Application not found',
                    'Invalid appId',
                    HTTP_STATUS_CODES.NOT_FOUND
                );
            }

            await visaApplication.update({ status });

            const newStatus = await VisaApplicationStatus.create({
                appId,
                document: documentUrl,
                remarks,
                status,
                changedBy
            });

            return sendResponse(
                res,
                true,
                newStatus,
                'Application document & status updated successfully',
                null,
                HTTP_STATUS_CODES.OK
            );
        } catch (error) {
            console.log('Error in updateVisaApplicationDocument:', error);
            return sendResponse(
                res,
                false,
                null,
                null,
                getDBErrorMessage(error),
                HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
            );
        }
    };


}
