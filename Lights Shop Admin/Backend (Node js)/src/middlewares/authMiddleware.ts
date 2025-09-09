import { User } from "@/models";
import Admin from "@/models/admin";
import { apiResponse } from "@/utils/apiResponse";
import { AuthMiddlewareMessages } from "@/utils/common";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const checkAdminLogin = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return apiResponse(
        res,
        401,
        AuthMiddlewareMessages.AUTHORIZATION_MISSING
      );
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const admin = await User.findByPk(decoded.id);

    if (!admin) {
      return apiResponse(res, 401, AuthMiddlewareMessages.NOT_ADMIN);
    }
    req.user = admin;
    next();
  } catch (error: any) {
    apiResponse(res, 401, AuthMiddlewareMessages.INVALID_TOKEN);
  }
};
