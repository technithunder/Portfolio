import { authMiddleware } from "@/middlewares/middleware";
import { Router } from "express";
import {
  addToWishList,
  removeWish,
  whishList,
} from "../controller/wishListController";
import { checkAdminLogin } from "@/middlewares/authMiddleware";

const whishRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: API endpoints for managing the user wishlist
 */

/**
 * @swagger
 * /api/wishlist/add:
 *   post:
 *     summary: Add a product to the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product added to wishlist successfully
 *       400:
 *         description: Product already in wishlist or not found
 *       500:
 *         description: Internal server error
 */

whishRoute.post("/add", authMiddleware, addToWishList);

/**
 * @swagger
 * /api/wishlist/list:
 *   get:
 *     summary: Get wishlist items of the logged-in user
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
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
 *         description: Wishlist fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 */
whishRoute.get("/list", authMiddleware, whishList);
/**
 * @swagger
 * /api/wishlist/remove-item/{productId}:
 *   get:
 *     summary: Remove a product from the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove from wishlist
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 */
whishRoute.get("/remove-item/:productId", authMiddleware, removeWish);

export default whishRoute;
