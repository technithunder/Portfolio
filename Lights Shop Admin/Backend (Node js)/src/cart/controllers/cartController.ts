import { Request, Response } from "express";
import { handleError } from "@/utils/handleError";
import { apiResponse } from "@/utils/apiResponse";
import { CartMessage, OrderMessages, ProductMessages } from "@/utils/common";
import Order from "@/models/order";
import { Cloudinary } from "@/utils/cloudinary";
import { Op, Transaction } from "sequelize";
import { Cart } from "@/models/cart";
import { CartItem } from "@/models/cartItem";
import Product from "@/models/product";
import { sequelize } from "@/config/db.config";
import { User } from "@/models";
import OrderItem from "@/models/orderItem";
import { addNotification } from "@/notification/controller/notificationController";
import ProductVariant from "@/models/productVariant";

export const parseDateFromDDMMYYYY = (dateStr: string): Date | null => {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(dateStr);
  if (!match) return null;

  const [, day, month, year] = match;
  const iso = `${year}-${month}-${day}T00:00:00Z`;
  const parsed = new Date(iso);

  return isNaN(parsed.getTime()) ? null : parsed;
};

export const getOrCreateCart = async (userId: any) => {
  const [cart] = await Cart.findOrCreate({
    where: { userId },
    defaults: { userId },
  });
  return cart;
};

export const addToCart = async (req: any, res: Response) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      productId,
      quantity = 1,
      ledColor,     // now JSON
      bodyColor,    // now JSON
      watts,        // now JSON
      reflector,   // now JSON
      price,
    } = req.body;

    const userId = req?.user?.dataValues?.id;

    // Fetch product and cart in parallel
    const [product, cart] = await Promise.all([
      Product.findOne({
        where: { id: productId, isDeleted: false },
        transaction,
      }),
      getOrCreateCart(userId),
    ]);

    if (!product) {
      await transaction.rollback();
      return handleError(res, ProductMessages.NOT_FOUND);
    }

    if (!cart) {
      await transaction.rollback();
      return handleError(res, { message: "Failed to create or retrieve cart" });
    }

    // Build the where condition
    const whereCondition: any = {
      cartId: cart.id,
      productId,
      bodycolor: bodyColor || null,
      ledcolor: ledColor || null,
      watts: watts || null,
      reflectors: reflector || null,
    };

    // Find existing cart item (exact JSON match)
    const existingItem = await CartItem.findOne({
      where: whereCondition,
      transaction,
    });

    if (existingItem) {
      // Update quantity and price
      existingItem.quantity += quantity;
      if (price !== undefined) existingItem.price = price;
      await existingItem.save({ transaction });
    } else {
      // Create new cart item
      await CartItem.create(
        {
          cartId: cart.id,
          productId,
          quantity,
          bodycolor: bodyColor || null,
          ledcolor: ledColor || null,
          watts: watts || null,
          reflectors: reflector || null,
          price: price,
        },
        { transaction }
      );
    }

    await transaction.commit();

    return apiResponse(res, 200, CartMessage.ADD_TO_CART);
  } catch (error) {
    await transaction.rollback();
    console.error("Error in addToCart:", error);
    return handleError(res, error);
  }
};

export const getUserCart = async (req: any, res: Response) => {
  try {
    const userId = req?.user?.dataValues?.id;
    const cart: any = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
      order: [[{ model: CartItem, as: "items" }, "createdAt", "DESC"]], // Moved order to top level
      raw: false,
    });

    if (!cart) {
      return null;
    }

    const items: any =
      cart.items?.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product.id,
          productName: item.product!.productName,
          productPrice: Number(item.product?.productPrice),
          productDescription: item.product?.productDescription,
          image: item.product?.image,
        },
        ledcolors: item.ledcolor,
        bodycolors: item.bodycolor,
        watts: item.watts,
        reflectors: item.reflectors,
        itemTotal: item.quantity * Number(item.price),
      })) || [];

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.itemTotal, 0);

    return apiResponse(res, 200, CartMessage.FETCH_CART, {
      cartId: cart.id,
      userId: cart.userId,
      totalItems: items.length,
      totalQuantity,
      totalAmount,
      items,
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    return handleError(res, error);
  }
};

export const updateCartItem = async (req: any, res: Response) => {
  try {
    const userId = req?.user?.dataValues?.id;
    const { cartItemId } = req.body;
    const { quantity, size, ledcolors, bodycolors, watts, reflectors, price } =
      req.body;

    // Validate cartItemId
    if (!cartItemId) {
      return handleError(res, { message: "Cart Item ID is required" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return handleError(res, { message: "Cart not found" });
    }

    // Find the specific cart item by cartItemId and ensure it belongs to user's cart
    const cartItem: any = await CartItem.findOne({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      return handleError(res, { message: "Item not found in cart" });
    }

    // If quantity is provided and <= 0, remove the item from cart
    if (quantity !== undefined && quantity <= 0) {
      await cartItem.destroy();

      // Return updated cart after item removal
      const updatedCart: any = await Cart.findOne({
        where: { userId },
        include: [
          {
            model: CartItem,
            as: "items",
            include: [
              {
                model: Product,
                as: "product",
              },
            ],
            order: [["id", "ASC"]], // Order by ID to maintain insertion order
          },
        ],
        raw: false,
      });

      if (!updatedCart) {
        return apiResponse(res, 200, CartMessage.UPDATE_CART, {
          cartId: cart.id,
          userId: cart.userId,
          totalItems: 0,
          totalQuantity: 0,
          totalAmount: 0,
          items: [],
        });
      }

      // No need for manual sorting as we're ordering at database level
      const sortedItems = updatedCart.items || [];

      const items: any = sortedItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product.id,
          productName: item.product!.productName,
          productPrice: Number(item.product?.productPrice),
          productDescription: item.product?.productDescription,
          image: item.product?.image,
        },
        ledcolors: item.ledcolors,
        bodycolors: item.bodycolors,
        watts: item.watts,
        reflectors: item.reflectors,
        itemTotal: item.quantity * Number(item.price),
      }));

      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + item.itemTotal, 0);

      return apiResponse(res, 200, CartMessage.UPDATE_CART, {
        cartId: updatedCart.id,
        userId: updatedCart.userId,
        totalItems: items.length,
        totalQuantity,
        totalAmount,
        items,
      });
    }

    // Update cart item data
    const updateData: any = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (size !== undefined) updateData.size = size;
    if (ledcolors !== undefined) updateData.ledcolors = ledcolors;
    if (bodycolors !== undefined) updateData.bodycolors = bodycolors;
    if (watts !== undefined) updateData.watts = watts;
    if (reflectors !== undefined) updateData.reflectors = reflectors;
    if (price !== undefined) updateData.price = price;

    // This will automatically update the updatedAt timestamp
    await CartItem.update(updateData, {
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    // Get the complete updated cart with all items
    const updatedCart: any = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
          order: [["id", "ASC"]], // Order by ID to maintain insertion order
        },
      ],
      raw: false,
    });

    if (!updatedCart) {
      return handleError(res, { message: "Cart not found after update" });
    }

    // No need for manual sorting as we're ordering at database level
    const sortedItems = updatedCart.items || [];

    const items: any = sortedItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      product: {
        id: item.product.id,
        productName: item.product!.productName,
        productPrice: Number(item.product?.productPrice),
        productDescription: item.product?.productDescription,
        image: item.product?.image,
      },
      ledcolors: item.ledcolors,
      bodycolors: item.bodycolors,
      watts: item.watts,
      reflectors: item.reflectors,
      itemTotal: item.quantity * Number(item.price),
    }));

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.itemTotal, 0);

    return apiResponse(res, 200, CartMessage.UPDATE_CART, {
      cartId: updatedCart.id,
      userId: updatedCart.userId,
      totalItems: items.length,
      totalQuantity,
      totalAmount,
      items,
    });
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    return handleError(res, error);
  }
};

export const removeCart = async (req: any, res: Response) => {
  try {
    const userId = req?.user?.dataValues?.id;
    const { cartItemId } = req.params;

    // Validate cartItemId
    if (!cartItemId) {
      return handleError(res, { message: "Cart Item ID is required" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return handleError(res, { message: "Cart not found" });
    }

    // Check if the cart item exists and belongs to the user's cart
    const cartItem = await CartItem.findOne({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      return handleError(res, { message: "Cart item not found" });
    }

    // Remove the cart item
    await CartItem.destroy({
      where: {
        cartId: cart.id,
        id: cartItemId,
      },
    });
    return apiResponse(res, 200, CartMessage.UPDATE_CART);
  } catch (error) {
    console.error("Error in removeCart:", error);
    return handleError(res, error);
  }
};

export const clearCart = async (req: any, res: Response) => {
  try {
    const userId = req?.user?.dataValues?.id;
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return false;
    }

    await CartItem.destroy({
      where: { cartId: cart.id },
    });

    return apiResponse(res, 200, CartMessage.UPDATE_CART);
  } catch (error) {
    console.error("Error in clearCart:", error);
    return handleError(res, error);
  }
};

// export const cartCheckOut = async (req: any, res: Response) => {
//   const transaction: Transaction = await sequelize.transaction();
//   try {
//     const userId = req?.user?.dataValues?.id;
//     const { cartItems, totalAmount, shippingAddress, expectedDate } = req.body; // cartItems array and totalAmount from frontend
//     // Validate input
//     if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
//       await transaction.rollback();
//       return handleError(res, {
//         message: "No cart items selected for checkout",
//       });
//     }

//     if (!totalAmount || totalAmount <= 0) {
//       await transaction.rollback();
//       return handleError(res, {
//         message: "Invalid total amount",
//       });
//     }
//     const user = await User.findByPk(userId, { transaction });
//     if (!user) {
//       await transaction.rollback();
//       throw new Error("User not found");
//     }
//     const discount = user.dataValues?.discount || 0;
//     // Get user's cart
//     const cart: any = await Cart.findOne({
//       where: { userId },
//       transaction,
//     });
//     if (!cart) {
//       await transaction.rollback();
//       throw new Error("Cart not found");
//     }

//     // Get selected cart items with their products
//     const selectedCartItems: any = await CartItem.findAll({
//       where: {
//         cartId: cart.id,
//         id: cartItems, // Only get items with IDs in the cartItems array
//       },
//       include: [
//         {
//           model: Product,
//           as: "product",
//         },
//       ],
//       transaction,
//     });
//     if (!selectedCartItems || selectedCartItems.length === 0) {
//       await transaction.rollback();
//       throw new Error("Selected cart items not found");
//     }

//     // Validate that all requested items were found
//     if (selectedCartItems.length !== cartItems.length) {
//       await transaction.rollback();
//       throw new Error("Some selected cart items were not found");
//     }
//     const discountAmount = (totalAmount * discount) / 100;
//     const finalTotal = totalAmount - discountAmount;
//     const customerName = `${user?.firstName} ${user?.lastName}`;
//     // Create a single order

//     const parsedExpectedDate = expectedDate
//       ? parseDateFromDDMMYYYY(expectedDate)
//       : null;

//     if (expectedDate && !parsedExpectedDate) {
//       await transaction.rollback();
//       return handleError(res, {
//         message: "Invalid expected delivery date format. Use DD-MM-YYYY.",
//       });
//     }
//     const order: any = await Order.create(
//       {
//         userId: userId,
//         customerName: customerName,
//         totalAmount: totalAmount, // Total amount from frontend
//         totalItems: selectedCartItems.length,
//         // status: "pending",
//         shippingAddress: shippingAddress || null, // Optional shipping address
//         approvedStatus: 'pending',
//         expectedDate: parsedExpectedDate || null
//       },
//       { transaction }
//     );
//     // Create order items for each cart item
//     const orderItems: any = [];
//     for (const cartItem of selectedCartItems) {
//       const product = cartItem.product!;
//       const itemTotal = cartItem.quantity * Number(cartItem.price);

//       const orderItem: any = await OrderItem.create(
//         {
//           orderId: order?.id,
//           productId: product?.id,
//           productName: product?.productName,
//           quantity: cartItem?.quantity,
//           unitPrice: Number(cartItem?.price),
//           totalPrice: itemTotal,
//           ledcolors: cartItem?.ledcolors,
//           bodycolors: cartItem?.bodycolors,
//           watts: cartItem?.watts,
//           reflectors: cartItem?.reflectors,
//         },
//         { transaction }
//       );
//       orderItems.push(orderItem);
//     }

//     // Remove only the selected cart items after successful checkout
//     await CartItem.destroy({
//       where: {
//         cartId: cart.id,
//         id: cartItems,
//       },
//       transaction,
//     });
//     const admin = await User.findOne({ where: { role: 'admin' } })
//     const notificationData = {
//       orderId: String(order.id), // Convert number to string
//       userId: String(userId),     // Convert number to string
//       customerName: customerName,
//     };
//     const notificationBody = `A new order  has been placed by ${customerName}.`;
//     await addNotification({
//       userIds: [admin.id],
//       title: "New Order Placed!",
//       body: notificationBody,
//       data: notificationData, // Pass the structured data
//       type: "Order-created",
//       mobileRedirect: `/orders/${order.id}`, // Specific order detail page
//       webRedirectUrl: `/orders/${order.id}`,
//     });



//     await transaction.commit();

//     return apiResponse(res, 200, OrderMessages.CREATED, {
//       success: true,
//       message: "Checkout completed successfully",

//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error in cartCheckOut:", error);
//     return handleError(res, error);
//   }
// };


export const cartCheckOut = async (req: any, res: Response) => {
  const transaction: Transaction = await sequelize.transaction();
  try {
    const userId = req?.user?.dataValues?.id;
    const { cartItems, totalAmount, shippingAddress, expectedMaterial } = req.body;

    // --- Basic validations ---
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      await transaction.rollback();
      return handleError(res, { message: "No cart items selected for checkout" });
    }

    if (!totalAmount || totalAmount <= 0) {
      await transaction.rollback();
      return handleError(res, { message: "Invalid total amount" });
    }

    // --- Verify user ---
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      throw new Error("User not found");
    }

    const discount = user.dataValues?.discount || 0;

    // --- Get user's cart ---
    const cart: any = await Cart.findOne({ where: { userId }, transaction });
    if (!cart) {
      await transaction.rollback();
      throw new Error("Cart not found");
    }

    // --- Get selected cart items ---
    const selectedCartItems: any = await CartItem.findAll({
      where: { cartId: cart.id, id: cartItems },
      include: [{ model: Product, as: "product", include: [{ model: ProductVariant, as: "variants" }] }],
      transaction,
    });

    if (!selectedCartItems || selectedCartItems.length === 0) {
      await transaction.rollback();
      throw new Error("Selected cart items not found");
    }

    if (selectedCartItems.length !== cartItems.length) {
      await transaction.rollback();
      throw new Error("Some selected cart items were not found");
    }

    // --- Discount + totals ---
    const discountAmount = (totalAmount * discount) / 100;
    const finalTotal = totalAmount - discountAmount;
    const customerName = `${user?.firstName} ${user?.lastName}`;

    // --- Parse expected date ---
    const parsedExpectedDate = expectedMaterial ? parseDateFromDDMMYYYY(expectedMaterial) : null;
    if (expectedMaterial && !parsedExpectedDate) {
      await transaction.rollback();
      return handleError(res, {
        message: "Invalid expected delivery date format. Use DD-MM-YYYY.",
      });
    }

    // --- Validate stock and adjust ---
    const validatedOrderItems: any[] = [];
    for (const cartItem of selectedCartItems) {
      const product = cartItem.product;

      if (!product) {
        await transaction.rollback();
        throw new Error(`Product not found for cart item ${cartItem.id}`);
      }

      // --- Find matching variant ---
      const variant = product.variants.find((v: any) => {
        return (
          v.ledColor?.name === cartItem.ledcolor?.name &&
          v.bodyColor?.name === cartItem.bodycolor?.name &&
          String(v.watts?.value) === String(cartItem.watts) &&
          v.reflector?.name === cartItem.reflectors?.name
        );
      });

      // if (!variant) {
      //   await transaction.rollback();
      //   throw new Error(`Variant not found for product ${product.productName}`);
      // }

      // --- Check variant stock ---
      if (variant.stock < cartItem.quantity) {
        await transaction.rollback();
        apiResponse(res, 400, `Insufficient stock for variant of ${product.productName}`);

      }

      if (variant) {
        // Deduct variant stock
        await variant.update(
          { stock: variant.stock - cartItem.quantity },
          { transaction }
        );
      }
      // Deduct product stock
      if (product.addedStock < cartItem.quantity) {
        await transaction.rollback();
        apiResponse(res, 400, `Insufficient overall stock for ${product.productName}`);

      }
      await product.update(
        { addedStock: product.addedStock - cartItem.quantity },
        { transaction }
      );

      // --- Prepare order item ---
      const itemTotal = cartItem.quantity * Number(cartItem.price);
      validatedOrderItems.push({
        productId: product.id,
        variantId: variant.id,
        productName: product.productName,
        quantity: cartItem.quantity,
        unitPrice: Number(cartItem.price),
        totalPrice: itemTotal,
        ledcolors: cartItem.ledcolor || null,
        bodycolors: cartItem.bodycolor || null,
        watts: cartItem.watts || null,
        reflectors: cartItem.reflectors || null,
      });
    }

    // --- Create order ---
    const order: any = await Order.create(
      {
        userId,
        customerName,
        totalAmount: finalTotal,
        totalItems: validatedOrderItems.length,
        shippingAddress: shippingAddress || null,
        approvedStatus: "pending",
        expectedMaterial: parsedExpectedDate || null,
      },
      { transaction }
    );

    // --- Create order items ---
    const createdOrderItems: any[] = [];
    for (const itemData of validatedOrderItems) {
      const orderItem = await OrderItem.create(
        { orderId: order.id, ...itemData },
        { transaction }
      );
      createdOrderItems.push(orderItem);
    }

    // --- Remove only the selected cart items ---
    await CartItem.destroy({
      where: { cartId: cart.id, id: cartItems },
      transaction,
    });

    // --- Notify admin ---
    const admin = await User.findOne({ where: { role: "admin" }, transaction });
    if (admin) {
      await addNotification({
        userIds: [admin.id],
        title: "New Order Placed!",
        body: `A new order has been placed by ${customerName}.`,
        data: { orderId: String(order.id), userId: String(userId), customerName },
        type: "order-created",
        mobileRedirect: `/orders/${order.id}`,
        webRedirectUrl: `/orders/${order.id}`,
      });
    }

    await transaction.commit();

    return apiResponse(res, 200, OrderMessages.CREATED, {
      success: true,
      message: "Checkout completed successfully",
      order: {
        ...order.toJSON(),
        orderItems: createdOrderItems,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in cartCheckOut:", error);
    return handleError(res, error);
  }
};
