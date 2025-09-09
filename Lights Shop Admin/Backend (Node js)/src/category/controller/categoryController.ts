import { Category } from "@/models/category";

import { Request, Response } from "express";
import { handleError } from "@/utils/handleError";
import { apiResponse } from "@/utils/apiResponse";
import { CategoryMessages, CaterogyMessages } from "@/utils/common";
import { Op } from "sequelize";
import { Product } from "@/models";

export const createCategory = async (req: any, res: Response) => {
    try {
        const { name } = req.body
        const existCategory = await Category.findOne({ where: { name: name } })

        if (existCategory) {
            return apiResponse(res, 400, CaterogyMessages.CATEGORY_EXIST)
        }
        const addCategory = await Category.create({ name: name })

        return apiResponse(res, 200, CaterogyMessages.CATEGORY_CREATED, addCategory)
    } catch (error) {
        console.error("Error in createCategory:", error);
        return handleError(res, error);
    }
}

export const fetchCategory = async (req: any, res: Response) => {

    try {
        const { id } = req.params
        const fetchCategory = await Category.findByPk(id)
        if (!fetchCategory) {
            return apiResponse(res, 400, CaterogyMessages.CATEGORY_NOT_FOUND)
        }

        return apiResponse(res, 200, CaterogyMessages.CATEGORY_FETCHED, fetchCategory)

    } catch (error) {
        console.error("Error in fetchCategory:", error);
        return handleError(res, error);
    }
}

export const editCategory = async (req: any, res: Response) => {
    try {
        const { id } = req.params
        const { name } = req.body
        const fetchCategory = await Category.findByPk(id)
        if (!fetchCategory) {
            return apiResponse(res, 400, CaterogyMessages.CATEGORY_NOT_FOUND)
        }
        const existCategory = await Category.findOne({ where: { name: name } })

        if (existCategory) {
            return apiResponse(res, 400, CaterogyMessages.CATEGORY_EXIST)
        }
        await Category.update({ name: name }, { where: { id: id } })
        return apiResponse(res, 200, CaterogyMessages.CATEGORY_FETCHED, true)
    } catch (error) {
        console.error("Error in editCategory:", error);
        return handleError(res, error);
    }
}

export const getAllCategory = async (req: Request, res: Response) => {
    try {
        const {
            page = "1",
            limit = "10",
            search = "",
            sortBy = "name",
            order = "ASC",
            type
        } = req.query;

        if (type === 'all') {
            const categories = await Category.findAll()
            return apiResponse(res, 200, CaterogyMessages.CATEGORIES_LIST_FETCHED, categories)
        }

        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * pageSize;
        const sortOrder = (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

        const whereCondition: any = {
            ...(search && {
                name: { [Op.iLike]: `%${search}%` },
            }),
        };

        const { rows: categories, count: totalCount } = await Category.findAndCountAll({
            where: whereCondition,
            offset,
            limit: pageSize,
            order: [[sortBy as string, sortOrder]],
        });

        return apiResponse(res, 200, CaterogyMessages.CATEGORIES_LIST_FETCHED, {
            total: totalCount,
            page: pageNumber,
            pageSize,
            categories,
        });
    } catch (error: any) {
        console.error("Error in getAllCategory:", error);
        return handleError(res, error);
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if any product is associated with this category
        const associatedProduct = await Product.findOne({ where: { categoryId: id } });

        if (associatedProduct) {
            return apiResponse(res, 400, CaterogyMessages.CATEGORY_PRODUCT);
        }

        // Check if category exists
        const category = await Category.findByPk(id);
        if (!category) {
            return apiResponse(res, 400, CaterogyMessages.CATEGORY_NOT_FOUND);
        }

        await Category.destroy({ where: { id: id } });

        return apiResponse(res, 200, CaterogyMessages.CATEGORY_DELETED, true);
    } catch (error) {
        console.error("Error in deleteCategory:", error);
        return handleError(res, error);
    }
};


