import { checkAdminLogin } from "@/middlewares/authMiddleware";
import { Router } from "express";
import { checkInDailyProgress, getDailyProgessByuserIdList, getuserprogress, updateDailyProgress, updateDailyProgressNotes } from "../controller/dailyProgressController";

const router = Router()

/**
 * @swagger
 * tags:
 *   name: DailyProgress
 *   description: API for managing daily staff progress
 */


/**
 * @swagger
 * /api/daily-progress/add:
 *   post:
 *     summary: Check-in staff progress for the current user
 *     tags: [DailyProgress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inTime:
 *                 type: string
 *                 example: "09:30:00"
 *     responses:
 *       201:
 *         description: Progress added successfully
 *       500:
 *         description: Server error
 */

router.post("/add", checkAdminLogin, checkInDailyProgress)

/**
 * @swagger
 * /api/daily-progress/update/{id}:
 *   put:
 *     summary: Update a daily progress record by ID
 *     tags: [DailyProgress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Progress ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leadChecked:
 *                 type: boolean
 *                 example: true
 *               leadFollowed:
 *                 type: boolean
 *                 example: true
 *               checkedTomorrowTasks:
 *                 type: boolean
 *                 example: true
 *               reportingSheetSent:
 *                 type: boolean
 *                 example: false
 *               outTime:
 *                 type: string
 *                 example: "18:00:00"
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       404:
 *         description: Progress not found
 *       500:
 *         description: Server error
 */

router.put("/update/:id", checkAdminLogin, updateDailyProgress)

/**
 * @swagger
 * /api/daily-progress/list:
 *   get:
 *     summary: Get daily progress list of the current user with filters
 *     tags: [DailyProgress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (default createdAt)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Filter by start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: Filter by end date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/list", checkAdminLogin, getDailyProgessByuserIdList)

/**
 * @swagger
 * /api/daily-progress/fetch:
 *   get:
 *     summary: Get today's progress for the current user
 *     tags: [DailyProgress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's progress fetched successfully
 *       500:
 *         description: Server error
 */

router.get("/fetch", checkAdminLogin, getuserprogress)

/**
 * @swagger
 * /api/daily-progress/update-notes/{id}:
 *   put:
 *     summary: Update notes for a daily progress record
 *     description: Updates the `notes` field of an existing daily progress entry by its ID.
 *     tags: [DailyProgress]
 *     security:
 *       - bearerAuth: []   # Requires admin authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the daily progress record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notes
 *             properties:
 *               notes:
 *                 type: string
 *                 example: Completed 80% of the task and updated visuals
 *     responses:
 *       201:
 *         description: Daily progress notes updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Daily progress updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 15
 *                     notes:
 *                       type: string
 *                       example: Completed 80% of the task and updated visuals
 *       400:
 *         description: Progress record not found
 *       500:
 *         description: Server error
 */
router.put("/update-notes/:id", checkAdminLogin, updateDailyProgressNotes);


export default router