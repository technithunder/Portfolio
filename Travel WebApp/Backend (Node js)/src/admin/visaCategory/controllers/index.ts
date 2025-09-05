import { Request, Response } from "express";
import { HTTP_STATUS_CODES, sendResponse } from "@/constants/api-response";
import { strings } from "@/constants/string.constants";
import { VisaCategorySchema } from "../validations/category.request.validation";
import VisaCategory from "../models/Category";

export namespace VisaCategoryController {
    
    // Create a new Visa Category
    export const createCategory = async (req: Request, res: Response) => {
        try {
            // Validate request body
            const { error } = VisaCategorySchema.validate(req.body);
            if (error) {
                return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const { label } = req.body;
            const value = label.toLowerCase().replace(/\s+/g, "-");

            // Create new category
            const category = await VisaCategory.create({ label, value });

            return sendResponse(res, true, category, strings.category_add, null, HTTP_STATUS_CODES.CREATED);
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    // Get All Categories
    export const getCategories = async (_req: Request, res: Response) => {
        try {
            const categories = await VisaCategory.findAll();
            return sendResponse(res, true, categories, strings.categories_fetched, null, HTTP_STATUS_CODES.OK);
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    // Get Category by ID
    export const getCategoryById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.query.id);
            if (!id) {
                return sendResponse(res, false, null, null, "Category ID is required", HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const category = await VisaCategory.findByPk(id);
            if (!category) {
                return sendResponse(res, false, null, null, strings.category_not_found, HTTP_STATUS_CODES.NOT_FOUND);
            }

            return sendResponse(res, true, category, strings.category_fetched, null, HTTP_STATUS_CODES.OK);
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    // Update Category
    export const updateCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.query.id);
            if (!id) {
                return sendResponse(res, false, null, null, "Category ID is required", HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const { error } = VisaCategorySchema.validate(req.body);
            if (error) {
                return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const { label } = req.body;
            const value = label.toLowerCase().replace(/\s+/g, "-");

            const category = await VisaCategory.findByPk(id);
            if (!category) {
                return sendResponse(res, false, null, null, strings.category_not_found, HTTP_STATUS_CODES.NOT_FOUND);
            }

            await category.update({ label, value });

            return sendResponse(res, true, category, strings.category_updated, null, HTTP_STATUS_CODES.OK);
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    // Delete Category (Soft Delete)
    export const deleteCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.query.id);
            if (!id) {
                return sendResponse(res, false, null, null, strings.category_id_required, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const category = await VisaCategory.findByPk(id);
            if (!category) {
                return sendResponse(res, false, null, null, strings.category_not_found, HTTP_STATUS_CODES.NOT_FOUND);
            }

            await category.destroy();

            return sendResponse(res, true, null, strings.category_deleted, null, HTTP_STATUS_CODES.OK);
        } catch (err) {
            return sendResponse(res, false, null, null, err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };
}
