import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { adminLoginSchema } from "../schemas/adminSchema";
import Admin from "@/models/admin";
import { apiResponse } from "@/utils/apiResponse";
import { LoginMessages } from "@/utils/common";
import { handleError } from "@/utils/handleError";
import User from "@/models/user";
import { registerToken } from "@/notification/controller/notificationController";

// admin login api
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const validatedData = adminLoginSchema.parse(req.body);
    const { email, password } = validatedData;
    const { fcmtoken } = req.body
    const user: any = await User.findOne({ where: { email } });
    if (!user) {
      return apiResponse(res, 400, LoginMessages.INVALID_CREDENTIALS);
    }
    if (user.dataValues.status === "In Active") {
      return apiResponse(res, 400, LoginMessages.ACCOUNT_INACTIVE);
    }
    let isMatch = false;
    let loggedInEntity = null;
    let role = "";

    if (!isMatch && user) {
      isMatch = await bcrypt.compare(password, user.dataValues?.Password);
      if (isMatch) {
        loggedInEntity = user;
        role = "user";
      }
    }

    if (!isMatch) {
      return apiResponse(res, 400, LoginMessages.INVALID_CREDENTIALS);
    }

    const token = jwt.sign(
      {
        id: loggedInEntity.id,
        email: loggedInEntity.email,
        role: role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    let data = user?.dataValues;

    delete user.dataValues.Password
    if (user) {
      data = user?.dataValues;
    } else {
      // data = admin?.dataValues;
    }
    if (fcmtoken) {

      registerToken({ token: fcmtoken, userId: data.id, deviceType: req.headers.devicetype })
    }
    return apiResponse(res, 200, LoginMessages.LOGIN_SUCCESS, {
      token,
      ...data,
    });
  } catch (error: any) {
    handleError(res, error);
  }
};
