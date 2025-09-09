import { Router } from "express";

import {
  addToCart,
  cartCheckOut,
  clearCart,
  getOrCreateCart,
  getUserCart,
  removeCart,
  updateCartItem,
} from "../controllers/cartController";
import { authMiddleware } from "@/middlewares/middleware";
const router = Router();

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *               quantity:
 *                 type: number
 *               ledcolors:
 *                 type: string
 *               bodycolors:
 *                 type: string
 *               watts:
 *                 type: number
 *               reflectors:
 *                 type: number
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Item added to cart successfully
 */
router.post("/add", authMiddleware, addToCart);

/**
 * @swagger
 * /api/cart/fetch:
 *   get:
 *     summary: Get the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Cart fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     cartId:
 *                       type: number
 *                     userId:
 *                       type: number
 *                     totalItems:
 *                       type: number
 *                     totalQuantity:
 *                       type: number
 *                     totalAmount:
 *                       type: number
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           productId:
 *                             type: number
 *                           quantity:
 *                             type: number
 *                           product:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: number
 *                               productName:
 *                                 type: string
 *                               productPrice:
 *                                 type: number
 *                               productDescription:
 *                                 type: string
 *                               image:
 *                                 type: string
 *                           ledcolors:
 *                             type: string
 *                           bodycolors:
 *                             type: string
 *                           watts:
 *                             type: number
 *                           reflector:
 *                             type: string
 *                           itemTotal:
 *                             type: number
 */

router.get("/fetch", authMiddleware, getUserCart);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update fields of an item in the cart
 *     tags: [Cart]
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
 *                 type: number
 *                 description: The ID of the product to update in the cart.
 *               quantity:
 *                 type: number
 *                 description: Quantity of the item. If <= 0, the item will be removed from the cart.
 *               size:
 *                 type: string
 *                 description: Size option for the product.
 *               ledcolors:
 *                 type: string
 *                 description: LED color option for the product.
 *               bodycolors:
 *                 type: string
 *                 description: Body color option for the product.
 *               watts:
 *                 type: number
 *                 description: Wattage of the product.
 *               reflectors:
 *                 type: number
 *                 description: Number of reflectors for the product.
 *               price:
 *                 type: number
 *                 description: Price of the product.
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Cart item updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     cartId:
 *                       type: number
 *                     productId:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                     size:
 *                       type: string
 *                     ledcolors:
 *                       type: string
 *                     bodycolors:
 *                       type: string
 *                     watts:
 *                       type: number
 *                     reflectors:
 *                       type: number
 *                     price:
 *                       type: number
 *       404:
 *         description: Item not found in cart or cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Cart not found or item not found in cart
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/update", authMiddleware, updateCartItem);

/**
 * @swagger
 * /api/cart/remove/{productId}:
 *   put:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the product to remove
 *     responses:
 *       200:
 *         description: Item removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Cart updated successfully
 */
router.put("/remove/:cartItemId", authMiddleware, removeCart);

/**
 * @swagger
 * /api/cart/clear-cart:
 *   put:
 *     summary: Clear the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []


 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Cart updated successfully
 */
router.put("/clear-cart", authMiddleware, clearCart);
/**
 * @swagger
 * /api/cart/checkout:
 *   post:
 *     summary: Checkout selected items from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartItems
 *               - totalAmount
 *             properties:
 *               cartItems:
 *                 type: array
 *                 description: Array of cart item IDs to checkout
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *               totalAmount:
 *                 type: number
 *                 description: Total amount of the selected items
 *                 example: 1999.99
 *     responses:
 *       200:
 *         description: Checkout completed successfully
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
 *                   example: Checkout completed successfully
 *       400:
 *         description: Bad Request - Invalid input or missing data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid total amount
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Internal server error
 */

router.post("/checkout", authMiddleware, cartCheckOut);
export default router;
