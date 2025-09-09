import express from "express";
import {
    createCategory, deleteCategory, editCategory, fetchCategory, getAllCategory
} from "../controller/categoryController";
import { checkAdminLogin } from "@/middlewares/authMiddleware";
import { upload } from "@/middlewares/upload";
import { authMiddleware } from "@/middlewares/middleware";
import { authorize } from "@/middlewares/authorizeMiddleware";
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management APIs
 */

/**
 * @swagger
 * /api/category/add-category:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       200:
 *         description: Category created successfully
 *       400:
 *         description: Category already exists
 */
router.post('/add-category', checkAdminLogin, createCategory)

/**
 * @swagger
 * /api/category/fetch-category/{id}:
 *   get:
 *     summary: Fetch category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category fetched successfully
 *       400:
 *         description: Category not found
 */
router.get('/fetch-category/:id', checkAdminLogin, fetchCategory)

/**
 * @swagger
 * /api/category/update-category/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Category Name
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Category already exists or not found
 */
router.put('/update-category/:id', checkAdminLogin, editCategory)

/**
 * @swagger
 * /api/category/list-category:
 *   get:
 *     summary: Get paginated and searchable category list
 *     tags: [Category]
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
 *         description: Search by category name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: name
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           example: all
 *         description: Use `all` to fetch all categories without pagination
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         description: Server error
 */
router.get('/list-category', checkAdminLogin, getAllCategory)

/**
 * @swagger
 * /api/category/delete-category{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *                 data:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Cannot delete category due to existing associated products or not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete-category/:id', checkAdminLogin, deleteCategory)

export default router