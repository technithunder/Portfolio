import express from "express";
import { checkAdminLogin } from "@/middlewares/authMiddleware";
import { upload } from "@/middlewares/upload";
import { addReview, getReview, reviewList } from "../controllers/reviewController";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: APIs for managing product reviews
 */

/**
 * @swagger
 * /api/review/add-review:
 *   post:
 *     summary: Add a new product review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - rating
 *               - reviewText
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "123"
 *               productId:
 *                 type: string
 *                 example: "456"
 *               rating:
 *                 type: number
 *                 format: float
 *                 example: 4.5
 *               reviewText:
 *                 type: string
 *                 example: "Great product!"
 *               reviewImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Review already exists or validation error
 */
router.post('/add-review', checkAdminLogin, addReview)

/**
 * @swagger
 * /api/review/fetch-review/{id}:
 *   get:
 *     summary: Fetch a specific review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review fetched successfully
 *       400:
 *         description: Review not found
 */
router.get('/fetch-review/:id', checkAdminLogin, getReview)

/**
 * @swagger
 * /api/review/review-list:
 *   get:
 *     summary: Get a paginated list of reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filter reviews by text
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         example: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         example: DESC
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Review list retrieved
 */
router.get('/review-list', checkAdminLogin, reviewList)

export default router