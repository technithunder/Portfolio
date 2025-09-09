import { Router } from "express";
import { addComplaint, addComplaintNote, assignComplaintStaff, complaintList, deleteComplaint, fethComplaint, getComplaintNotes, getStaffLead, removeStaffFromComplaint, updateComplaint } from "../controller/complaintsController";
import { authMiddleware } from "@/middlewares/middleware";


const complaintRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: Complaints management API
 */

/**
 * @swagger
 *  /api/complaint/add:
 *   post:
 *     summary: Create a new complaint for an order
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - description
 *               - userId
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 101
 *               description:
 *                 type: string
 *                 example: "Customer received a damaged product"
 *               targetCloseDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-20"
 *               userId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Complaint created successfully
 *       404:
 *         description: Order not found
 */
complaintRouter.post("/add", authMiddleware, addComplaint)


/**
 * @swagger
 * /api/complaint/fetch/{id}:
 *   get:
 *     summary: Get details of a specific complaint
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Complaint ID
 *     responses:
 *       200:
 *         description: Complaint details fetched
 *       404:
 *         description: Complaint not found
 */

complaintRouter.get("/fetch/:id", authMiddleware, fethComplaint)

/**
 * @swagger
 * /api/complaint/list:
 *   get:
 *     summary: Get paginated list of complaints
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Complaint list fetched
 */
complaintRouter.get("/list", authMiddleware, complaintList)


/**
 * @swagger
 * /api/complaint/delete/{id}:
 *   delete:
 *     summary: Delete a complaint by ID
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Complaint ID
 *     responses:
 *       200:
 *         description: Complaint deleted
 *       404:
 *         description: Complaint not found
 */

complaintRouter.delete("/delete", authMiddleware, deleteComplaint)

/**
 * @swagger
 * /api/complaint/update/{id}:
 *   put:
 *     summary: Update complaint status and target close date
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Complaint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "in_progress"
 *               targetCloseDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-25"
 *     responses:
 *       200:
 *         description: Complaint updated
 *       404:
 *         description: Complaint not found
 */

complaintRouter.put("/update/:id", authMiddleware, updateComplaint)

/**
 * @swagger
 * /api/complaint/assign-staff:
 *   post:
 *     summary: Assign staff members to a complaint
 *     tags: [Complaints]
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
 *               - complaintId
 *             properties:
 *               staffIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [3, 4, 5]
 *               complaintId:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       200:
 *         description: Staff assigned to complaint
 */
complaintRouter.post("/assign-staff", authMiddleware, assignComplaintStaff)

/**
 * @swagger
 * /api/complaint/remove-staff:
 *   post:
 *     summary: Remove staff from a complaint
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - complaintId
 *               - staffId
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 example: 12
 *               staffId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Staff removed from complaint
 */
complaintRouter.post("/remove-staff", authMiddleware, removeStaffFromComplaint)

complaintRouter.get("/fetch-staff/:complaintId", authMiddleware, getStaffLead)

/**
 * @swagger
 * /api/complaint/add-notes:
 *   post:
 *     summary: Add a note to a complaint
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - complaintId
 *               - userId
 *               - note
 *             properties:
 *               complaintId:
 *                 type: integer
 *                 example: 12
 *               userId:
 *                 type: integer
 *                 example: 5
 *               note:
 *                 type: string
 *                 example: "Called customer for update, awaiting response"
 *     responses:
 *       200:
 *         description: Note added successfully
 */

complaintRouter.post("/add-notes", authMiddleware, addComplaintNote)

/**
 * @swagger
 * /api/complaint/list-notes:
 *   get:
 *     summary: List notes for a specific complaint
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: complaintId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: staffId
 *         schema:
 *           type: integer
 *         description: Filter notes by staff ID
 *     responses:
 *       200:
 *         description: Complaint notes list fetched
 */
complaintRouter.get("/list-notes", authMiddleware, getComplaintNotes)

export default complaintRouter