import { User } from "@/models";
import { Lead } from "@/models/lead";
import LeadStaff from "@/models/leadStaff";
import { apiResponse } from "@/utils/apiResponse";
import { leadStaffMessage } from "@/utils/common";
import { handleError } from "@/utils/handleError";
import { Request, Response } from "express";

export const assignStaffToLead = async (req: Request, res: Response) => {
    try {
        const { staffIds, leadId } = req.body;
        const order = await Lead.findByPk(leadId);

        if (!order) {
            return apiResponse(res, 400, leadStaffMessage.NOT_FOUND);
        }

        const bulkData = staffIds.map((staffId) => ({
            leadId: Number(leadId),
            staffId,
        }));

        const leadStaffData = await LeadStaff.bulkCreate(bulkData, {
            ignoreDuplicates: true,
        });

        apiResponse(res, 200, leadStaffMessage.ADD_STAFF, leadStaffData);
    } catch (error: any) {
        await handleError(res, error);
    }
};

export const removeStaffFromLead = async (req: Request, res: Response) => {
    try {
        const { leadId, staffId } = req.body;

        await LeadStaff.destroy({
            where: {
                leadId,
                staffId,
            },
        });

        apiResponse(res, 200, leadStaffMessage.REMOVE_STAFF, []);
    } catch (error: any) {
        await handleError(res, error);
    }
};

export const getStaffLead = async (req: Request, res: Response) => {
    try {
        const { leadId } = req.params;
        const lead: any = await Lead.findByPk(leadId, {
            include: [
                {
                    model: User,
                    as: "assignedStaff",
                    attributes: ["id", "firstName", "lastName", "email", "role"], // Adjust attributes based on your User model
                    through: { attributes: [] }, // Exclude junction table attributes
                },
            ],
        });

        return apiResponse(res, 200, leadStaffMessage.FETCH_LEADS_STAFF, {
            data: {
                leadId: lead.id,
                assignedStaff: lead.assignedStaff,
            },
        });

    } catch (error: any) {
        await handleError(res, error);
    }
};

