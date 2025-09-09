import { Request, Response } from "express";
import { handleError } from "@/utils/handleError";
import { apiResponse } from "@/utils/apiResponse";
import { OrderStaffMessages } from "@/utils/common";
import Order from "@/models/order";
import OrderStaff from "@/models/orderStaff";
import { Op } from "sequelize";
import { User } from "@/models";

export const assignStaffToOrder = async (req: Request, res: Response) => {
  try {
    const { staffIds, orderId } = req.body;
    const order = await Order.findByPk(orderId);
    if (!order) {
      return apiResponse(res, 400, OrderStaffMessages.NOT_FOUND);
    }
    const bulkData = staffIds.map((staffId) => ({
      orderId: Number(orderId),
      staffId,
    }));

    const orderStaffData = await OrderStaff.bulkCreate(bulkData, {
      ignoreDuplicates: true,
    });
    apiResponse(res, 200, OrderStaffMessages.ADD_STAFF, orderStaffData);
  } catch (error: any) {
    await handleError(res, error);
  }
};

export const removeStaffFromOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, staffId } = req.body;

    await OrderStaff.destroy({
      where: {
        orderId,
        staffId,
      },
    });
    apiResponse(res, 200, OrderStaffMessages.REMOVE_STAFF, []);
  } catch (error: any) {
    await handleError(res, error);
  }
};

export const getStaffOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order: any = await Order.findByPk(orderId, {
      include: [
        {
          model: User,
          as: "assignedStaff",
          attributes: ["id", "firstName", "lastName", "email", "role"], // Adjust attributes based on your User model
          through: { attributes: [] }, // Exclude junction table attributes
        },
      ],
    });
    return apiResponse(res, 200, OrderStaffMessages.FETCH_ORDERS_STAFF, {
      data: {
        orderId: order.id,
        assignedStaff: order.assignedStaff,
      },
    });
  } catch (error: any) {
    await handleError(res, error);
  }
};


