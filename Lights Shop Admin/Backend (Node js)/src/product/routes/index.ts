import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllCategories,
  getAllProduct,
  getAllQuantities,
  getProductById,
  getProductWithOutPagination,
  updateProduct,
} from "../controllers/productController";
import { checkAdminLogin } from "@/middlewares/authMiddleware";
import { upload } from "@/middlewares/upload";
import { authMiddleware } from "@/middlewares/middleware";

const router = express.Router();

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new Product
 *     description: Only Admins can create new products. Upload up to 6 base64 images, optional product variants, and attribute discounts.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - categoryId
 *               - productPrice
 *               - addedStock
 *               - expiryDate
 *               - images
 *             properties:
 *               productName:
 *                 type: string
 *                 example: Airbuds
 *               categoryId:
 *                 type: number
 *                 example: 8
 *               productPrice:
 *                 type: number
 *                 example: 780
 *               discount:
 *                 type: number
 *                 description: Discount percentage (0–100)
 *                 example: 10
 *               discountPrice:
 *                 type: number
 *                 description: Final price after discount
 *                 example: 702
 *               productDescription:
 *                 type: string
 *                 example: Wireless Bluetooth Airbuds
 *               addedStock:
 *                 type: number
 *                 example: 100
 *               openingStock:
 *                 type: integer
 *                 example: 100
 *               remainingStock:
 *                 type: integer
 *                 example: 100
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-06-30
 *               images:
 *                 type: array
 *                 description: Array of base64 encoded images. Max 6 allowed.
 *                 items:
 *                   type: string
 *                   example: data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
 *               variants:
 *                 type: array
 *                 description: Array of product variants with optional attributes
 *                 items:
 *                   type: object
 *                   properties:
 *                     ledColor:
 *                       type: string
 *                       example: Red
 *                     bodyColor:
 *                       type: string
 *                       example: Blue
 *                     watts:
 *                       type: number
 *                       example: 10
 *                     reflector:
 *                       type: number
 *                       example: 40
 *                     stock:
 *                       type: number
 *                       example: 50
 *               attributeDiscounts:
 *                 type: object
 *                 description: Discounts applied per attribute
 *                 properties:
 *                   ledColor:
 *                     type: number
 *                     example: 10
 *                   bodyColor:
 *                     type: number
 *                     example: 7
 *                   watts:
 *                     type: number
 *                     example: 5
 *                   reflector:
 *                     type: number
 *                     example: 2
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Product Created Successfully
 *               data:
 *                 id: 2
 *                 productName: Airbuds
 *                 categoryId: 8
 *                 productPrice: 780
 *                 discount: 10
 *                 discountPrice: 702
 *                 productDescription: Wireless Bluetooth Airbuds
 *                 addedStock: 100
 *                 openingStock: 100
 *                 remainingStock: 100
 *                 expiryDate: 2025-06-30T00:00:00.000Z
 *                 image:
 *                   - https://res.cloudinary.com/demo/image/upload/v1/products/airbuds1.jpg
 *                   - https://res.cloudinary.com/demo/image/upload/v1/products/airbuds2.jpg
 *                 variants:
 *                   - ledColor: red
 *                     stock: 20
 *                   - bodyColor: blue
 *                     stock: 50
 *                 attributeDiscounts:
 *                   ledColor: 10
 *                   bodyColor: 7
 *                   watts: 5
 *                   reflector: 2
 *                 createdAt: 2025-05-23T12:00:00.000Z
 *                 updatedAt: 2025-05-23T12:00:00.000Z
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Unauthorized - Admin login required
 *       500:
 *         description: Internal Server Error
 */
router.post("/add", checkAdminLogin, upload.array("image"), createProduct);

/**
 * @swagger
 * /api/product/getAllProducts:
 *   get:
 *     summary: Get all Products or search products with pagination
 *     tags: [Products]
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
 *         name: categoryId
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
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       productName:
 *                         type: string
 *                       productCategory:
 *                         type: string
 *                       productDescription:
 *                         type: string
 *                       discount:
 *                         type: number
 *                       discountPrice:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized - Admin login required
 */
router.get("/getAllProducts", authMiddleware, getAllProduct);

/**
 * @swagger
 * /api/product/product-list:
 *   get:
 *     summary: Get all Products without pagination
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: A list of products without pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   productName:
 *                     type: string
 *                   categoryId:
 *                     type: integer
 *                   productPrice:
 *                     type: number
 *                   discount:
 *                     type: number
 *                   discountPrice:
 *                     type: number
 *                   productDescription:
 *                     type: string
 *                   addedStock:
 *                     type: integer
 *                   openingStock:
 *                     type: integer
 *                   remainingStock:
 *                     type: integer
 *                   expiryDate:
 *                     type: string
 *                     format: date-time
 */
router.get("/product-list", authMiddleware, getProductWithOutPagination);
/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to fetch
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Product Fetched Successfully
 *               data:
 *                 id: 2
 *                 productName: airbuds
 *                 categoryId: 8
 *                 productPrice: 780
 *                 discount: 10
 *                 discountPrice: 702
 *                 productDescription: "Wireless Bluetooth Airbuds"
 *                 addedStock: 100
 *                 openingStock: 100
 *                 remainingStock: 100
 *                 expiryDate: "2025-06-30T00:00:00.000Z"
 *                 images:
 *                   - "https://res.cloudinary.com/demo/image/upload/v1/products/airbuds1.jpg"
 *                   - "https://res.cloudinary.com/demo/image/upload/v1/products/airbuds2.jpg"
 *                 createdAt: "2025-05-23T12:00:00.000Z"
 *                 updatedAt: "2025-05-23T12:00:00.000Z"
 *       400:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - Admin login required
 *       500:
 *         description: Internal Server Error
 */

router.get("/:id", authMiddleware, getProductById);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update an existing Product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               categoryId:
 *                 type: number
 *               quantityId:
 *                 type: number
 *               buyingPrice:
 *                 type: number
 *               unit:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               thresholdValue:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Product Updated Successfully
 *               data:
 *                 id: 2
 *                 productName: airbuds
 *                 categoryId: 8
 *                 quantityId: 112
 *                 buyingPrice: 800
 *                 unit: "25"
 *                 expiryDate: "2025-06-01T00:00:00.000Z"
 *                 thresholdValue: 300
 *                 image: "https://res.cloudinary.com/dvb75ed4h/image/upload/v1747132136/products/updated.jpg"
 *                 updatedAt: "2025-05-19T08:00:00.000Z"
 *                 createdAt: "2025-05-13T10:28:56.685Z"
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Unauthorized - Admin login required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", authMiddleware, upload.array("image"), updateProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Product Deleted Successfully
 *       401:
 *         description: Unauthorized - Admin login required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", checkAdminLogin, deleteProduct);

/**
 * @swagger
 * /api/product/init/fetchCategory:
 *   get:
 *     summary: Fetch all Categories
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       401:
 *         description: Unauthorized - Admin login required
 */
router.get("/init/fetchCategory", checkAdminLogin, getAllCategories);

/**
 * @swagger
 * /api/product/init/fetchQuantity:
 *   get:
 *     summary: Fetch all Quantities
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of quantities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   unit:
 *                     type: string
 *       401:
 *         description: Unauthorized - Admin login required
 */
router.get("/init/fetchQuantity", checkAdminLogin, getAllQuantities);

export default router;
