import { Request, Response } from "express";
import { Op } from "sequelize"; // Import Op for Sequelize operators
import { apiResponse } from "@/utils/apiResponse";
import { handleError } from "@/utils/handleError";
import { Cloudinary } from "@/utils/cloudinary";
import Review from "@/models/review";
import { ReviewMessages } from "@/utils/common";
import { Product, User } from "@/models";


export const addReview = async (req: Request, res: Response) => {
    try {
        const { userId, productId, reviewImage, rating, reviewText } = req.body;

        // const existReview = await Review.findOne({ where: { userId, productId } });
        // if (existReview) {
        //     return apiResponse(res, 400, ReviewMessages.REVIEW_EXIST);
        // }

        const file = req.file as Express.Multer.File | undefined;
        let imageUrl: string | undefined;

        if (file) {
            const uploadResult = await Cloudinary.uploadToCloudinary(file, "review_image");
            imageUrl = uploadResult.secure_url;
        } else if (reviewImage && typeof reviewImage === "string") {
            const isDataUri = reviewImage.startsWith("data:image");
            const base64String = isDataUri
                ? reviewImage
                : `data:image/jpeg;base64,${reviewImage}`;
            const uploadResult = await Cloudinary.uploadToCloudinary(base64String, "review_image");
            imageUrl = uploadResult.secure_url;
        }

        // Create the review
        const createdReview = await Review.create({
            userId,
            productId,
            rating,
            reviewText,
            reviewImage: imageUrl,
        });

        // 🔄 Recalculate average rating for the product
        const { count, rows: allReviews } = await Review.findAndCountAll({
            where: { productId },
            attributes: ["rating"],
        });

        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / count;

        // 🆙 Update the product with new averageRating
        await Product.update(
            { averageRating: parseFloat(averageRating.toFixed(1)) },
            { where: { id: productId } }
        );

        return apiResponse(res, 201, ReviewMessages.REVIEW_CREATE, createdReview);
    } catch (error: any) {
        handleError(res, error);
    }
};

export const getReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.id

        const reviewDetail = await Review.findOne({
            where: { id: reviewId }, include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "firstName", "lastName", "email"],
                    paranoid: false
                },
            ],
        });
        if (!reviewDetail) {
            return apiResponse(res, 400, ReviewMessages.REVIEW_NOT_FOUND)
        }
        return apiResponse(res, 400, ReviewMessages.REVIEW_FETCH, reviewDetail)
    } catch (error: any) {
        handleError(res, error);
    }
}

export const reviewList = async (req: Request, res: Response) => {
    try {
        const {
            page = "1",
            limit = "10",
            search = "",
            sortBy = "createdAt", // could be a field from Review or from User
            order = "ASC",
            productId,
        } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * pageSize;
        const sortOrder = (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

        const whereCondition: any = {
            ...(productId && { productId }),
        };

        if (search) {
            whereCondition.reviewText = { [Op.iLike]: `%${search}%` };
        }

        // 🔹 Check if sorting is on user field
        const userSortableFields = ['firstName', 'lastName', 'email'];
        const isUserField = userSortableFields.includes(sortBy as string);

        const { rows: review, count: totalCount } = await Review.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "firstName", "lastName", "email", "image"],
                    paranoid: false
                },
            ],
            offset,
            limit: pageSize,
            order: isUserField
                ? [[{ model: User, as: 'user' }, sortBy as string, sortOrder]]
                : [[sortBy as string, sortOrder]],
        });

        return apiResponse(res, 200, ReviewMessages.REVIEW_FETCH, {
            total: totalCount,
            page: pageNumber,
            pageSize,
            review,
        });
    } catch (error: any) {
        handleError(res, error);
    }
};
