import { Router } from "express";
import { assignStaffToLead, getStaffLead, removeStaffFromLead } from "../controller/leadStaffController";
import { authMiddleware } from "@/middlewares/middleware";

const route = Router()
/**
 * @swagger
 * tags:
 *   name: Lead Staff
 *   description: API endpoints for assigning, removing, and fetching staff for leads
 */

/**
 * @swagger
 * /api/lead-staff/add:
 *   post:
 *     summary: Assign staff members to a lead
 *     tags: [Lead Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - staffIds
 *               - leadId
 *             properties:
 *               staffIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [3, 5, 7]
 *               leadId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Staff assigned to the lead successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Lead not found
 */
route.post("/add", authMiddleware, assignStaffToLead);
/**
 * @swagger
 * /api/lead-staff/remove:
 *   post:
 *     summary: Remove a staff member from a lead
 *     tags: [Lead Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *               - staffId
 *             properties:
 *               leadId:
 *                 type: integer
 *                 example: 10
 *               staffId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Staff removed from the lead successfully
 *       404:
 *         description: Lead or staff not found
 */
route.post("/remove", authMiddleware, removeStaffFromLead);

/**
 * @swagger
 * /api/lead-staff/fetch/{leadId}:
 *   get:
 *     summary: Fetch all staff assigned to a specific lead
 *     tags: [Lead Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lead
 *     responses:
 *       200:
 *         description: List of assigned staff for the lead
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     leadId:
 *                       type: integer
 *                     assignedStaff:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           email:
 *                             type: string
 *                           role:
 *                             type: string
 *       404:
 *         description: Lead not found
 */
route.get("/fetch/:leadId", authMiddleware, getStaffLead);


export default route