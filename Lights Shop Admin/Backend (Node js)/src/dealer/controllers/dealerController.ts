import { Request, Response } from "express";
import { apiResponse } from "@/utils/apiResponse";
import { DealerMessages } from "@/utils/common";
import { handleError } from "@/utils/handleError";
import { Cloudinary } from "@/utils/cloudinary";
import { Op } from 'sequelize';
import DealerSchema, { UpdateDealerSchema } from "../schemas/dealerSchema";
import Dealer from "@/models/dealer";
import { formatPersonResponse } from "@/utils/formatPersonResponse";

export const createDealer = async (req: Request, res: Response) => {
    try {
        
        const validatedData = DealerSchema.parse(req.body);

        if (!req.file || Object.keys(req.file).length === 0) {
            return handleError(res, { message: 'Image File is required' });
        }

        const file = req.file as Express.Multer.File;
        const uploadedImages: string[] = [];
        const uploadResult = await Cloudinary.uploadToCloudinary(file, 'dealers');
        uploadedImages.push(uploadResult.secure_url);

        //generate password for dealer
        const password = `${validatedData.firstName}@vl`;

        const finalData = {
            ...validatedData,
            password,
            image: uploadResult.secure_url,
            joiningDate: new Date(validatedData.joiningDate), // Convert string to Date
            dob: new Date(validatedData.dob), // Convert string to Date
        };
        
        const dealer = await Dealer.create(finalData);
        apiResponse(res, 201, DealerMessages.CREATED, dealer);
    } catch (error: any) {
        handleError(res, error);
    }
};

export const getAllDealer = async (req: Request, res: Response) => {
    try {
        // Extract query params with default values
        const {
            page = '1',
            limit = '10',
            search = '',
            sortBy = 'firstName',
            order = 'ASC',
        } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * pageSize;
        const sortOrder = (order as string).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        // Build search condition
        const whereCondition = search
            ? {
                [Op.or]: [
                    { firstName: { [Op.iLike]: `%${search}%` } },
                    { lastName: { [Op.iLike]: `%${search}%` } },
                ],
            }
            : {};

        // Fetch dealer with filters
        const { rows: dealers, count: totalCount } = await Dealer.findAndCountAll({
            where: whereCondition,
            offset,
            limit: pageSize,
            order: [[sortBy as string, sortOrder]],
        });

        if (dealers.length === 0) {
            return apiResponse(res, 404, DealerMessages.NOT_FOUND);
        }

        const formattedDealers = dealers.map((dealer) => formatPersonResponse(dealer)); // department not included

        // Send paginated and formatted response
        return apiResponse(res, 200, DealerMessages.FETCHED, {
            total: totalCount,
            page: pageNumber,
            pageSize,
            dealers: formattedDealers,
        });
    } catch (error: any) {
        handleError(res, error);
    }
};

export const getDealerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const dealer = await Dealer.findByPk(id);
        if (!dealer) {
            return apiResponse(res, 404, DealerMessages.NOT_FOUND);
        }

        const formattedDealer = formatPersonResponse(dealer);


        // Send paginated and formatted response
        return apiResponse(res, 200, DealerMessages.FETCHED, formattedDealer);
    } catch (error: any) {
        handleError(res, error);
    }
};

export const deleteDealer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const dealer = await Dealer.findByPk(id);
        if (!dealer) {
            return apiResponse(res, 404, DealerMessages.NOT_FOUND);
        }

        const deletedDealer = Dealer.destroy({
            where: {
                id: id,
            }
        });

        apiResponse(res, 200, DealerMessages.DELETED, deletedDealer);

    } catch (error: any) {
        handleError(res, error);
    }

};

export const updateDealer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const dealer = await Dealer.findByPk(id);
        if (!dealer) {
            return apiResponse(res, 404, DealerMessages.NOT_FOUND);
        }

        const validatedData = UpdateDealerSchema.parse(req.body);

        let finalData: any = {
            ...validatedData,
            joiningDate: validatedData.joiningDate ? new Date(validatedData.joiningDate) : undefined,
            dob: validatedData.dob ? new Date(validatedData.dob) : undefined,
        };

        const file = req.file as Express.Multer.File | undefined;
        if (file) {
            const uploadResult = await Cloudinary.uploadToCloudinary(file, 'dealers');
            finalData.image = uploadResult.secure_url;
        }


        await dealer.update(finalData);

        return apiResponse(res, 200, DealerMessages.UPDATED, dealer);
    } catch (error: any) {
        handleError(res, error);
    }

};
