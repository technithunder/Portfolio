import { Request, Response } from "express";
import { apiResponse } from "@/utils/apiResponse";
import { progressMessage } from "@/utils/common";
import { handleError } from "@/utils/handleError";
import { DailyProgress } from "@/models/dailyPorgress";
import { User } from "@/models";
import { Op } from "sequelize";


export const checkInDailyProgress = async (req: any, res: Response) => {
    try {
        const { inTime, date } = req.body
        const userId = req?.user?.dataValues?.id;

        const progress = await DailyProgress.create({
            inTime: inTime,
            date: date,
            userId: userId
        })
        return apiResponse(res, 201, progressMessage.PROGRESS_ADD, progress)
    } catch (error) {
        console.error("Error in checkInDailyProgress:", error);
        return handleError(res, error);
    }
}

export const updateDailyProgress = async (req: any, res: Response) => {
    try {
        const id = req.params.id

        const progress = await DailyProgress.findByPk(req.params.id);
        if (!progress) {
            return apiResponse(res, 400, progressMessage.NOT_FOUND)
        }

        await progress.update(req.body);

        return apiResponse(res, 201, progressMessage.PROGRESS_UPDATE, progress)
    } catch (error) {
        console.error("Error in updateDailyProgress:", error);
        return handleError(res, error);
    }
}

export const getDailyProgessByuserIdList = async (req: any, res: Response) => {
    try {

        const {
            page = "1",
            limit = "10",
            // search = "",
            sortBy = "createdAt",
            order = "ASC",
            startDate,
            endDate,
            userId
        } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * pageSize;
        const sortOrder = (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";


        const whereClause: any = {
            userId,
        };

        if (startDate && endDate) {
            whereClause.date = {
                [Op.between]: [startDate, endDate],
            };
        } else if (startDate) {
            whereClause.date = {
                [Op.gte]: startDate,
            };
        } else if (endDate) {
            whereClause.date = {
                [Op.lte]: endDate,
            };
        }
        const { count, rows } = await DailyProgress.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'status'],
                },
            ],
            order: [[sortBy as string, sortOrder]],
            offset,
            limit: pageSize,
        });

        return apiResponse(res, 200, progressMessage.PROGRESS_LIST, {
            total: count,
            page: pageNumber,
            pageSize,
            rows,
        });
    } catch (error) {
        console.error("Error in getDailyProgessByuserIdList:", error);
        return handleError(res, error);
    }
}

export const getuserprogress = async (req: any, res: Response) => {
    try {
        const userId = req?.user?.dataValues?.id;
        const today = new Date().toISOString().slice(0, 10);

        let progress = await DailyProgress.findOne({
            where: {
                userId,
                date: today,
            },
        });

        if (!progress) {
            return apiResponse(res, 200, progressMessage.PROGRESS_FETCH, {})
        }
        return apiResponse(res, 200, progressMessage.PROGRESS_FETCH, progress)
    } catch (error) {
        console.error("Error in getuserprogress:", error);
        return handleError(res, error);
    }
}



export const updateDailyProgressNotes = async (req: any, res: Response) => {
    try {
        const id = req.params.id

        const progress = await DailyProgress.findByPk(req.params.id);
        if (!progress) {
            return apiResponse(res, 400, progressMessage.NOT_FOUND)
        }

        await progress.update({
            notes: req.body.notes
        });

        return apiResponse(res, 201, progressMessage.PROGRESS_UPDATE, progress)
    } catch (error) {
        console.error("Error in updateDailyProgress:", error);
        return handleError(res, error);
    }
}
