import { Request, Response } from "express";
import { apiResponse } from "@/utils/apiResponse";
import { handleError } from "@/utils/handleError";
import DeviceToken from "@/models/deviceToken";
import Notification from "@/models/notification";
import { message } from "@/config/fireBase.config";
import { Op, where } from "sequelize";

export const registerToken = async (payload: any) => {
    try {
        const { token, userId, deviceType } = payload;

        if (!['web', 'mobile'].includes(deviceType)) return;
        if (!token || !userId) throw new Error("Token and userId are required");

        const tokenField = deviceType === 'web' ? 'webtoken' : 'mobiletoken';

        // 🔥 Step 1: Remove token if it exists in either webtoken or mobiletoken
        await DeviceToken.destroy({
            where: {
                [Op.or]: [
                    { mobiletoken: token },
                    { webtoken: token }
                ],
            },
        });

        // // 🧹 Step 2: Remove old token of the same user/deviceType (optional cleanup)
        await DeviceToken.destroy({
            where: {
                userId,
                deviceType,
            },
        });

        // ✅ Step 3: Store new token
        const newToken = await DeviceToken.create({
            userId,
            deviceType,
            [tokenField]: token,
            isActive: true,
        });

        return newToken;

    } catch (error: any) {
        console.error('Token registration error:', error);
        return null
    }
};

export const addNotification = async (payload: any) => {
    try {
        const {
            userIds, // 👈 array of user IDs
            title,
            body,
            data,
            imageUrl,
            type,
            mobileRedirect,
            webRedirectUrl,
        } = payload;

        if (!Array.isArray(userIds) || userIds.length === 0) {
            throw new Error("userIds must be a non-empty array");
        }

        // Step 1: Fetch all active device tokens for the users
        const tokens = await DeviceToken.findAll({
            where: {
                userId: { [Op.in]: userIds },
                isActive: true,
            },
        });

        // Step 2: Create a map of userId => all tokens (mobile and web)
        const userTokensMap: Record<number, string[]> = {};

        for (const tokenObj of tokens as any[]) {
            const userId = tokenObj.userId;
            let token: string | null = null;

            if (tokenObj.deviceType === "mobile" && tokenObj.mobiletoken) {
                token = tokenObj.mobiletoken;
            } else if (tokenObj.deviceType === "web" && tokenObj.webtoken) {
                token = tokenObj.webtoken;
            }

            if (!token) continue;

            if (!userTokensMap[userId]) {
                userTokensMap[userId] = [];
            }

            userTokensMap[userId].push(token);
        }

        // Step 3: Flatten and deduplicate all tokens
        const allTokens = [...new Set(Object.values(userTokensMap).flat())];

        if (allTokens.length === 0) {
            throw new Error("No device tokens found for users");
        }

        // Step 4: Prepare FCM multicast payload
        const fcmPayload = {
            tokens: allTokens,
            notification: {
                title,
                body,
                imageUrl,
            },
            data: {
                ...(data || {}),
                mobileRedirect: mobileRedirect || "",
                webRedirectUrl: webRedirectUrl || "",
            },
        };

        // Step 5: Send multicast via Firebase
        const fcmResponse = await message.sendEachForMulticast(fcmPayload);

        // Step 6: Save individual Notification records
        const notifications = await Promise.all(
            userIds.map(async (userId) => {
                const userTokens = userTokensMap[userId] || [];
                const failedTokens = fcmResponse.responses
                    .map((res, idx) => ({ res, token: allTokens[idx] }))
                    .filter(({ res, token }) => !res.success && userTokens.includes(token))
                    .map(({ token }) => token);

                return await Notification.create({
                    userId,
                    title,
                    body,
                    data,
                    imageUrl,
                    type,
                    status: failedTokens.length > 0 ? "failed" : "sent",
                    errorMessage: failedTokens.length
                        ? `Failed tokens: ${JSON.stringify(failedTokens)}`
                        : null,
                    fcmResponse,
                    mobileRedirect,
                    webRedirectUrl,
                });
            })
        );
        return {
            success: true,
            message: "Notifications sent and saved",
            count: userIds.length,
            fcmResponse,
            notifications,
        };
    } catch (error: any) {
        console.error("Notification Error:", error);
        return {
            success: false,
            message: error.message,
        };
    }
};

export const notificationList = async (req: any, res: Response) => {
    try {
        const {
            page = "1",
            limit = "10",
            search = "",
            sortBy = "createdAt",
            order = "DESC",

        } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * pageSize;
        const sortOrder = (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

        const whereCondition: any = {
            [Op.and]: [{ userId: { [Op.eq]: req.user.dataValues.id }, status: { [Op.eq]: 'sent' } }],
        };
        const { rows: notification, count: totalCount } = await Notification.findAndCountAll({
            where: whereCondition,
            offset,
            limit: pageSize,
            order: [[sortBy as string, sortOrder]],
        });
        const unreadCount = await Notification.count({
            where: {
                userId: req.user.dataValues.id,
                isRead: false,
                status: 'sent'
            },
        });
        if (notification.length === 0) {
            return apiResponse(res, 200, 'Notification fetch Sucessfully', {
                total: 0,
                page: pageNumber,
                pageSize,
                data: [],
            });
        }

        return apiResponse(res, 200, 'Notification fetch Sucessfully', {
            total: totalCount,
            page: pageNumber,
            unreadCount,
            pageSize,
            data: notification,
        });
    } catch (error: any) {
        handleError(res, error)
    }
}

export const deletenotification = async (req: any, res: Response) => {
    try {
        const { id, type } = req.query;
        const userId = req.user.dataValues.id;

        if (id) {
            const deleted = await Notification.destroy({
                where: { id, userId },
            });

            return apiResponse(res, 200, deleted ? "Notification deleted" : "Notification not found");
        }

        if (type === "all") {
            await Notification.destroy({
                where: { userId },
            });

            return apiResponse(res, 200, "All notifications deleted");
        }

        return apiResponse(res, 400, "Invalid request: Provide either 'id' or 'type=all'");
    } catch (error: any) {
        handleError(res, error);
    }
};

export const readNotification = async (req: any, res: Response) => {
    try {

        const { id, type } = req.query
        const userId = req.user.dataValues.id;
        if (id) {
            const read = await Notification.update({ isRead: true }, { where: { id: id, userId: userId } })
            return apiResponse(res, 200, "Notification Mark as Read");
        }
        if (type === 'all') {
            const read = await Notification.update({ isRead: true }, { where: { userId: userId } })
            return apiResponse(res, 200, "Notification Mark as Read");
        }

    } catch (error: any) {
        handleError(res, error);
    }
}