import { Request, Response } from "express";
import StaffSchema, {
  nationalities,
  statuses,
  UpdateStaffSchema,
} from "../schemas/staffSchema";
import Staff from "@/models/staff";
import { apiResponse } from "@/utils/apiResponse";
import {
  NationalitiesMessages,
  StaffMessages,
  StatusMessages,
} from "@/utils/common";
import { handleError } from "@/utils/handleError";
import { Cloudinary } from "@/utils/cloudinary";
import { Op } from "sequelize";
import { formatPersonResponse } from "@/utils/formatPersonResponse";

export const createStaff = async (req: Request, res: Response) => {
  try {
    const validatedData = StaffSchema.parse(req.body);

    if (!req.file || Object.keys(req.file).length === 0) {
      return handleError(res, { message: "Image File is required" });
    }

    const file = req.file as Express.Multer.File;
    const uploadedImages: string[] = [];
    const uploadResult = await Cloudinary.uploadToCloudinary(file, "staffs");
    uploadedImages.push(uploadResult.secure_url);

    const finalData = {
      ...validatedData,
      image: uploadResult.secure_url,
      joiningDate: new Date(validatedData.joiningDate), // Convert string to Date
      dob: new Date(validatedData.dob), // Convert string to Date
    };

    const staff = await Staff.create(finalData);
    await apiResponse(res, 201, StaffMessages.CREATED, staff);
  } catch (error: any) {
    await handleError(res, error);
  }
};

export const getAllStaff = async (req: Request, res: Response) => {
  try {
    // Extract query params with default values
    const {
      page = "1",
      limit = "10",
      search = "",
      sortBy = "firstName",
      order = "ASC",
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;
    const sortOrder =
      (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Build search condition
    const whereCondition = search
      ? {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
        ],
      }
      : {};

    // Fetch staff with filters
    const { rows: staffs, count: totalCount } = await Staff.findAndCountAll({
      where: whereCondition,
      offset,
      limit: pageSize,
      order: [[sortBy as string, sortOrder]],
    });

    if (staffs.length === 0) {
      return apiResponse(res, 404, StaffMessages.NOT_FOUND);
    }

    const formattedStaffs = staffs.map((staff) =>
      formatPersonResponse(staff, true)
    ); // include department

    // Send paginated and formatted response
    return apiResponse(res, 200, StaffMessages.FETCHED, {
      total: totalCount,
      page: pageNumber,
      pageSize,
      staffs: formattedStaffs,
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

export const getStaffById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByPk(id);
    if (!staff) {
      return apiResponse(res, 404, StaffMessages.NOT_FOUND);
    }
    const formattedStaff = formatPersonResponse(staff, true);
    return apiResponse(res, 200, StaffMessages.FETCHED, formattedStaff);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByPk(id);
    if (!staff) {
      return apiResponse(res, 404, StaffMessages.NOT_FOUND);
    }

    const deletedStaff = Staff.destroy({
      where: {
        id: id,
      },
    });

    apiResponse(res, 200, StaffMessages.DELETED, deletedStaff);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const staff = await Staff.findByPk(id);
    if (!staff) {
      return apiResponse(res, 404, StaffMessages.NOT_FOUND);
    }

    const validatedData = UpdateStaffSchema.parse(req.body);

    let finalData: any = {
      ...validatedData,
      joiningDate: validatedData.joiningDate
        ? new Date(validatedData.joiningDate)
        : undefined,
      dob: validatedData.dob ? new Date(validatedData.dob) : undefined,
    };

    const file = req.file as Express.Multer.File | undefined;
    if (file) {
      const uploadResult = await Cloudinary.uploadToCloudinary(file, "staffs");
      finalData.image = uploadResult.secure_url;
    }

    await staff.update(finalData);

    return apiResponse(res, 200, StaffMessages.UPDATED, staff);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const fetchNationalities = async (req: Request, res: Response) => {
  try {
    await apiResponse(res, 200, NationalitiesMessages.FETCHED, nationalities);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const fetchStatus = async (req: Request, res: Response) => {
  try {
    await apiResponse(res, 200, StatusMessages.FETCHED, statuses);
  } catch (error: any) {
    handleError(res, error);
  }
};
