import express from "express";
import {
  addOrderNotes,
  addQuery,
  approveOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrderNotes,
  getUserOrders,
  updateOrder,
  updateOrderStatus,
  uploadPaymentImage,
} from "../controllers/orderController";
import { checkAdminLogin } from "@/middlewares/authMiddleware";
import { upload } from "@/middlewares/upload";
import { authMiddleware } from "@/middlewares/middleware";
import { authorize } from "@/middlewares/authorizeMiddleware";

const router = express.Router();
/**
 * @swagger
 * /api/order/add:
 *   post:
 *     summary: Create a new Order with multiple items
 *     tags: [Orders]
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
 *               - shippingAddress
 *               - totalAmount
 *               - totalItems
 *               - orderItems
 *               - image
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user placing the order
 *                 example: 1
 *               shippingAddress:
 *                 type: string
 *                 description: Complete shipping address
 *                 example: "123 Main Street, City, State 12345"
 *               totalAmount:
 *                 type: number
 *                 format: float
 *                 description: Total amount for the entire order
 *                 example: 349.97
 *               totalItems:
 *                 type: integer
 *                 description: Total number of items in the order
 *                 example: 3
 *               customerName:
 *                 type: string
 *                 description: Customer name (optional, will use user's name if not provided)
 *                 example: "John Doe"
 *               orderItems:
 *                 type: string
 *                 description: JSON string of order items array
 *                 example: '[{"productId":1,"quantity":2,"unitPrice":99.99,"ledcolors":"red,blue","bodycolors":"black","watts":"50W","reflectors":"standard"},{"productId":2,"quantity":1,"unitPrice":149.99,"ledcolors":"white","bodycolors":"silver","watts":"100W","reflectors":"premium"}]'
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                   example: "Order created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         userId:
 *                           type: integer
 *                           example: 1
 *                         customerName:
 *                           type: string
 *                           example: "John Doe"
 *                         totalAmount:
 *                           type: number
 *                           example: 349.97
 *                         totalItems:
 *                           type: integer
 *                           example: 3
 *                         orderNumber:
 *                           type: string
 *                           example: "ORD-1234"
 *                         orderPayment:
 *                           type: string
 *                           example: "credit_card"
 *                         shippingAddress:
 *                           type: string
 *                           example: "123 Main Street, City, State 12345"
 *                         status:
 *                           type: string
 *                           enum: [order_placed, processing, shipped, out_for_delivery, delivered, cancelled]
 *                           example: "order_placed"
 *                         image:
 *                           type: string
 *                           example: "https://res.cloudinary.com/dvb75ed4h/image/upload/v1747131719/orders/order_image.jpg"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-07-01T10:22:00.048Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-07-01T10:22:00.048Z"
 *                     orderItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           orderId:
 *                             type: integer
 *                             example: 1
 *                           productId:
 *                             type: integer
 *                             example: 1
 *                           productName:
 *                             type: string
 *                             example: "LED Light Pro"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           unitPrice:
 *                             type: number
 *                             example: 99.99
 *                           totalPrice:
 *                             type: number
 *                             example: 199.98
 *                           ledcolors:
 *                             type: string
 *                             example: "red,blue"
 *                           bodycolors:
 *                             type: string
 *                             example: "black"
 *                           watts:
 *                             type: string
 *                             example: "50W"
 *                           reflectors:
 *                             type: string
 *                             example: "standard"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-07-01T10:22:00.048Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-07-01T10:22:00.048Z"
 *       400:
 *         description: Invalid request payload or validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                       message:
 *                         type: string
 *                   example:
 *                     - path: ["userId"]
 *                       message: "User ID is required"
 *                     - path: ["orderItems"]
 *                       message: "At least one order item is required"
 *       401:
 *         description: Unauthorized - Valid authentication token required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       404:
 *         description: User or Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/add", checkAdminLogin, upload.single("orderPayment"), createOrder);

/**
 * @swagger
 * /api/order/getAllOrders:
 *   get:
 *     summary: Get all Orders with optional filters and pagination
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *       - in: query
 *         name: staffId
 *         schema:
 *           type: number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: isAdmin
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: A list of orders with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       customerName:
 *                         type: string
 *                       buyingPrice:
 *                         type: number
 *                       category:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       image:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalOrders:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *       401:
 *         description: Unauthorized - Admin login required
 *       500:
 *         description: Internal Server Error
 */
router.get("/getAllOrders", checkAdminLogin, getAllOrders);

/**
 * @swagger
 * /api/order/{id}:
 *   put:
 *     summary: Update an existing Order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               buyingPrice:
 *                 type: number
 *               categoryId:
 *                 type: number
 *               quantityId:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Order Updated Successfully
 *               data:
 *                 id: 4
 *                 customerName: updated name
 *                 buyingPrice: 500
 *                 categoryId: 9
 *                 quantityId: 102
 *                 image: "https://res.cloudinary.com/..."
 *                 updatedAt: "2025-05-19T05:39:03.924Z"
 *                 createdAt: "2025-05-19T05:39:03.924Z"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - Admin login required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", checkAdminLogin, upload.single("image"), updateOrder);

/**
 * @swagger
 * /api/order/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order to delete
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Order Deleted Successfully
 *       401:
 *         description: Unauthorized - Admin login required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", checkAdminLogin, deleteOrder);

/**
 * @swagger
 * /api/order/fetch-user-order:
 *   get:
 *     summary: Get user Orders with optional filters and pagination
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: A list of orders with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       customerName:
 *                         type: string
 *                       buyingPrice:
 *                         type: number
 *                       category:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       image:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalOrders:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *       401:
 *         description: Unauthorized - Admin login required
 *       500:
 *         description: Internal Server Error
 */
router.get("/fetch-user-order", authMiddleware, getUserOrders);

/**
 * @swagger
 * /api/order/order-detail/{orderId}:
 *   get:
 *     summary: Get order details by order ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details fetched successfully
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
 *                   example: Order fetched successfully
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     orderNumber:
 *                       type: string
 *                       example: ORD123456
 *                     customerName:
 *                       type: string
 *                       example: John Doe
 *                     totalAmount:
 *                       type: number
 *                       example: 299.99
 *                     totalItems:
 *                       type: integer
 *                       example: 2
 *                     status:
 *                       type: string
 *                       example: confirmed
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                     orderItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           productId:
 *                             type: integer
 *                           productName:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           unitPrice:
 *                             type: number
 *                           totalPrice:
 *                             type: number
 *                           ledcolors:
 *                             type: string
 *                           bodycolors:
 *                             type: string
 *                           watts:
 *                             type: string
 *                           reflectors:
 *                             type: string
 *                           size:
 *                             type: string
 *       400:
 *         description: Order ID is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order ID is required
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Internal server error
 */
router.get("/order-detail/:orderId", authMiddleware, getOrderById);

/**
 * @swagger
 * /api/order/payment-upload:
 *   post:
 *     summary: Upload an order payment image
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - orderPayment
 *             properties:
 *               orderId:
 *                 type: integer
 *                 description: ID of the order to attach the payment image to
 *               orderPayment:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully and order updated
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Payment image uploaded successfully
 *               data: "https://res.cloudinary.com/.../order_payment.jpg"
 *       400:
 *         description: Invalid request or file not provided
 *       500:
 *         description: Internal server error
 */
router.post(
  "/payment-upload",
  authMiddleware,
  upload.single("orderPayment"),
  uploadPaymentImage
);


/**
 * @swagger
 * /api/order/order-status/{id}:
 *   put:
 *     summary: Update the status of an existing order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: confirmed
 *                 description: New status for the order
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Order status updated successfully
 *               data:
 *                 orderId: 12
 *                 orderNumber: ORD123456
 *                 status: confirmed
 *                 updatedAt: "2025-06-24T14:30:00.000Z"
 *       400:
 *         description: Status is missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               message: Status is required
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             example:
 *               message: Order not found
 *       500:
 *         description: Internal server error
 */
router.put("/order-status/:id", authMiddleware, authorize("staff", "admin"), updateOrderStatus);


/**
 * @swagger
 * /api/order/order-approve/{orderId}:
 *   put:
 *     summary: Update the approval of an existing order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approvedStatus
 *             properties:
 *               approvedStatus:
 *                 type: string
 *                 example: approve
 *     responses:
 *       200:
 *         description: Order  updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Order  updated successfully
 *               data:
 *                 orderId: 12
 *                 orderNumber: ORD123456
 *                 isApproved: true
 *                 updatedAt: "2025-06-24T14:30:00.000Z"
 *       400:
 *         description: Status is missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               message: is Approved flage  is required
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             example:
 *               message: Order not found
 *       500:
 *         description: Internal server error
 */
router.put("/order-approve/:orderId", authMiddleware, authorize("staff", "admin"), approveOrder)

/**
 * @swagger
 * /api/order/add-query:
 *   post:
 *     summary: Add a query string to an existing order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []  # If you're using JWT-based auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - query
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 101
 *                 description: The ID of the order to update
 *               query:
 *                 type: string
 *                 example: "25-07-2025"
 *                 description: The query string to attach to the order
 *     responses:
 *       200:
 *         description: Query added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Query added successfully.
 *                 data:
 *                   type: object
 *                   description: Sequelize update result
 *       400:
 *         description: Missing orderId or query
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

router.post("/add-query", authMiddleware, addQuery)


/**
 * @swagger
 * /api/order/add-notes:
 *   post:
 *     summary: Add a note to an order
 *     tags: [Orders]
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
 *               - userId
 *               - note
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 101
 *               userId:
 *                 type: integer
 *                 example: 5
 *               note:
 *                 type: string
 *                 example: "Customer confirmed delivery date change to next Monday"
 *     responses:
 *       200:
 *         description: Note added successfully to the order
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
 *                   example: Added Note in the Order
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     orderId:
 *                       type: integer
 *                       example: 101
 *                     userId:
 *                       type: integer
 *                       example: 5
 *                     note:
 *                       type: string
 *                       example: Customer confirmed delivery date change to next Monday
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Order not found
 */
router.post("/add-notes", authMiddleware, addOrderNotes)

/**
 * @swagger
 * /api/order/list-notes:
 *   get:
 *     summary: Get paginated list of notes for orders
 *     tags: [Orders]
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
 *       - name: orderId
 *         in: query
 *         schema:
 *           type: integer
 *         description: Filter notes by order ID
 *       - name: userId
 *         in: query
 *         schema:
 *           type: integer
 *         description: Filter notes by user ID
 *       - name: staffId
 *         in: query
 *         schema:
 *           type: integer
 *         description: Filter notes by staff who created them
 *     responses:
 *       200:
 *         description: Order notes list fetched successfully
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
 *                   example: Order notes fetched successfully
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
 *                     orders:
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
 *                           Order:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               orderNumber:
 *                                 type: string
 */
router.get("/list-notes", authMiddleware, getOrderNotes)

export default router;
