import { HTTP_STATUS_CODES, sendResponse } from "@/constants/api-response";
import { strings } from "@/constants/string.constants";
import { getDBErrorMessage } from "@/utils/db.error";
import { Request, Response } from "express";
import AdminUser from "../model/AdminUser";
import logger from "@/utils/logger";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const dotenv = require('dotenv');
dotenv.config();
export const login = async (req: Request, res: Response) => {
    try {
        const { user_name, password } = req.body;

        const user = await AdminUser.findOne({ where: { user_name } });
        if (!user) {
            return sendResponse(res, false, null, null, strings.user_not_found, HTTP_STATUS_CODES.NOT_FOUND);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendResponse(res, false, null, null, strings.invalid_credentials, HTTP_STATUS_CODES.UNAUTHORIZED);
        }
        const userRole = user_name === "vizayard_admin" ? "admin" : "staff";

        const token = jwt.sign(
            { id: user.id, user_name: user.user_name, role: userRole },
            process.env.JWT_SECRET_KEY,
            { expiresIn: Number(process.env.JWT_EXPIRY_TIME) || 3600 }
        );
        const response = {
            user,
            token
        }
        return sendResponse(res, true, response, strings.login_success, null, HTTP_STATUS_CODES.OK);
    } catch (error) {
        logger.error("Error in login:", error);
        return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
};
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { user_name, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await AdminUser.create({ user_name, password: hashedPassword });
        const token = jwt.sign(
            { id: user.id, user_name: user.user_name, role: 'admin' },
            process.env.JWT_SECRET_KEY,
            { expiresIn: parseInt(process.env.JWT_EXPIRY_TIME || '3600') }
        );
        const data = {
            user, token
        }
        return sendResponse(res, true, data, strings.user_created, null, HTTP_STATUS_CODES.CREATED);
    } catch (error) {
        logger.error("Error in register user:", error);
        return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
}
