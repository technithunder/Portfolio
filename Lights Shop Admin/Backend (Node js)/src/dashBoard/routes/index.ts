import { Router } from "express";
import { dashboardController, dashboardListController } from "../controller/dashBoardController";
import { authMiddleware } from "@/middlewares/middleware";


const dashBoardRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard metrics, summaries, and leaderboard data
 */

/**
 * @swagger
 * /api/dashboard/fetch:
 *   get:
 *     summary: Fetch dashboard overview data
 *     description: |
 *       Returns summary data for dashboard, including:
 *       - Latest active orders
 *       - Latest active leads
 *       - Latest active complaints
 *       - Top 4 staff members based on performance across orders, leads, and complaints
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Fetch data successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderActiveData:
 *                       type: array
 *                       description: Last 4 active orders
 *                       items:
 *                         type: object
 *                         properties:
 *                           totalAmount:
 *                             type: number
 *                           orderNumber:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           status:
 *                             type: string
 *                           customerName:
 *                             type: string
 *                           expectedDate:
 *                             type: string
 *                             format: date-time
 *                     leadActiveData:
 *                       type: array
 *                       description: Last 4 active leads with staff
 *                     complaintActiveData:
 *                       type: array
 *                       description: Last 4 active complaints with staff and order info
 *                     topFourstaff:
 *                       type: array
 *                       description: Top 4 staff members ranked by performance
 */

dashBoardRouter.get("/fetch", authMiddleware, dashboardController)

/**
 * @swagger
 * /api/dashboard/list:
 *   get:
 *     summary: Fetch detailed active items list for a given type
 *     description: |
 *       Returns paginated "active" data depending on `listType`:
 *       - `active_order`: uses **fetchActiveOrders**
 *       - `active_lead`: uses **getActiveLead**
 *       - `active_staff`: returns staff leaderboard
 *       - `active_complaints`: returns active complaints
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: listType
 *         required: true
 *         description: Type of list to fetch
 *         schema:
 *           type: string
 *           enum: [active_order, active_lead, active_staff, active_complaints]
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
 *         description: Search keyword for filtering (varies by listType)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (depends on listType)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *     responses:
 *       200:
 *         description: Active items fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Active orders fetched successfully
 *                 data:
 *                   type: object
 *                   description: Structure depends on listType
 *       400:
 *         description: Invalid listType or parameters
 */
dashBoardRouter.get("/list", authMiddleware, dashboardListController)

export default dashBoardRouter