import { Request, Response } from "express";
import { HTTP_STATUS_CODES, sendResponse } from "@/constants/api-response";
import { VisaTypeSchema } from "../validations/visatype.request.validate";
import VisaType from "../models/visaType";
import { strings } from "@/constants/string.constants";

export namespace VisaTypeController {
    
    // Create a new Visa Type
    export const createVisaType = async (req: Request, res: Response) => {
        const { error } = VisaTypeSchema.validate(req.body);
        if (error) {
            return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
        }
        try {
            const { label } = req.body;
            const value = label.toLowerCase().replace(/\s+/g, "-");

            const visaType = await VisaType.create({ label, value });

            return sendResponse(res, true, visaType, strings.visatype_created, null, HTTP_STATUS_CODES.CREATED);
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    // Get All Visa Types
    export const getAllVisaType = async (_req: Request, res: Response) => {
        try {
            const visaTypes = await VisaType.findAll();
            return sendResponse(res, true, visaTypes, strings.visatype_fetched, null, HTTP_STATUS_CODES.OK);
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    // Get Visa Type by ID
    export const getVisaType = async (req: Request, res: Response) => {
        try {
            const id = Number(req.query.id);

            if (!id) {
                return sendResponse(res, false, null, null, strings.visatype_id_required, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const visaType = await VisaType.findByPk(id);
            if (!visaType) {
                return sendResponse(res, false, null, null, strings.visatype_not_found, HTTP_STATUS_CODES.NOT_FOUND);
            }

            return sendResponse(res, true, visaType, strings.visatype_fetched, null, HTTP_STATUS_CODES.OK);
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    // Update Visa Type
    export const updateVisaType = async (req: Request, res: Response) => {
        try {
            const id = Number(req.query.id);
            if (!id) {
                return sendResponse(res, false, null, null, strings.visatype_id_required, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const { error } = VisaTypeSchema.validate(req.body);
            if (error) {
                return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const { label } = req.body;
            const value = label.toLowerCase().replace(/\s+/g, "-");

            const visaType = await VisaType.findByPk(id);
            if (!visaType) {
                return sendResponse(res, false, null, null, strings.visatype_not_found, HTTP_STATUS_CODES.NOT_FOUND);
            }

            await visaType.update({ label, value });

            return sendResponse(res, true, visaType, strings.visatype_updated, null, HTTP_STATUS_CODES.OK);
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    // Delete Visa Type
    export const deleteVisaType = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return sendResponse(res, false, null, null, strings.visatype_id_required, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const visaType = await VisaType.findByPk(id);
            if (!visaType) {
                return sendResponse(res, false, null, null, strings.visatype_not_found, HTTP_STATUS_CODES.NOT_FOUND);
            }

            await visaType.destroy();
            return sendResponse(res, true, null, strings.visatype_deleted, null, HTTP_STATUS_CODES.OK);
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };
}
