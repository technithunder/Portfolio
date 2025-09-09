import { authMiddleware } from "@/middlewares/middleware";
import { Router } from "express";
import {
  addLeadNotes,
  createCustomerToUser,
  createLead,
  getAllLeads,
  getLeadById,
  getLeadNotes,
  updateLead,
} from "../controller/leadController";

const leadRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Lead management APIs
 */

/**
 * @swagger
 * /api/lead/add:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: example@mail.com
 *               customerName:
 *                 type: string
 *                 example: John Doe
 *               mobileNumber:
 *                 type: string
 *                 example: "9876543210"
 *               type:
 *                 type: string
 *                 example: hot
 *                 enum: [hot, warm,cold]
 *               requirement:
 *                 type: string
 *                 example: Looking for 2BHK in Mumbai
 *               followUpDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-18"
 *               followUpTime:
 *                 type: string
 *                 example: "14:30"
 *     responses:
 *       200:
 *         description: Lead created successfully
 *       400:
 *         description: Validation error
 */
leadRoute.post("/add", authMiddleware, createLead);

/**
 * @swagger
 * /api/lead/fetch/{id}:
 *   get:
 *     summary: Get a lead by ID
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *     responses:
 *       200:
 *         description: Lead fetched successfully
 *       404:
 *         description: Lead not found
 */
leadRoute.get("/fetch/:id", authMiddleware, getLeadById);

/**
 * @swagger
 * /api/lead/update/{id}:
 *   put:
 *     summary: Update a lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: example@mail.com
 *               customerName:
 *                 type: string
 *                 example: John Updated
 *               mobileNumber:
 *                 type: string
 *                 example: "9876543210"
 *               type:
 *                 type: string
 *                 example: hot
 *                 enum: [hot, warm,cold]
 *               requirement:
 *                 type: string
 *                 example: Need to sell 1BHK
 *               followUpDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-20"
 *               followUpTime:
 *                 type: string
 *                 example: "16:00"
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *       404:
 *         description: Lead not found
 */
leadRoute.put("/update/:id", authMiddleware, updateLead);

/**
 * @swagger
 * /api/lead/getAllLead:
 *   get:
 *     summary: Get all leads with filters and pagination
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: John
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: followUpDate
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: ASC
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-30"
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           example: buyer
 *     responses:
 *       200:
 *         description: Leads fetched successfully
 */
leadRoute.get("/getAllLead", authMiddleware, getAllLeads);

/**
 * @swagger
 * /api/lead/convert-to-user:
 *   post:
 *     summary: Create user from lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leadId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Dealer created successfully from lead
 *       400:
 *         description: Validation error
 */
leadRoute.post("/convert-to-user", authMiddleware, createCustomerToUser);


/**
 * @swagger
 * /api/lead/add-notes:
 *   post:
 *     summary: Add a note to a lead
 *     tags: [Leads]
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
 *               - userId
 *               - note
 *             properties:
 *               leadId:
 *                 type: integer
 *                 example: 15
 *               userId:
 *                 type: integer
 *                 example: 5
 *               note:
 *                 type: string
 *                 example: "Followed up with client, awaiting feedback on proposal"
 *     responses:
 *       200:
 *         description: Note added successfully to the lead
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Added Note in the Lead
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     leadId:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     note:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Lead not found
 */
leadRoute.post("/add-notes", authMiddleware, addLeadNotes);

/**
 * @swagger
 * /api/lead/list-notes:
 *   get:
 *     summary: Get paginated list of notes for leads
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search term to filter notes or user names
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
 *           default: createdAt
 *       - name: order
 *         in: query
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *       - name: leadId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: userId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: staffId
 *         in: query
 *         schema:
 *           type: integer
 *         description: Filter notes by staff who created them
 *     responses:
 *       200:
 *         description: Lead notes list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Lead notes fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     leads:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           note:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           User:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 *                               role:
 *                                 type: string
 *                           Lead:
 *                             type: object
 *                             properties:
 *                               customerName:
 *                                 type: string
 *                               mobileNumber:
 *                                 type: string
 *                               type:
 *                                 type: string
 *                               requirement:
 *                                 type: string
 */
leadRoute.get("/list-notes", authMiddleware, getLeadNotes);
export default leadRoute;
