import { apiResponse } from "@/utils/apiResponse";
import { AuthMiddlewareMessages } from "@/utils/common";
import { handleError } from "@/utils/handleError";
import { NextFunction , Response } from "express";

export const authorize = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.dataValues.role)) {
        return next(apiResponse(res, 403, AuthMiddlewareMessages.PERMISSION_DENIED ))
    }
    next();
  };
};
