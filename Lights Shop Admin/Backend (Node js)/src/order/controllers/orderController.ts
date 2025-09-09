import { Request, Response } from "express";
import { handleError } from "@/utils/handleError";
import { apiResponse } from "@/utils/apiResponse";
import { OrderMessages } from "@/utils/common";
import Order from "@/models/order";
import { Cloudinary } from "@/utils/cloudinary";
import { col, fn, Op, Transaction, where } from "sequelize";
import OrderItem from "@/models/orderItem";
import Product from "@/models/product";
import { sequelize, User } from "@/models";
import OrderStaff from "@/models/orderStaff";
import { addNotification } from "@/notification/controller/notificationController";
import Review from "@/models/review";
import OrderNote from "@/models/orderNotes";
import Complaint from "@/models/complaint";
import ProductVariant from "@/models/productVariant";

// create order api
// export const createOrder = async (req: any, res: Response) => {
//   const transaction: Transaction = await sequelize.transaction();
//   try {
//     const { orderItems, totalAmount, shippingAddress, isAdmin, totalItems, userId, approvedStatus, expectedDate } = req.body;

//     if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
//       await transaction.rollback();
//       return handleError(res, {
//         message: "No order items provided",
//       });
//     }

//     if (!totalAmount || totalAmount <= 0) {
//       await transaction.rollback();
//       return handleError(res, {
//         message: "Invalid total amount",
//       });
//     }

//     // Verify user exists
//     const user = await User.findByPk(userId, { transaction });
//     if (!user) {
//       await transaction.rollback();
//       throw new Error("User not found");
//     }

//     const discount = user.dataValues?.discount || 0;
//     const validatedOrderItems: any = [];
//     let calculatedTotal = 0;

//     for (const item of orderItems) {
//       if (!item.productId || !item.quantity || !item.unitPrice) {
//         await transaction.rollback();
//         return handleError(res, {
//           message: "Missing required fields in order items (productId, quantity, unitPrice)",
//         });
//       }

//       // Verify product exists
//       const product: any = await Product.findByPk(item.productId, { transaction });
//       if (!product) {
//         await transaction.rollback();
//         throw new Error(`Product with ID ${item.productId} not found`);
//       }

//       validatedOrderItems.push({
//         productId: item.productId,
//         productName: product?.productName || product?.name || product?.title,
//         quantity: item.quantity,
//         unitPrice: Number(item.unitPrice),
//         totalPrice: totalAmount,
//         ledcolors: item.ledcolors || null,
//         bodycolors: item.bodycolors || null,
//         watts: item.watts || null,
//         reflectors: item.reflectors || null,
//       });
//     }

//     const customerName = `${user?.firstName} ${user?.lastName}`;
//     let approveorder = isAdmin === true ? true : false
//     // Create the order
//     const order: any = await Order.create(
//       {
//         userId: userId,
//         customerName: customerName,
//         totalAmount: totalAmount,
//         totalItems: totalItems,
//         shippingAddress: shippingAddress || null,
//         isAdmin: isAdmin || false,
//         status: 'admin_approval',
//         approvedStatus: approvedStatus || 'pending',
//         expectedDate: expectedDate || null
//       },
//       { transaction }
//     );

//     // Create order items
//     const createdOrderItems: any = [];
//     for (const itemData of validatedOrderItems) {
//       const orderItem: any = await OrderItem.create(
//         {
//           orderId: order?.id,
//           ...itemData,
//         },
//         { transaction }
//       );
//       createdOrderItems.push(orderItem);
//     }


//     // --- Send Notification to the Dealer (userId) ---
//     const notificationBody = `Your new order (${order.orderNumber}) has been placed.`;
//     const notificationData = {
//       orderId: String(order.id),
//       userId: String(userId),
//       customerName: customerName,
//       totalAmount: String(totalAmount),
//       totalItems: String(validatedOrderItems.length),
//       status: String(order.status),
//       approvedStatus: String(order.approvedStatus),
//       firstItem: createdOrderItems[0]?.productName ? String(createdOrderItems[0].productName) : '',
//       orderDate: order.createdAt.toISOString(),
//     };

//     await addNotification({
//       userIds: [userId],
//       title: "New Order Placed!",
//       body: notificationBody,
//       data: notificationData,
//       type: "order-placed",
//       mobileRedirect: `/orders/${order.id}`,
//       webRedirectUrl: `/orders/${order.id}`,
//     });
//     await transaction.commit();

//     return apiResponse(res, 201, OrderMessages.CREATED, {
//       success: true,
//       message: OrderMessages.CREATED,
//       order: {
//         id: order.id,
//         orderNumber: order.orderNumber,
//         customerName: order.customerName,
//         totalAmount: order.totalAmount,
//         totalItems: order.totalItems,
//         status: order.status,
//         shippingAddress: order.shippingAddress,
//         orderPayment: order.orderPayment,
//         isAdmin: order.isAdmin,
//         isApproved: order.isApproved,
//         createdAt: order.createdAt,
//         orderItems: createdOrderItems.map(item => ({
//           id: item.id,
//           productId: item.productId,
//           productName: item.productName,
//           quantity: item.quantity,
//           unitPrice: item.unitPrice,
//           totalPrice: item.totalPrice,
//           ledcolors: item.ledcolors,
//           bodycolors: item.bodycolors,
//           watts: item.watts,
//           reflectors: item.reflectors,
//         }))
//       },
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error in createOrder:", error);
//     return handleError(res, error);
//   }
// };

export const createOrder = async (req: any, res: Response) => {
  const transaction: Transaction = await sequelize.transaction();
  try {
    const {
      orderItems,
      totalAmount,
      shippingAddress,
      isAdmin,
      totalItems,
      userId,
      approvedStatus,
      expectedDate,
      expectedMaterial,
    } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      await transaction.rollback();
      return handleError(res, { message: "No order items provided" });
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

    const validatedOrderItems: any[] = [];
    const createdOrderItems: any[] = [];

    // --- Validate and adjust stock for each order item ---
    for (const item of orderItems) {
      if (!item.productId || !item.quantity || !item.unitPrice) {
        await transaction.rollback();
        return handleError(res, {
          message:
            "Missing required fields in order items (productId, quantity, unitPrice)",
        });
      }

      // --- Fetch product with its variants ---
      const product: any = await Product.findByPk(item.productId, {
        include: [{ model: ProductVariant, as: "variants" }],
        transaction,
        lock: { level: transaction.LOCK.UPDATE, of: Product },
      });

      if (!product) {
        await transaction.rollback();
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      // --- Find the matching variant ---
      const variant = product.variants.find((v: any) => {
        return (
          v.ledColor?.name === item.ledcolors?.name &&
          v.bodyColor?.name === item.bodycolors?.name &&
          String(v.watts?.value) === String(item.watts?.value) &&
          v.reflector?.name === item.reflectors?.name
        );
      });

      // if (!variant) {
      //   await transaction.rollback();
      //   throw new Error(`Variant not found for product ${product.productName}`);
      // }

      // --- Check variant stock ---
      if (variant.stock < item.quantity) {
        await transaction.rollback();
        return apiResponse(res, 400, `Insufficient stock for variant of ${product.productName}`);


      }

      // --- Deduct variant stock ---
      await variant.update(
        { stock: variant.stock - item.quantity },
        { transaction }
      );

      // --- Deduct product-level stock ---
      if (product.addedStock < item.quantity) {
        await transaction.rollback();
        return apiResponse(res, 400, `Insufficient overall stock for ${product.productName}`);

      }
      await product.update(
        { addedStock: product.addedStock - item.quantity },
        { transaction }
      );

      // --- Prepare validated order item ---
      validatedOrderItems.push({
        productId: item.productId,
        variantId: variant.id,
        productName:
          product?.productName || product?.name || product?.title,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: item.quantity * Number(item.unitPrice),
        ledcolors: item.ledcolors || null,
        bodycolors: item.bodycolors || null,
        watts: item.watts || null,
        reflectors: item.reflectors || null,
      });
    }

    const customerName = `${user?.firstName} ${user?.lastName}`;

    // --- Create Order ---
    const order: any = await Order.create(
      {
        userId,
        customerName,
        totalAmount,
        totalItems,
        shippingAddress: shippingAddress || null,
        isAdmin: isAdmin || false,
        status: "admin_approval",
        approvedStatus: approvedStatus || "pending",
        expectedMaterial: expectedMaterial || null,
        expectedDate: expectedDate || null,
      },
      { transaction }
    );

    // --- Create Order Items ---
    for (const itemData of validatedOrderItems) {
      const orderItem = await OrderItem.create(
        { orderId: order.id, ...itemData },
        { transaction }
      );
      createdOrderItems.push(orderItem);
    }

    // --- Notify user ---
    const notificationBody = `Your new order (${order.orderNumber}) has been placed.`;
    const notificationData = {
      orderId: String(order.id),
      userId: String(userId),
      customerName,
      totalAmount: String(totalAmount),
      totalItems: String(validatedOrderItems.length),
      status: String(order.status),
      approvedStatus: String(order.approvedStatus),
      firstItem: createdOrderItems[0]?.productName || "",
      orderDate: order.createdAt.toISOString(),
    };

    await addNotification({
      userIds: [userId],
      title: "New Order Placed!",
      body: notificationBody,
      data: notificationData,
      type: "order-placed",
      mobileRedirect: `/orders/${order.id}`,
      webRedirectUrl: `/orders/${order.id}`,
    });

    await transaction.commit();

    return apiResponse(res, 201, OrderMessages.CREATED, {
      success: true,
      message: OrderMessages.CREATED,
      order: {
        ...order.toJSON(),
        orderItems: createdOrderItems,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in createOrder:", error);
    return handleError(res, error);
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      await transaction.rollback();
      return apiResponse(res, 404, OrderMessages.NOT_FOUND);
    }

    // Delete associated OrderItems first
    await OrderItem.destroy({
      where: {
        orderId: id,
      },
      transaction,
    });

    // Delete associated OrderStaffs (if any)
    await OrderStaff.destroy({
      where: {
        orderId: id,
      },
      transaction,
    });

    // Delete the Order
    const deletedOrder = await Order.destroy({
      where: {
        id: id,
      },
      transaction,
    });

    await transaction.commit();

    apiResponse(res, 200, OrderMessages.DELETED, deletedOrder);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  const transaction: Transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { orderItems, totalAmount, shippingAddress, totalItems, userId } = req.body;

    const order: any = await Order.findByPk(id, { transaction });
    if (!order) {
      await transaction.rollback();
      return apiResponse(res, 404, OrderMessages.NOT_FOUND);
    }

    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      throw new Error("User not found");
    }

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      await transaction.rollback();
      return handleError(res, { message: "No order items provided" });
    }

    if (!totalAmount || totalAmount <= 0) {
      await transaction.rollback();
      return handleError(res, { message: "Invalid total amount" });
    }

    const validatedOrderItems: any[] = [];
    let calculatedTotal = 0;

    for (const item of orderItems) {
      if (!item.productId || !item.quantity || !item.unitPrice) {
        await transaction.rollback();
        return handleError(res, {
          message: "Missing required fields in order items (productId, quantity, unitPrice)",
        });
      }

      const product: any = await Product.findByPk(item.productId, { transaction });
      if (!product) {
        await transaction.rollback();
        throw new Error(`Product with ID ${item.productId} not found`);
      }



      validatedOrderItems.push({
        productId: item.productId,
        productName: product?.productName || product?.name || product?.title,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: totalAmount,
        ledcolors: item.ledcolors || null,
        bodycolors: item.bodycolors || null,
        watts: item.watts || null,
        reflectors: item.reflectors || null,
      });
    }

    const discount = user.dataValues?.discount || 0;
    const discountAmount = (totalAmount * discount) / 100;
    const finalTotal = totalAmount - discountAmount;
    const customerName = `${user?.firstName} ${user?.lastName}`;

    // Update order
    await order.update(
      {
        userId,
        customerName,
        totalAmount,
        discountAmount: finalTotal,
        totalItems,
        shippingAddress: shippingAddress || null,
      },
      { transaction }
    );

    // Delete existing order items
    await OrderItem.destroy({ where: { orderId: order.id }, transaction });

    // Create new order items
    const createdOrderItems: any[] = [];
    for (const item of validatedOrderItems) {
      const orderItem = await OrderItem.create(
        {
          orderId: order.id,
          ...item,
        },
        { transaction }
      );
      createdOrderItems.push(orderItem);
    }

    await transaction.commit();

    return apiResponse(res, 200, OrderMessages.UPDATED, {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      discountAmount: order.discountAmount,
      totalItems: order.totalItems,
      status: order.status,
      shippingAddress: order.shippingAddress,
      orderPayment: order.orderPayment,
      createdAt: order.createdAt,
      orderItems: createdOrderItems.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        ledcolors: item.ledcolors,
        bodycolors: item.bodycolors,
        watts: item.watts,
        reflectors: item.reflectors,
      })),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in updateOrder:", error);
    return handleError(res, error);
  }
};

export const getAllOrders = async (req: any, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      sortBy = "createdAt",
      order = "DESC",
      status = "",
      userId = "",
      staffId = "",
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;
    const sortOrder = (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

    const whereCondition: any = {};

    // Clean search condition using include-based filtering
    if (search) {
      whereCondition[Op.or] = [
        { customerName: { [Op.iLike]: `%${search}%` } },
        { orderNumber: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) {
      whereCondition.status = status;
    }

    if (userId) {
      whereCondition.userId = parseInt(userId as string, 10);
    }
    if (req.query?.isAdmin) {
      whereCondition.isAdmin = req.query?.isAdmin
    }

    // Build include array with product name search in OrderItems
    const includeArray: any[] = [
      {
        model: OrderItem,
        as: "orderItems",
        required: false, // Changed to false to avoid filtering issues
        include: [
          {
            model: Product,
            as: "product",
            required: false,
            attributes: ["id", "productName", "productDescription", "image", "productPrice"],
          },
        ],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email"],
        paranoid: false
      },
    ];

    if (staffId) {
      includeArray.push({
        model: User,
        as: "assignedStaff",
        through: { attributes: [] },
        where: { id: parseInt(staffId as string, 10) },
        required: true,
        attributes: ["id", "firstName", "lastName", "email"],
        paranoid: false
      });
    } else {
      includeArray.push({
        model: User,
        as: "assignedStaff",
        through: { attributes: [] },
        required: false,
        attributes: ["id", "firstName", "lastName", "email"],
        paranoid: false
      });
    }

    let orders, totalCount;

    if (search) {
      // For search, use a two-step approach

      // Step 1: Get matching order IDs
      const matchingOrderIds = new Set();

      // Add orders that match customer name or order number
      const directMatches = await Order.findAll({
        where: {
          [Op.or]: [
            { customerName: { [Op.iLike]: `%${search}%` } },
            { orderNumber: { [Op.iLike]: `%${search}%` } }
          ],
          ...(status ? { status } : {}),
          ...(userId ? { userId: parseInt(userId as string, 10) } : {}),
          ...(req.query?.isAdmin ? { isAdmin: req.query.isAdmin } : {}),
        },
        attributes: ['id']
      });

      directMatches.forEach(order => matchingOrderIds.add(order.id));

      // Add orders that have matching product names in order items
      const productMatches = await Order.findAll({
        include: [
          {
            model: OrderItem,
            as: "orderItems",
            where: {
              productName: { [Op.iLike]: `%${search}%` }
            },
            required: true
          },
          ...(staffId ? [{
            model: User,
            as: "assignedStaff",
            through: { attributes: [] },
            where: { id: parseInt(staffId as string, 10) },
            required: true,
            attributes: [],
            paranoid: false
          }] : [])
        ],
        where: {
          ...(status ? { status } : {}),
          ...(userId ? { userId: parseInt(userId as string, 10) } : {}),
          ...(req.query?.isAdmin ? { isAdmin: req.query.isAdmin } : {}),
        },
        attributes: ['id']
      });


      productMatches.forEach(order => matchingOrderIds.add(order.id));

      // Get total count
      totalCount = matchingOrderIds.size;

      // Step 2: Get paginated results
      const orderIdArray = Array.from(matchingOrderIds);
      const paginatedOrderIds = orderIdArray.slice(offset, offset + pageSize);

      orders = await Order.findAll({
        where: {
          id: { [Op.in]: paginatedOrderIds }
        },
        include: includeArray,
        order: [[sortBy as string, sortOrder]],
      });

    } else {
      // Step 1: Get total count and order IDs
      const allOrderIds = await Order.findAll({
        where: whereCondition,
        attributes: ['id'],
        include: includeArray,
        order: [[sortBy as string, sortOrder]],
      });

      totalCount = allOrderIds.length;

      // Step 2: Get paginated order IDs
      const paginatedOrderIds = allOrderIds.slice(offset, offset + pageSize).map(order => order.id);

      // Step 3: Get full order data with includes
      orders = await Order.findAll({
        where: {
          id: { [Op.in]: paginatedOrderIds }
        },

        include: includeArray,
        order: [[sortBy as string, sortOrder]],
      });
    }

    const formattedOrders = orders.map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      totalItems: order.totalItems,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      approvedStatus: order.approvedStatus,
      isAdmin: order.isAdmin,
      expectedDate: order.expectedDate,
      user: order.user
        ? {
          id: order.user.id,
          firstName: order.user.firstName,
          lastName: order.user.lastName,
          email: order.user.email,
        }
        : null,
      assignedStaff: order.assignedStaff
        ? order.assignedStaff.map((staff: any) => ({
          id: staff.id,
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.email,
        }))
        : [],
      orderItems: order.orderItems?.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        ledcolors: item.ledcolors,
        bodycolors: item.bodycolors,
        watts: item.watts,
        reflectors: item.reflectors,
        size: item.size,
        product: item.product
          ? {
            id: item.product.id,
            productName: item.product.productName,
            productDescription: item.product.productDescription,
            image: item.product.image,
            productPrice: item.product.productPrice,
          }
          : null,
      })) || [],
    }));

    // Pagination stats
    const orderStatistics = {
      totalOrders: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: pageNumber,
      pageSize,
    };

    return apiResponse(res, 200, OrderMessages.FETCHED, {
      orders: formattedOrders,
      pagination: orderStatistics,
      summary: {
        totalRevenue: formattedOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        averageOrderValue:
          formattedOrders.length > 0
            ? formattedOrders.reduce((sum, order) => sum + order.totalAmount, 0) /
            formattedOrders.length
            : 0,
        totalItemsSold: formattedOrders.reduce((sum, order) => sum + order.totalItems, 0),
      },
    });
  } catch (error: any) {
    console.error("Error in getAllOrders:", error);
    handleError(res, error);
  }
};

export const getUserOrders = async (req: any, res: Response) => {
  try {
    const userId = req?.user?.dataValues?.id;
    const {
      page = "1",
      limit = "10",
      status = "",
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;
    const sortOrder =
      (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Build where condition
    const whereCondition: any = { userId };
    if (status) {
      whereCondition.status = status;
    }

    // Fetch user's orders with order items
    const { rows: orders, count: totalCount } = await Order.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "productName", "image"],
            },
          ],
        },
      ],
      offset,
      limit: pageSize,
      order: [[sortBy as string, sortOrder]],
      distinct: true,
    });

    // Format the response data (same formatting as getAllOrders)
    const formattedOrders = orders.map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      totalItems: order.totalItems,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems:
        order.orderItems?.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          ledcolors: item.ledcolors,
          bodycolors: item.bodycolors,
          watts: item.watts,
          reflectors: item.reflectors,
          size: item.size,
          product: item.product
            ? {
              id: item.product.id,
              productName: item.product.productName,
              productDescription: item.product.productDescription,
              image: item.product.image,
              productPrice: item.product.productPrice,
            }
            : null,
        })) || [],
    }));

    return apiResponse(res, 200, OrderMessages.FETCHED, {
      orders: formattedOrders,
      pagination: {
        totalOrders: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage: pageNumber,
      },
    });
  } catch (error: any) {
    console.error("Error in getUserOrders:", error);
    handleError(res, error);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.query.userId;
    if (!orderId) {
      return handleError(res, { message: "Order ID is required" });
    }

    // 👇 Build Product include dynamically
    const productInclude: any = {
      model: Product,
      as: "product",
      attributes: ["id", "productName", "image", "averageRating"], // Always fetch averageRating
      include: [],
    };

    if (userId) {
      productInclude.include.push({
        model: Review,
        as: "reviews",
        attributes: ["rating"],
        where: { userId },
        required: false,
      });
    }

    const order: any = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [productInclude],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "mobileNumber"],
          paranoid: false
        },
        {
          model: Complaint,
          as: "complaints",
          attributes: ["id", "targetCloseDate", "description"],
        },
      ],
    });

    if (!order) {
      return apiResponse(res, 404, "Order not found");
    }

    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      discountAmount: order.discountAmount,
      shippingAddress: order.shippingAddress,
      totalItems: order.totalItems,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderPayment: order.orderPayment,
      finalPayment: order.finalPayment,
      isAdmin: order.isAdmin,
      approvedStatus: order.approvedStatus,
      expectedDate: order.expectedDate,
      query: order.query,
      user: order.user
        ? {
          id: order.user.id,
          firstName: order.user.firstName,
          lastName: order.user.lastName,
          email: order.user.email,
          phone: order.user?.mobileNumber,
        }
        : null,
      orderItems:
        order.orderItems?.map((item: any) => {
          const product = item.product || {};
          const userRating =
            product.reviews && product.reviews.length > 0
              ? product.reviews[0].rating
              : null;

          return {
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            ledcolors: item.ledcolors,
            bodycolors: item.bodycolors,
            watts: item.watts,
            reflectors: item.reflectors,
            size: product.size,
            image: product.image,
            rating: userRating || null,
            avgrating: product.averageRating || 0,
          };
        }) || [],
      complaints: order.complaints && order.complaints.length > 0
        ? {
          id: order.complaints[0].id,
          description: order?.complaints[0]?.description,

          targetCloseDate: order?.complaints[0]?.targetCloseDate,

        }
        : null,
    };

    return apiResponse(res, 201, OrderMessages.FETCHED, {
      order: formattedOrder,
    });
  } catch (error: any) {
    console.error("Error in getOrderById:", error);
    handleError(res, error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return handleError(res, { message: "Status is required" });
    }

    const order: any = await Order.findByPk(id);
    if (!order) {
      return apiResponse(res, 404, OrderMessages.NOT_FOUND);
    }
    if (order.status === 'cancelled') {
      return apiResponse(res, 404, OrderMessages.ORDER_CANCLE);
    }
    let updateData = await order.update({ status });
    // --- Send Notification ---
    const notificationBody = `Your order (${order.orderNumber}) status has been updated to '${status}'.`;

    await addNotification({
      userIds: [order.userId], // Notify the user who placed the order
      title: "Order Status Update",
      body: notificationBody,
      data: {
        orderId: String(order.id),
        newStatus: String(status),
        previousStatus: String(order.status),
        customerName: String(order.customerName),
        totalAmount: String(order.totalAmount),
      },
      type: "order-status-update",
      mobileRedirect: `/orders/${order.id}`,
      webRedirectUrl: `/orders/${order.id}`,
    });



    return apiResponse(res, 200, OrderMessages.UPDATED, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      updatedAt: order.updatedAt,
    });
  } catch (error: any) {
    console.error("Error in updateOrderStatus:", error);
    handleError(res, error);
  }
};

export const uploadPaymentImage = async (req: Request, res: Response) => {
  try {
    const { orderId, orderPayment, finalPayment } = req.body;
    const file = req.file as Express.Multer.File | undefined;
    let imageUrl: string | undefined;
    let fieldToUpdate: "orderPayment" | "finalPayment" | undefined;

    const isValidUrl = (str: string) => {
      try {
        new URL(str);
        return true;
      } catch (_) {
        return false;
      }
    };

    // Decide which field to update
    if (finalPayment) {
      fieldToUpdate = "finalPayment";
    } else if (orderPayment) {
      fieldToUpdate = "orderPayment";
    }

    if (!fieldToUpdate) {
      return apiResponse(res, 400, "No payment data provided.");
    }

    if (file) {
      // Handle image file upload
      const uploadResult = await Cloudinary.uploadToCloudinary(
        file,
        "order_payment"
      );
      imageUrl = uploadResult.secure_url;
    } else {
      const input = fieldToUpdate === "finalPayment" ? finalPayment : orderPayment;

      if (typeof input === "string") {
        const isDataUri = input.startsWith("data:image");
        const isBase64 = /^[A-Za-z0-9+/=\r\n]+$/.test(input);
        const isUrl = isValidUrl(input);

        if (isDataUri || isBase64) {
          const base64String = isDataUri ? input : `data:image/jpeg;base64,${input}`;
          const uploadResult = await Cloudinary.uploadToCloudinary(
            base64String,
            "order_payment"
          );
          imageUrl = uploadResult.secure_url;
        } else if (isUrl) {
          // Accept direct URL
          imageUrl = input;
        } else {
          return apiResponse(res, 400, "Invalid image format.");
        }
      }
    }

    if (!imageUrl) {
      return apiResponse(res, 400, "Image upload failed.");
    }

    // Update the correct field
    const [updatedCount] = await Order.update(
      { [fieldToUpdate]: imageUrl },
      { where: { id: orderId } }
    );

    if (updatedCount === 0) {
      return apiResponse(res, 404, "Order not found.");
    }

    return apiResponse(res, 200, OrderMessages.IMAGE_UPLOAD, {
      field: fieldToUpdate,
      url: imageUrl,
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

export const approveOrder = async (req: Request, res: Response) => {
  const transaction: Transaction = await sequelize.transaction();
  try {
    const { approvedStatus } = req.body;
    const orderId = req.params.orderId;

    const order: any = await Order.findByPk(orderId, { transaction });
    if (!order) {
      await transaction.rollback(); // Rollback on error
      return apiResponse(res, 404, "Order not found");
    }

    let updateData: any = {};
    let notificationBody: string;
    let notificationStatus: string;

    if (approvedStatus === "approve") {
      updateData = { approvedStatus: "approve", status: "approved" };
      notificationBody = `Your order (${order.orderNumber}) has been approved!`;
      notificationStatus = "approve";
    } else if (approvedStatus === "reject") {
      updateData = { approvedStatus: "reject", status: "cancelled" };
      notificationBody = `Your order (${order.orderNumber}) has been rejected. It is now cancelled.`;
      notificationStatus = "reject";
    } else {
      await transaction.rollback();
      return apiResponse(res, 400, "Invalid approvedStatus. Must be 'approve' or 'reject'.");
    }

    const [updated] = await Order.update(updateData, {
      where: { id: orderId },
      transaction, // Include transaction here
    });

    if (updated === 0) {
      await transaction.rollback();
      return apiResponse(res, 400, "Order could not be updated or no changes were made.");
    }

    // --- Send Notification ---
    await addNotification({
      userIds: [order.userId],
      title: "Order Approval Status Update",
      body: notificationBody,
      data: {
        orderId: String(order.id),
        approvedStatus: notificationStatus,
        currentStatus: String(order.status),
        totalAmount: String(order.totalAmount),
        customerName: String(order.customerName),
      },
      type: "order-approval-status",
      mobileRedirect: `/orders/${order.id}`,
      webRedirectUrl: `/order/${order.id}`,
    });

    await transaction.commit();

    return apiResponse(res, 200, OrderMessages.UPDATED, {
      orderId: order.id,
      approvedStatus: updateData.approvedStatus,
      status: updateData.status || order.status,
      message: notificationBody
    });

  } catch (error: any) {
    await transaction.rollback(); // Rollback on any error
    handleError(res, error);
  }
};

export const addQuery = async (req: Request, res: Response) => {
  try {
    const { query, orderId } = req.body;

    if (!orderId || !query) {
      apiResponse(res, 400, "Both orderId and query are required.", true)
    }

    const order: any = await Order.findByPk(orderId);
    if (!order) {
      apiResponse(res, 400, OrderMessages.NOT_FOUND, true)
    }

    await Order.update({ query: query }, {
      where: {
        id: orderId
      }
    })

    return apiResponse(res, 200, OrderMessages.ORDER_QUERY, true)
  } catch (error) {
    handleError(res, error);
  }
};

export const addOrderNotes = async (req: Request, res: Response) => {
  try {
    const { orderId, userId, note } = req.body

    const order: any = await Order.findByPk(orderId);

    if (!order) {
      apiResponse(res, 400, OrderMessages.NOT_FOUND, true)
    }

    const orderNotes = await OrderNote.create({
      orderId: orderId, userId: userId, note: note
    })

    return apiResponse(res, 200, "Added Note in the Orderx", orderNotes)

  } catch (error) {
    handleError(res, error);
  }
}

export const fetchActiveOrders = async (params: any, user: any) => {
  const {
    page = "1",
    limit = "10",
    search = "",
    sortBy = "createdAt",
    order = "DESC",
    status = "",
    userId = "",
    expectedDate = ""
  } = params;
  const pageNumber = parseInt(page as string, 10);

  const pageSize = parseInt(limit as string, 10);
  const offset = (pageNumber - 1) * pageSize;
  const sortOrder = (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

  const whereCondition: any = {
    approvedStatus: { [Op.in]: ["pending", "approve"] },
  };

  if (search) {
    whereCondition[Op.or] = [
      { customerName: { [Op.iLike]: `%${search}%` } },
      { orderNumber: { [Op.iLike]: `%${search}%` } }
    ];
  }
  if (status) whereCondition.status = status;
  if (userId) whereCondition.userId = parseInt(userId as string, 10);
  if (expectedDate) {
    whereCondition.expectedDate = {
      [Op.eq]: new Date(expectedDate as string)
    }
  }
  let staffId: any
  if (user.role === 'staff') {
    staffId = user.id
  }
  const includeArray: any[] = [
    {
      model: OrderItem,
      as: "orderItems",
      required: false,
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "productName", "productDescription", "image", "productPrice"],
        },
      ],
    },
    {
      model: User,
      as: "user",
      attributes: ["id", "firstName", "lastName", "email"],
      paranoid: false
    },
    {
      model: User,
      as: "assignedStaff",
      through: { attributes: [] },
      required: !!staffId,
      where: staffId ? { id: parseInt(staffId as string, 10) } : undefined,
      attributes: ["id", "firstName", "lastName", "email"],
      paranoid: false
    }
  ];

  const totalCount = await Order.count({
    where: whereCondition,
    include: staffId ? [{
      model: User,
      as: "assignedStaff",
      through: { attributes: [] },
      where: { id: parseInt(staffId as string, 10) },
      required: true
    }] : [],
  });

  const orders = await Order.findAll({
    where: whereCondition,
    include: includeArray,
    order: [[sortBy as string, sortOrder]],
    limit: pageSize,
    offset,
  });

  const formattedOrders = orders.map((order: any) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    totalAmount: order.totalAmount,
    totalItems: order.totalItems,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    approvedStatus: order.approvedStatus,
    expectedDate: order.expectedDate,
    user: order.user ? {
      id: order.user.id,
      firstName: order.user.firstName,
      lastName: order.user.lastName,
      email: order.user.email,
    } : null,
    assignedStaff: order.assignedStaff
      ? order.assignedStaff.map((staff: any) => ({
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
      }))
      : [],
    orderItems: order.orderItems?.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      product: item.product ? {
        id: item.product.id,
        productName: item.product.productName,
        productDescription: item.product.productDescription,
        image: item.product.image,
        productPrice: item.product.productPrice,
      } : null,
    })) || [],
  }));

  const pagination = {
    totalOrders: totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: pageNumber,
    pageSize,
  };

  return { orders: formattedOrders, pagination };
};

export const getOrderNotes = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      sortBy = "createdAt",
      order = "DESC",
      orderId,
      userId,
      staffId, // If you have staff filtering
      status // If you plan to use it later
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;
    const sortOrder = (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

    const whereCondition: any = {};

    // Search filter (search in customerName, orderNumber, or note text)
    if (search) {
      whereCondition[Op.or] = [
        { note: { [Op.iLike]: `%${search}%` } },
        where(
          fn("concat", col("firstName"), " ", col("lastName")),
          {
            [Op.iLike]: `%${search}%`,
          }
        ),
      ];
    }

    if (orderId) {
      whereCondition.orderId = orderId;
    }

    if (userId) {
      whereCondition.userId = userId;
    }

    // staffId filter (if needed, depends on relation)
    if (staffId) {
      whereCondition["$User.id$"] = staffId;
    }

    const { rows: notes, count } = await OrderNote.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "role"] // get user name
        },
        {
          model: Order,
          attributes: ["id", "orderNumber"] // optional order info
        }
      ],
      order: [[sortBy as string, sortOrder]],
      limit: pageSize,
      offset,
      distinct: true // important when using include to avoid count duplication
    });


    return apiResponse(res, 200, OrderMessages.ORDER_NOTES_FETCH, {
      total: count,
      page: pageNumber,
      pageSize,
      orders: notes,
    });

  } catch (error) {
    handleError(res, error);
  }
};