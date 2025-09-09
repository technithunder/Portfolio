import { Router } from "express";
import { authMiddleware } from "@/middlewares/middleware";
import { deletenotification, notificationList, readNotification } from "../controller/notificationController";
const router = Router();





/**
 * @swagger
 * /api/notification/notification-list:
 *   get:
 *     summary: Get paginated list of notifications for the authenticated user
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of notifications per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of notifications fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized
 */
router.get("/notification-list", authMiddleware, notificationList)

/**
 * @swagger
 * /api/notification/notification-delete:
 *   delete:
 *     summary: Delete a specific notification or all notifications of a user
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Notification ID to delete
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all]
 *         required: false
 *         description: If "all", deletes all notifications for the user
 *     responses:
 *       200:
 *         description: Notification(s) deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request - provide either 'id' or 'type=all'
 *       401:
 *         description: Unauthorized
 */
router.delete("/notification-delete", authMiddleware, deletenotification)

/**
 * @swagger
 * /api/notification/notification-read:
 *   get:
 *     summary: Read a specific notification or all notifications of a user
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Notification ID 
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all]
 *         required: false
 *         description: If "all", Read all notifications for the user
 *     responses:
 *       200:
 *         description: Notification(s) read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request - provide either 'id' or 'type=all'
 *       401:
 *         description: Unauthorized
 */
router.get("/notification-read", authMiddleware, readNotification)

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         imageUrl:
 *           type: string
 *         data:
 *           type: object
 *         type:
 *           type: string
 *         status:
 *           type: string
 *           enum: [sent, failed]
 *         errorMessage:
 *           type: string
 *           nullable: true
 *         mobileRedirect:
 *           type: string
 *         webRedirectUrl:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export default router