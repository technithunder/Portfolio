import { HTTP_STATUS_CODES, sendResponse } from "@/constants/api-response";
import { createScheduleCallAmountSchema } from "../validations/request.scheduleCallAmount";
import { Request, Response } from "express";
import ScheduleCallAmount from "../models/scheduleCallAmount";
import { getDBErrorMessage } from "@/utils/db.error";

export namespace ScheduleCallAmountController {
    export const createScheduleCallAmount = async (req: Request, res: Response) => {
        try {
            const { error } = createScheduleCallAmountSchema.validate(req.body);
            const { amount, timeDuration } = req.body;
            if (error) {
                return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const scheduleCallAmount = await ScheduleCallAmount.create({
                amount,
                timeDuration
            });
            sendResponse(res, true, scheduleCallAmount, 'Schedule Call Amount created successfully', null, HTTP_STATUS_CODES.CREATED);
        } catch (error) {
            sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const getAllScheduleCallAmount = async (req: Request, res: Response) => {
        try {
            const scheduleCallAmount = await ScheduleCallAmount.findAll();
            sendResponse(res, true, scheduleCallAmount, 'Schedule Call Amount fetched successfully', null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };
    
}
