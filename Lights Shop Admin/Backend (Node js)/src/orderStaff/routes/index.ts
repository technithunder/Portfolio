import { authMiddleware } from "@/middlewares/middleware";
import { Router } from "express";
import {
  assignStaffToOrder,
  getStaffOrder,
  removeStaffFromOrder,
} from "../controller/orderSatffControlller";

const OrderStaffRoute = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderStaff:
 *       type: object
 *       properties:
 *         orderId:
 *           type: integer
 *           description: The ID of the order
 *         staffId:
 *           type: integer
 *           description: The ID of the staff member
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: User ID
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         role:
 *           type: string
 *           description: User's role
 *
 *     OrderWithStaff:
 *       type: object
 *       properties:
 *         orderId:
 *           type: integer
 *           description: The ID of the order
 *         assignedStaff:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: List of staff assigned to the order
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           description: Response data
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           description: Error message
 *         error:
 *           type: object
 *           description: Error details
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/orderStaff/add:
 *   post:
 *     summary: Assign staff members to an order
 *     description: Assigns one or more staff members to a specific order
 *     tags: [Order Staff]
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
 *               - orderId
 *             properties:
 *               staffIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of staff IDs to assign to the order
 *                 example: [1, 2, 3]
 *               orderId:
 *                 type: integer
 *                 description: The ID of the order
 *                 example: 123
 *           examples:
 *             assignMultipleStaff:
 *               summary: Assign multiple staff to order
 *               value:
 *                 staffIds: [1, 2, 3]
 *                 orderId: 123
 *             assignSingleStaff:
 *               summary: Assign single staff to order
 *               value:
 *                 staffIds: [1]
 *                 orderId: 123
 *     responses:
 *       200:
 *         description: Staff successfully assigned to order
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/OrderStaff'
 *             example:
 *               success: true
 *               message: "Staff added successfully"
 *               data: [
 *                 {
 *                   orderId: 123,
 *                   staffId: 1
 *                 },
 *                 {
 *                   orderId: 123,
 *                   staffId: 2
 *                 }
 *               ]
 *       400:
 *         description: Bad request - Order not found or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Order not found"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

OrderStaffRoute.post("/add", authMiddleware, assignStaffToOrder);
/**
 * @swagger
 * /api/orderStaff/remove:
 *   post:
 *     summary: Remove staff member from an order
 *     description: Removes a specific staff member from an order
 *     tags: [Order Staff]
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
 *               - staffId
 *             properties:
 *               orderId:
 *                 type: integer
 *                 description: The ID of the order
 *                 example: 123
 *               staffId:
 *                 type: integer
 *                 description: The ID of the staff member to remove
 *                 example: 1
 *           example:
 *             orderId: 123
 *             staffId: 1
 *     responses:
 *       200:
 *         description: Staff successfully removed from order
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: {}
 *                       example: []
 *             example:
 *               success: true
 *               message: "Staff removed successfully"
 *               data: []
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
OrderStaffRoute.post("/remove", authMiddleware, removeStaffFromOrder);
/**
 * @swagger
 * /api/orderStaff/fetch/{orderId}:
 *   get:
 *     summary: Get staff assigned to an order
 *     description: Retrieves all staff members assigned to a specific order
 *     tags: [Order Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order
 *         example: 123
 *     responses:
 *       200:
 *         description: Successfully retrieved staff assigned to order
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/OrderWithStaff'
 *             example:
 *               success: true
 *               message: "Order staff fetched successfully"
 *               data:
 *                 orderId: 123
 *                 assignedStaff: [
 *                   {
 *                     id: 1,
 *                     firstName: "John",
 *                     lastName: "Doe",
 *                     email: "john.doe@example.com",
 *                     role: "manager"
 *                   },
 *                   {
 *                     id: 2,
 *                     firstName: "Jane",
 *                     lastName: "Smith",
 *                     email: "jane.smith@example.com",
 *                     role: "staff"
 *                   }
 *                 ]
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Order not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
OrderStaffRoute.get("/fetch/:orderId", authMiddleware, getStaffOrder);

export default OrderStaffRoute;
