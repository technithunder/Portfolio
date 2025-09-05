import { sendResponse } from "@/constants/api-response";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS_CODES } from '@/constants/api-response';
import logger from '@/utils/logger';
import { getDBErrorMessage } from '@/utils/db.error';
import { Request, Response } from 'express';
import Staff from '@/admin/staff/model/staffModel';
import { strings } from "@/constants/string.constants";
import AdminUser from "@/admin/login/model/AdminUser";

// Login handler for both admin and staff
export namespace StaffController {

export const login = async (req: Request, res: Response) => {
    try {
        const { user_name, password } = req.body;

        const user = await Staff.findOne({ where: { user_name, is_active: true } });
        if (!user) {
            return sendResponse(res, false, null, null, strings.user_not_found, HTTP_STATUS_CODES.NOT_FOUND);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendResponse(res, false, null, null, strings.invalid_credentials, HTTP_STATUS_CODES.UNAUTHORIZED);
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                user_name: user.user_name, 
                role: user.role 
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: Number(process.env.JWT_EXPIRY_TIME) || 3600 }
        );

        // Remove password from response
        const userResponse = {
            id: user.id,
            user_name: user.user_name,
            role: user.role,
            name: user.name,
            phoneNumber: user.phoneNumber
        };

        const response = {
            user: userResponse,
            token
        };
        
        return sendResponse(res, true, response, strings.login_success, null, HTTP_STATUS_CODES.OK);
    } catch (error) {
        logger.error("Error in login:", error);
        return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
};

// Staff management - Create new staff member (Admin only)
export const createStaff = async (req: Request, res: Response) => {
    try {
        const { user_name, password, name, phoneNumber } = req.body;
        
        // Check if username already exists
        const existingUser = await AdminUser.findOne({ where: { user_name } });
        if (existingUser) {
            return sendResponse(res, false, null, null, strings.username_exists, HTTP_STATUS_CODES.CONFLICT);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStaff = await Staff.create({
            user_name,
            password: hashedPassword,
            role:"staff",
            name,
            phoneNumber,
            is_active: true
        });

        const { password: _, ...staffData } = newStaff.get({ plain: true });
        
        return sendResponse(res, true, staffData, strings.staff_created, null, HTTP_STATUS_CODES.CREATED);
    } catch (error) {
        logger.error("Error creating staff:", error);
        return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
};

export const getAllStaff = async (req: Request, res: Response) => {
    try {
        const staffMembers = await AdminUser.findAll({
            where: { role: 'staff' },
            attributes: { exclude: ['password'] }
        });
        
        return sendResponse(res, true, staffMembers, strings.staff_list_fetched, null, HTTP_STATUS_CODES.OK);
    } catch (error) {
        logger.error("Error fetching staff:", error);
        return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
};

export const getStaffById = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        const staff = await AdminUser.findOne({
            where: { id, role: 'staff' },
            attributes: { exclude: ['password'] }
        });
        
        if (!staff) {
            return sendResponse(res, false, null, null, strings.staff_not_found, HTTP_STATUS_CODES.NOT_FOUND);
        }
        
        return sendResponse(res, true, staff, strings.staff_fetched, null, HTTP_STATUS_CODES.OK);
    } catch (error) {
        logger.error("Error fetching staff by ID:", error);
        return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
};

export const updateStaff = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        const { user_name, name, phoneNumber } = req.body;
        
        const staff = await AdminUser.findOne({
            where: { id, role: 'staff' }
        });
        
        if (!staff) {
            return sendResponse(res, false, null, null, strings.staff_not_found, HTTP_STATUS_CODES.NOT_FOUND);
        }
        
        // If username is being changed, check if new username already exists
        if (user_name && user_name !== staff.user_name) {
            const existingUser = await Staff.findOne({ where: { user_name } });
            if (existingUser) {
                return sendResponse(res, false, null, null, strings.username_exists, HTTP_STATUS_CODES.CONFLICT);
            }
        }
        
        // Update user fields
        const updateData: any = {};
        if (user_name) updateData.user_name = user_name;
        if (name) updateData.name = name;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        
        // If password is provided, hash it
        // if (password) {
        //     const salt = await bcrypt.genSalt(10);
        //     updateData.password = await bcrypt.hash(password, salt);
        // }
        
        await staff.update(updateData);
        
        // Fetch updated staff without password
        const updatedStaff = await AdminUser.findByPk(Number(id), {
            attributes: { exclude: ['password'] }
        });
        
        return sendResponse(res, true, updatedStaff, strings.staff_updated, null, HTTP_STATUS_CODES.OK);
    } catch (error) {
        logger.error("Error updating staff:", error);
        return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
};

export const deleteStaff = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        
        const staff = await AdminUser.findOne({
            where: { id, role: 'staff' }
        });
        
        if (!staff) {
            return sendResponse(res, false, null, null, strings.staff_not_found, HTTP_STATUS_CODES.NOT_FOUND);
        }
        
        await staff.destroy();
        return sendResponse(res, true, null, strings.staff_deleted, null, HTTP_STATUS_CODES.OK);
    } catch (error) {
        logger.error("Error deleting staff:", error);
        return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
};
    
}
