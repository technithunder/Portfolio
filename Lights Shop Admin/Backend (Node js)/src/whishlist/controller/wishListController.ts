import { Product, User, Wishlist } from "@/models";
import { apiResponse } from "@/utils/apiResponse";
import { ProductMessages, WhishListMessages } from "@/utils/common";
import { handleError } from "@/utils/handleError";
import { Request, Response } from "express";
import { Op } from "sequelize";

export const addToWishList = async (req: any, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.user.dataValues.id;
    const existProdut = await Product.findOne({
      where: { id: productId, isDeleted: false },
    });
    if (!existProdut) {
      return ProductMessages.NOT_FOUND;
    }

    const existWhish = await Wishlist.findOne({
      where: { userId: userId, productId: productId },
    });

    if (existWhish) {
      await existWhish.destroy();
      return apiResponse(res, 200, WhishListMessages.UPDATE_WISH, []);
    }

    const data = await Wishlist.create({
      userId: userId,
      productId: productId,
    });

    return apiResponse(res, 200, WhishListMessages.ADD_WISH, data);
  } catch (error: any) {
    await handleError(res, error);
  }
};

export const removeWish = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.dataValues?.id;
    const existProdut = await Product.findByPk(productId);
    if (!existProdut) {
      return ProductMessages.NOT_FOUND;
    }
    const data = await Wishlist.destroy({
      where: { userId: userId, productId: productId },
    });

    return apiResponse(res, 200, WhishListMessages.UPDATE_WISH, data);
  } catch (error: any) {
    await handleError(res, error);
  }
};

export const whishList = async (req: any, res: Response) => {
  try {
    const userId = req.user?.dataValues?.id || req.params.userId; // use authenticated user or param
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const sortField = sortBy as string;
    const sortOrder = order.toString().toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count, rows } = await Product.findAndCountAll({
      include: [
        {
          model: User,
          as: "wishlistedBy",
          where: { id: userId },
          attributes: [], // exclude user data in product list
          through: { attributes: [] },
          paranoid: false
        },
      ],
      where: search
        ? {
          productName: {
            [Op.iLike]: `%${search}%`,
          },
        }
        : undefined,
      order: [[sortField, sortOrder]],
      limit: parseInt(limit),
      offset,
    });

    const productsWithFlag = rows.map((product: any) => {
      const prod = product.toJSON();
      return { ...prod, isWishlisted: true };
    });

    return apiResponse(res, 200, "Wishlist fetched successfully", {
      data: productsWithFlag,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error: any) {
    await handleError(res, error);
  }
};
