import { Request, Response, NextFunction } from "express";
import { registerToken } from "../notification/controller/notificationController"; // adjust path

export const fcmTokenRegister = async (req: any, res: Response, next: NextFunction) => {
    try {
        const fcmtoken = req.headers['fcmtoken'] as string;
        const deviceType = req.headers['devicetype'] as string;
        const userId = req.user?.id || req.user?.dataValues?.id;

        if (fcmtoken && deviceType && userId) {
            await registerToken({ token: fcmtoken, userId, deviceType });
        }

        next();
    } catch (error) {
        console.error("Error in FCM middleware:", error);
        next();
    }
};


