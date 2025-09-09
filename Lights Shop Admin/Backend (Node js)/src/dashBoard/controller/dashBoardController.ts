
import { apiResponse } from "@/utils/apiResponse";
import { handleError } from "@/utils/handleError";
import { Request, Response } from "express";
import Order from "@/models/order";
import { Lead } from "@/models/lead";
import OrderStaff from "@/models/orderStaff";
import LeadStaff from "@/models/leadStaff";
import { col, fn, literal, Op } from "sequelize";
import { User } from "@/models";
import { LeadConversion } from "@/models/leadConversion";
import { fetchActiveOrders } from "@/order/controllers/orderController";
import { getActiveLead } from "@/lead/controller/leadController";
import Complaint from "@/models/complaint";
import { complaintStaff } from "@/models/complaintStaff";
import { getActiveComplaint } from "@/complaint/controller/complaintsController";

export const dashboardController = async (req: Request, res: Response) => {
    try {

        const orderActiveData = await Order.findAll({
            where: { approvedStatus: { [Op.in]: ["pending", "approve"] } },
            attributes: ["totalAmount", "orderNumber", "createdAt", "status", "customerName", "expectedDate"],
            order: [["createdAt", "DESC"]],
            limit: 4,
            include: [
                {
                    model: OrderStaff,
                    required: false,
                    include: [
                        {
                            model: User,
                            as: "staff",
                            attributes: ["id", "firstName", "lastName", "role"], // select relevant staff user fields
                        }
                    ]

                },
            ]
        });

        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const todayOrder = await Order.findAll({
            where: {
                expectedDate: { [Op.gte]: start, [Op.lte]: end },
            },
            attributes: ["totalAmount", "orderNumber", "createdAt", "status", "customerName", "expectedDate"],
            order: [["createdAt", "DESC"]],
            limit: 4,
            include: [
                {
                    model: OrderStaff,
                    required: false,
                    include: [
                        {
                            model: User,
                            as: "staff",
                            attributes: ["id", "firstName", "lastName", "role"],
                        },
                    ],
                },
            ],
        });
        const leadActiveData = await Lead.findAll({
            attributes: ["customerName", "followUpDate", "createdAt", "type",],
            order: [["followUpDate", "DESC"]],
            limit: 4,
            include: [
                {
                    model: LeadStaff,
                    required: false,
                    include: [
                        {
                            model: User,
                            attributes: ["id", "firstName", "lastName", "role"], // select relevant staff user fields
                        }
                    ]
                },

            ]
        })

        const todayLead = await Lead.findAll({
            where: {
                followUpDate: { [Op.gte]: start, [Op.lte]: end },
            },
            attributes: ["customerName", "followUpDate", "createdAt", "type",],
            order: [["followUpDate", "DESC"]],
            limit: 4,
            include: [
                {
                    model: LeadStaff,
                    required: false,
                    include: [
                        {
                            model: User,
                            attributes: ["id", "firstName", "lastName", "role"], // select relevant staff user fields
                        }
                    ]
                },

            ]
        })
        const complaintActiveData = await Complaint.findAll({
            attributes: ["orderId", "description", "createdAt", "status", "targetCloseDate"],
            order: [["createdAt", "DESC"]],
            limit: 4,
            include: [
                {
                    model: complaintStaff,
                    required: false,
                    include: [
                        {
                            model: User,
                            attributes: ["id", "firstName", "lastName", "role"], // select relevant staff user fields
                        }
                    ]
                },
                {
                    model: Order,
                    as: "orderdata", // must match association alias
                    attributes: [
                        "orderNumber",
                        "customerName",
                    ]
                }
            ]
        })

        const staffList: any = await User.findAll({
            where: { role: "staff" },
            attributes: [
                "id",
                "firstName",
                "lastName",
                "image",
                "empId",

                // Orders
                [fn("COUNT", col("orderStaffs.orderId")), "ordersAssigned"],
                [fn("SUM", literal(`CASE WHEN "orderStaffs->Order"."status" = 'delivered' THEN 1 ELSE 0 END`)), "ordersDelivered"],

                // Leads
                [fn("COUNT", col("LeadStaffs.leadId")), "leadsAssigned"],
                [fn("SUM", literal(`CASE WHEN "LeadStaffs->LeadsConverted"."id" IS NOT NULL THEN 1 ELSE 0 END`)), "leadsConverted"],

                // Complaints
                [fn("COUNT", col("assignedComplaints.id")), "complaintsAssigned"],
                [fn("SUM", literal(`CASE WHEN "assignedComplaints"."status" = 'resolved' THEN 1 ELSE 0 END`)), "complaintsResolved"]
            ],
            include: [
                {
                    model: OrderStaff,
                    as: "orderStaffs",
                    attributes: [],
                    include: [{ model: Order, attributes: [] }]
                },
                {
                    model: LeadStaff,
                    as: "LeadStaffs",
                    attributes: [],
                    include: [
                        { model: LeadConversion, as: "LeadsConverted", attributes: [], required: false }
                    ]
                },
                {
                    model: Complaint,
                    as: "assignedComplaints", // ✅ many-to-many alias from User
                    attributes: [],
                    through: { attributes: [] } // hide complaintStaff rows
                }
            ],
            group: ["User.id"],
            raw: true
        });

        const leaderboard = staffList.map((staff) => {
            const ordersAssigned = Number(staff.ordersAssigned) || 0;
            const ordersDelivered = Number(staff.ordersDelivered) || 0;
            const leadsAssigned = Number(staff.leadsAssigned) || 0;
            const leadsConverted = Number(staff.leadsConverted) || 0;
            const complaintsAssigned = Number(staff.complaintsAssigned) || 0;
            const complaintsResolved = Number(staff.complaintsResolved) || 0;

            const ordersSuccess = ordersAssigned > 0 ? (ordersDelivered / ordersAssigned) * 100 : 0;
            const leadsSuccess = leadsAssigned > 0 ? (leadsConverted / leadsAssigned) * 100 : 0;
            const complaintsSuccess = complaintsAssigned > 0 ? (complaintsResolved / complaintsAssigned) * 100 : 0;

            const metricsCount = 3; // ✅ now 3 metrics
            const overallPerformance = (ordersSuccess + leadsSuccess + complaintsSuccess) / metricsCount;

            return {
                ...staff,
                ordersSuccess: +ordersSuccess.toFixed(2),
                leadsSuccess: +leadsSuccess.toFixed(2),
                complaintsSuccess: +complaintsSuccess.toFixed(2),
                overallPerformance: +overallPerformance.toFixed(2),
            };
        });

        leaderboard.sort((a, b) => b.overallPerformance - a.overallPerformance);
        leaderboard.forEach((staff, index) => (staff.rank = index + 1));
        const topFourstaff = leaderboard.slice(0, 4);

        return apiResponse(res, 200, "Fetch data successfully", {
            orderActiveData,
            leadActiveData,
            complaintActiveData,
            topFourstaff,
            todayOrder,
            todayLead
        });
    } catch (error: any) {
        await handleError(res, error);
    }

}

export const dashboardListController = async (req: any, res: Response) => {
    try {
        const { listType } = req.query;

        if (listType === "active_order") {
            const result = await fetchActiveOrders(req.query, req.user);
            return apiResponse(res, 200, "Active orders fetched successfully", result);
        } else if (listType === "active_lead") {
            const result = await getActiveLead(req.query, req.user);
            return apiResponse(res, 200, "Active leads fetched successfully", result)
        } else if (listType === "active_staff") {
            const result = await fetchActiveStaffLeaderboard(req.query);
            return apiResponse(res, 200, "Active staff leaderboard fetched successfully", result);
        } else if (listType === "active_complaints") {
            const result = await getActiveComplaint(req.query, req.user);
            return apiResponse(res, 200, "Active complaint fetched successfully", result);
        }
    } catch (error: any) {
        await handleError(res, error);
    }
}

export const fetchActiveStaffLeaderboard = async (params: any) => {
    const {
        page = "1",
        limit = "10",
        search = "",
        sortBy = "overallPerformance",
        order = "DESC"
    } = params;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;
    const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const whereCondition: any = { role: "staff" };
    if (search) {
        whereCondition[Op.or] = [
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
            literal(`"firstName" || ' ' || "lastName" ILIKE '%${search}%'`)
        ];
    }

    const staffList: any = await User.findAll({
        where: whereCondition,
        attributes: [
            "id",
            "firstName",
            "lastName",
            "image",
            "empId",

            // Orders
            [fn("COUNT", col("orderStaffs.orderId")), "ordersAssigned"],
            [fn("SUM", literal(`CASE WHEN "orderStaffs->Order"."status" = 'delivered' THEN 1 ELSE 0 END`)), "ordersDelivered"],

            // Leads
            [fn("COUNT", col("LeadStaffs.leadId")), "leadsAssigned"],
            [fn("SUM", literal(`CASE WHEN "LeadStaffs->LeadsConverted"."id" IS NOT NULL THEN 1 ELSE 0 END`)), "leadsConverted"],

            // Complaints
            [fn("COUNT", col("assignedComplaints.id")), "complaintsAssigned"],
            [fn("SUM", literal(`CASE WHEN "assignedComplaints"."status" = 'resolved' THEN 1 ELSE 0 END`)), "complaintsResolved"]
        ],
        include: [
            {
                model: OrderStaff,
                as: "orderStaffs",
                attributes: [],
                include: [{ model: Order, attributes: [] }]
            },
            {
                model: LeadStaff,
                as: "LeadStaffs",
                attributes: [],
                include: [
                    { model: LeadConversion, as: "LeadsConverted", attributes: [], required: false }
                ]
            },
            {
                model: Complaint,
                as: "assignedComplaints",
                attributes: [],
                through: { attributes: [] }
            }
        ],
        group: ["User.id"],
        raw: true
    });

    // ✅ Now includes complaints in performance calc
    let leaderboard = staffList.map((staff) => {
        const ordersAssigned = Number(staff.ordersAssigned) || 0;
        const ordersDelivered = Number(staff.ordersDelivered) || 0;
        const leadsAssigned = Number(staff.leadsAssigned) || 0;
        const leadsConverted = Number(staff.leadsConverted) || 0;
        const complaintsAssigned = Number(staff.complaintsAssigned) || 0;
        const complaintsResolved = Number(staff.complaintsResolved) || 0;

        const ordersSuccess = ordersAssigned ? (ordersDelivered / ordersAssigned) * 100 : 0;
        const leadsSuccess = leadsAssigned ? (leadsConverted / leadsAssigned) * 100 : 0;
        const complaintsSuccess = complaintsAssigned ? (complaintsResolved / complaintsAssigned) * 100 : 0;

        const metricsCount = 3;
        const overallPerformance = (ordersSuccess + leadsSuccess + complaintsSuccess) / metricsCount;

        return {
            ...staff,
            ordersSuccess: +ordersSuccess.toFixed(2),
            leadsSuccess: +leadsSuccess.toFixed(2),
            complaintsSuccess: +complaintsSuccess.toFixed(2),
            overallPerformance: +overallPerformance.toFixed(2)
        };
    });

    // Rank
    leaderboard.sort((a, b) => b.overallPerformance - a.overallPerformance);
    leaderboard.forEach((staff, idx) => (staff.rank = idx + 1));

    if (sortBy === "rank") {
        leaderboard.sort((a, b) => sortOrder === "DESC" ? b.rank - a.rank : a.rank - b.rank);
    } else {
        leaderboard.sort((a, b) => sortOrder === "DESC"
            ? Number(b[sortBy]) - Number(a[sortBy])
            : Number(a[sortBy]) - Number(b[sortBy])
        );
    }

    const totalCount = leaderboard.length;
    const paginated = leaderboard.slice(offset, offset + pageSize);

    return {
        leaderboard: paginated,
        pagination: {
            totalStaff: totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage: pageNumber,
            pageSize
        }
    };
};
