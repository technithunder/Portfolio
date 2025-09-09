import { Order, sequelize, User } from "@/models";
import Complaint from "@/models/complaint";
import { complaintNote } from "@/models/complaintNotes";
import { complaintStaff } from "@/models/complaintStaff";
import { apiResponse } from "@/utils/apiResponse";
import { ComplaintMessage } from "@/utils/common";
import { handleError } from "@/utils/handleError";
import { Request, Response } from "express";
import { col, fn, Op, where } from "sequelize";

export const addComplaint = async (req: Request, res: Response) => {
    try {
        const { orderId, description, userId, targetCloseDate } = req.body
        const existOrder = await Order.findByPk(orderId)
        if (!existOrder) {
            return apiResponse(res, 404, "Order not found");
        }

        const data = await Complaint.create({
            orderId: orderId,
            description: description,
            status: "open",
            priority: "medium",
            targetCloseDate: targetCloseDate ? new Date(targetCloseDate) : null,
            createdById: userId,
        });

        return apiResponse(res, 201, ComplaintMessage.ADD_COMPLAINT, data);

    } catch (error: any) {
        await handleError(res, error);
    }
}

export const fethComplaint = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const complaintData = await Complaint.findByPk(id, {
            include: [
                {
                    model: Order,
                    as: "order",
                    attributes: ["id", "customerName", "orderPayment", "orderNumber"]
                },
                {
                    model: User,
                    as: "creator",
                    attributes: ["id", "firstName", "lastName"]
                },
                {
                    model: User,
                    as: "updater",
                    attributes: ["id", "firstName", "lastName"]
                },
                // {
                //     model: User,
                //     as: "assignedStaff",
                //     through: { attributes: [] },
                //     attributes: ["id", "firstName", "lastName", "email"],
                //     paranoid: false
                // }

            ],
        })

        if (!complaintData) {
            return apiResponse(res, 404, ComplaintMessage.NOT_FOUND);
        }

        return apiResponse(res, 200, ComplaintMessage.FETCHED, complaintData);
    } catch (error: any) {
        await handleError(res, error);
    }
}

export const complaintList = async (req: Request, res: Response) => {
    try {
        const {
            page = "1",
            limit = "10",
            search = "",
            sortBy = "createdAt",
            order = "DESC",
            status,
            priority
        } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * pageSize;
        const sortOrder = (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

        // WHERE condition
        const whereCondition: any = {};

        if (status) {
            whereCondition.status = status;
        }
        if (priority) {
            whereCondition.priority = priority;
        }

        // Search across description and Order ID
        if (search) {
            whereCondition[Op.or] = [
                { description: { [Op.iLike]: `%${search}%` } },
                { "$order.id$": { [Op.eq]: Number(search) || 0 } },
                { "$order.orderNumber$": { [Op.iLike]: `%${search}%` } },
                where(
                    fn("concat", col("firstName"), " ", col("lastName")),
                    {
                        [Op.iLike]: `%${search}%`,
                    }
                ),
            ];
        }

        const { rows, count } = await Complaint.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Order,
                    as: "order",
                    attributes: ["id", "customerName", "orderPayment", "orderNumber"]
                },
                {
                    model: User,
                    as: "creator",
                    attributes: ["id", "firstName", "lastName"]
                },
                {
                    model: User,
                    as: "updater",
                    attributes: ["id", "firstName", "lastName"]
                },

            ],
            order: [[sortBy as string, sortOrder]],
            limit: pageSize,
            offset,
            distinct: true // prevents wrong count when joins create duplicates
        });

        return apiResponse(res, 200, ComplaintMessage.FETCHED, {
            total: count,
            page: pageNumber,
            pageSize,
            rows,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch complaints" });
    }
};

export const deleteComplaint = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params; // complaint ID from URL

        // Find the complaint
        const complaint = await Complaint.findByPk(id, { transaction });
        if (!complaint) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: "Complaint not found" });
        }

        // ====== Optional: Also delete related notes & assignments ======
        // This will also respect paranoid if those models have paranoid: true
        await complaintNote.destroy({ where: { complaintId: id }, transaction });
        await complaintStaff.destroy({ where: { complaintId: id }, transaction });

        // Soft-delete complaint (sets deleted_at)
        await complaint.destroy({ transaction });

        await transaction.commit();
        return apiResponse(res, 200, ComplaintMessage.COMPLAINT_DELETE);


    } catch (error: any) {
        await transaction.rollback();
        await handleError(res, error);
    }
};

export const updateComplaint = async (req: any, res: Response) => {
    try {
        const { status, targetCloseDate } = req.body
        const id = req.params.id
        const complaint = await Complaint.findByPk(id);

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found" });
        }

        await complaint.update({ status, targetCloseDate, updatedById: req?.user?.dataValues?.id })
        return apiResponse(res, 200, ComplaintMessage.COMPLAINT_UPDATED);

    } catch (error: any) {
        await handleError(res, error);
    }
}

export const assignComplaintStaff = async (req: Request, res: Response) => {
    try {
        const { staffIds, complaintId } = req.body;

        const order = await Complaint.findByPk(complaintId);

        if (!order) {
            return apiResponse(res, 400, ComplaintMessage.NOT_FOUND);
        }

        const bulkData = staffIds.map((staffId) => ({
            complaintId: Number(complaintId),
            staffId,
        }));

        const complaintStaffData = await complaintStaff.bulkCreate(bulkData, {
            ignoreDuplicates: true,
        });

        apiResponse(res, 200, ComplaintMessage.ADD_STAFF, complaintStaffData);

    } catch (error: any) {
        await handleError(res, error);
    }
}

export const removeStaffFromComplaint = async (req: Request, res: Response) => {
    try {
        const { complaintId, staffId } = req.body;

        await complaintStaff.destroy({
            where: {
                complaintId,
                staffId,
            },
        });
        apiResponse(res, 200, ComplaintMessage.REMOVE_STAFF, []);
    } catch (error: any) {
        await handleError(res, error);
    }
};

export const getStaffLead = async (req: Request, res: Response) => {
    try {
        const { complaintId } = req.params;
        const complaint: any = await Complaint.findByPk(complaintId, {
            include: [
                {
                    model: User,
                    as: "assignedStaff",
                    attributes: ["id", "firstName", "lastName", "email", "role"], // Adjust attributes based on your User model
                    through: { attributes: [] }, // Exclude junction table attributes
                },
            ],
        });

        return apiResponse(res, 200, ComplaintMessage.FETCH_COMPLAINT_STAFF, {
            data: {
                complaintId: complaint.id,
                assignedStaff: complaint.assignedStaff,
            },
        });

    } catch (error: any) {
        await handleError(res, error);
    }
};

export const addComplaintNote = async (req: Request, res: Response) => {
    try {
        const { complaintId, userId, note } = req.body

        const complaint: any = await Complaint.findByPk(complaintId);

        if (!complaint) {
            apiResponse(res, 200, ComplaintMessage.NOT_FOUND, complaint);
        }

        const complaintNotes = await complaintNote.create({
            complaintId: complaintId, userId: userId, note: note
        })

        return apiResponse(res, 200, "Added Note in the Complaint", complaintNotes)

    } catch (error) {
        handleError(res, error);
    }
}

export const getComplaintNotes = async (req: Request, res: Response) => {
    try {
        const {
            page = "1",
            limit = "10",
            search = "",
            sortBy = "createdAt",
            order = "DESC",
            complaintId,
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

        if (complaintId) {
            whereCondition.complaintId = complaintId;
        }

        if (userId) {
            whereCondition.userId = userId;
        }

        // staffId filter (if needed, depends on relation)
        if (staffId) {
            whereCondition["$User.id$"] = staffId;
        }

        const { rows: notes, count } = await complaintNote.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: User,
                    as: "User",
                    attributes: ["id", "firstName", "lastName", "role"] // get user name
                },
                {
                    model: Complaint,
                    as: "complaint",
                    attributes: ["description", "status"]
                }
            ],
            order: [[sortBy as string, sortOrder]],
            limit: pageSize,
            offset,
            distinct: true // important when using include to avoid count duplication
        });

        return apiResponse(res, 200, ComplaintMessage.COMPLAINT_NOTE_LIST, {
            total: count,
            page: pageNumber,
            pageSize,
            leads: notes,
        });

    } catch (error) {
        handleError(res, error);
    }
};

export const getActiveComplaint = async (params: any, user: any) => {
    const {
        page = "1",
        limit = "10",
        search = "",
        sortBy = "createdAt",
        order = "DESC",
        complaintId,
        userId,
        status, // If you plan to use it later
        priority
    } = params;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;
    const sortOrder = (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";


    // WHERE condition
    const whereCondition: any = {};

    if (status) {
        whereCondition.status = status;
    }
    if (priority) {
        whereCondition.priority = priority;
    }
    let staffId: any
    if (user.role === 'staff') {
        staffId = user.id
    }
    // Search across description and Order ID
    if (search) {
        whereCondition[Op.or] = [
            { description: { [Op.iLike]: `%${search}%` } },
            { "$order.id$": { [Op.eq]: Number(search) || 0 } },
            where(
                fn("concat", col("firstName"), " ", col("lastName")),
                {
                    [Op.iLike]: `%${search}%`,
                }
            ),
        ];
    }

    const { rows, count } = await Complaint.findAndCountAll({
        where: whereCondition,
        include: [
            {
                model: Order,
                as: "order",
                attributes: ["id", "customerName", "orderPayment", "orderNumber"]
            },
            {
                model: User,
                as: "creator",
                attributes: ["id", "firstName", "lastName"]
            },
            {
                model: User,
                as: "updater",
                attributes: ["id", "firstName", "lastName"]
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
        ],
        order: [[sortBy as string, sortOrder]],
        limit: pageSize,
        offset,
        distinct: true // prevents wrong count when joins create duplicates
    });
    return {
        total: count,
        page: pageNumber,
        pageSize,
        leads: rows,
    };

}