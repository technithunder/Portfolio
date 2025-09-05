import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS_CODES, sendResponse } from "@/constants/api-response";
import { strings } from "@/constants/string.constants";
const dotenv = require('dotenv');
dotenv.config();

export interface CustomRequest extends Request {
    user?: {
      id: string;
      user_name: string;
      role: string;
    };
  }

export const authenticateUser = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {        
        const token = req.headers.authorization?.split(" ")[1] || req.headers.authorization;
        if (!token) {
            return sendResponse(res, false, null, null, strings.no_token_provided, HTTP_STATUS_CODES.UNAUTHORIZED);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as any
        if (!decoded) {
            return sendResponse(res, false, null, null, strings.invalid_token, HTTP_STATUS_CODES.UNAUTHORIZED);
        }
        req.user = decoded;
        next();
        
    } catch (error) {
        if ((error as Error).message === 'jwt expired') {
            return sendResponse(res,false,null,null,strings.token_expired,HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        return sendResponse(res, false, null, null, strings.invalid_token, HTTP_STATUS_CODES.UNAUTHORIZED);
    }
};

export const authorizeRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return sendResponse(res, false, null, null, strings.no_token_provided, HTTP_STATUS_CODES.UNAUTHORIZED);
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { role: string };
            
            if (!roles.includes(decoded.role)) {
                return sendResponse(res, false, null, null, strings.you_dont_have_access, HTTP_STATUS_CODES.UNAUTHORIZED);
            }

            next();
        } catch (error) {
            return sendResponse(res, false, null, null, strings.invalid_token, HTTP_STATUS_CODES.UNAUTHORIZED);
        }
    };
};


