import { Request, Response } from "express";
import { handleError } from "@/utils/handleError";
import { apiResponse } from "@/utils/apiResponse";
import { LeadMessages, UserMessages } from "@/utils/common";
import { LeadSchema, UpdateLeadSchema } from "../schema/leadSchema";
import { Lead } from "@/models/lead";
import { col, fn, Op, where } from "sequelize";
import {
  generateEmpId,
  generateRandomPassword,
} from "@/user/controllers/userController";
import bcrypt from "bcrypt";
import { User } from "@/models";
import sendEmail from "@/helpers/sendEmail";
import { LeadConversion } from "@/models/leadConversion";
import LeadNote from "@/models/leadNotes";

export const createLead = async (req: any, res: Response) => {
  try {
    const userId = req?.user?.dataValues?.id;
    const validateData = LeadSchema.parse(req.body);
    const leadExist = await Lead.findOne({
      where: {
        email: validateData.email,
      },
    });
    if (leadExist) {
      apiResponse(res, 200, LeadMessages.LEAD_EXIST);
    }
    const finalData = { ...validateData, createdBy: userId };

    const lead = await Lead.create(finalData);
    apiResponse(res, 200, LeadMessages.ADD_LEAD, lead);
  } catch (error: any) {
    await handleError(res, error);
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateLeadSchema.parse(req.body);
    const lead = await Lead.findByPk(id);

    if (!lead) {
      apiResponse(res, 200, LeadMessages.LEAD_NOT_FOUND, lead);
    }

    const updateLeadData = await lead.update(validatedData);
    apiResponse(res, 200, LeadMessages.UPDATE_LEAD, updateLeadData);
  } catch (error: any) {
    await handleError(res, error);
  }
};
export const getLeadById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByPk(id);

    if (!lead) {
      apiResponse(res, 200, LeadMessages.LEAD_NOT_FOUND, lead);
    }

    apiResponse(res, 200, LeadMessages.LEAD_FETCH, lead);
  } catch (error: any) {
    await handleError(res, error);
  }
};

export const getAllLeads = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      sortBy = "followUpDate",
      order = "ASC",
      startDate,
      endDate,
      staffId,
      type,
      dateFilter, // e.g. "next_3_day", "next_7_day"
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;
    const sortOrder =
      (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Helper to get today's date at midnight
    const getStartOfToday = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return now;
    };

    // Helper to add days to a date
    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const whereCondition: any = {
      [Op.and]: [],
    };

    // Search filter
    if (search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          { customerName: { [Op.iLike]: `%${search}%` } },
          { mobileNumber: { [Op.iLike]: `%${search}%` } },
        ],
      });
    }

    // Absolute date range filter takes priority over relative dateFilter
    if (startDate && endDate) {
      whereCondition[Op.and].push({
        followUpDate: {
          [Op.between]: [startDate, endDate],
        },
      });
    } else if (dateFilter) {
      // Relative date range from today
      const today = getStartOfToday();
      let targetDate: Date | null = null;

      const filterMap: Record<string, number> = {
        next_3_day: 3,
        next_7_day: 7,
        next_15_day: 15,
        next_30_day: 30,
      };

      if (filterMap[dateFilter as string]) {
        targetDate = addDays(today, filterMap[dateFilter as string]);
      }

      if (targetDate) {
        whereCondition[Op.and].push({
          followUpDate: {
            [Op.between]: [today, targetDate],
          },
        });
      }
    }

    // Type filter
    if (type) {
      whereCondition[Op.and].push({
        type: type as string,
      });
    }

    const { rows: leads, count: totalCount } = await Lead.findAndCountAll({
      where: whereCondition[Op.and].length ? whereCondition : undefined,
      include: [
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
      offset,
      limit: pageSize,
      order: [[sortBy as string, sortOrder]],
    });

    return apiResponse(res, 200, LeadMessages.LEAD_FETCH, {
      total: totalCount,
      page: pageNumber,
      pageSize,
      leads,
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

export const createCustomerToUser = async (req: any, res: Response) => {
  try {
    const { leadId } = req.body;

    // Step 1: Find the Lead
    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return apiResponse(res, 404, "Lead not found");
    }

    const userExists = await User.findOne({
      where: {
        email: lead.email,
        role: "dealer",
      },
    });
    if (userExists) {
      return await apiResponse(res, 400, UserMessages.USER_EXIST);
    }
    // Step 2: Extract names
    const nameParts = (lead.customerName || "").split(" ");
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Step 3: Generate email and password
    const email = lead.email; // Example logic
    const plainPassword = generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Step 4: Generate empId
    const empId = await generateEmpId("dealer");

    // Step 5: Create user data
    const userData = {
      firstName,
      lastName,
      email,
      role: "dealer",
      Password: hashedPassword,
      empId,
      image: null,
    };

    // Step 6: Save to DB
    const user = await User.create(userData);
    const LeadConversionData = {
      leadId: leadId,
      userId: user.id,                   // The new dealer's id
      oldStatus: lead.type || null,      // Lead type/status before conversion
      newRole: "dealer",
      convertedBy: req?.user?.dataValues?.id  // The admin/staff who performed the action
    };
    await LeadConversion.create(LeadConversionData);
    // Step 7: Send welcome email
    await sendEmail({
      email,
      subject: "Dealer Account Created",
      message: `<p>Your account has been created from a lead.</p><p><strong>Password:</strong> ${plainPassword}</p>`,
    });
    await lead.destroy();
    const { Password, ...userWithoutPassword } = user.toJSON();
    return apiResponse(
      res,
      201,
      "Dealer created successfully from lead",
      userWithoutPassword
    );
  } catch (error) {
    return handleError(res, error);
  }
};


export const getActiveLead = async (params: any, user: any) => {
  const {
    page = "1",
    limit = "10",
    search = "",
    sortBy = "followUpDate",
    order = "ASC",
    startDate,
    endDate,
    type,
    dateFilter, // e.g. "next_3_day", "next_7_day"
    followUpDate
  } = params

  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const offset = (pageNumber - 1) * pageSize;
  const sortOrder =
    (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

  // Helper to get today's date at midnight
  const getStartOfToday = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  };

  // Helper to add days to a date
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const whereCondition: any = {
    [Op.and]: [],
  };

  // Search filter
  if (search) {
    whereCondition[Op.and].push({
      [Op.or]: [
        { customerName: { [Op.iLike]: `%${search}%` } },
        { mobileNumber: { [Op.iLike]: `%${search}%` } },
      ],
    });
  }
  if (followUpDate) {
    whereCondition.followUpDate = {
      [Op.eq]: followUpDate
    }
  }
  let staffId: any
  if (user.role === 'staff') {
    staffId = user.id
  }
  // Absolute date range filter takes priority over relative dateFilter
  if (startDate && endDate) {
    whereCondition[Op.and].push({
      followUpDate: {
        [Op.between]: [startDate, endDate],
      },
    });
  } else if (dateFilter) {
    // Relative date range from today
    const today = getStartOfToday();
    let targetDate: Date | null = null;

    const filterMap: Record<string, number> = {
      next_3_day: 3,
      next_7_day: 7,
      next_15_day: 15,
      next_30_day: 30,
    };

    if (filterMap[dateFilter as string]) {
      targetDate = addDays(today, filterMap[dateFilter as string]);
    }

    if (targetDate) {
      whereCondition[Op.and].push({
        followUpDate: {
          [Op.between]: [today, targetDate],
        },
      });
    }
  }

  // Type filter
  if (type) {
    whereCondition[Op.and].push({
      type: type as string,
    });
  }

  const { rows: leads, count: totalCount } = await Lead.findAndCountAll({
    where: whereCondition[Op.and].length ? whereCondition : undefined,
    include: [
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
    offset,
    limit: pageSize,
    order: [[sortBy as string, sortOrder]],
  });
  const pagination = {
    totalOrders: totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: pageNumber,
    pageSize,
  };

  return { leads: leads, pagination };

};

export const addLeadNotes = async (req: Request, res: Response) => {
  try {
    const { leadId, userId, note } = req.body

    const lead: any = await Lead.findByPk(leadId);

    if (!lead) {
      apiResponse(res, 200, LeadMessages.LEAD_NOT_FOUND, lead);
    }

    const leadNotes = await LeadNote.create({
      leadId: leadId, userId: userId, note: note
    })

    return apiResponse(res, 200, "Added Note in the Lead", leadNotes)

  } catch (error) {
    handleError(res, error);
  }
}

export const getLeadNotes = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      sortBy = "createdAt",
      order = "DESC",
      leadId,
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

    if (leadId) {
      whereCondition.leadId = leadId;
    }

    if (userId) {
      whereCondition.userId = userId;
    }

    // staffId filter (if needed, depends on relation)
    if (staffId) {
      whereCondition["$User.id$"] = staffId;
    }

    const { rows: notes, count } = await LeadNote.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "role"] // get user name
        },
        {
          model: Lead,
          attributes: ["customerName", "mobileNumber", "type", "requirement"]
        }
      ],
      order: [[sortBy as string, sortOrder]],
      limit: pageSize,
      offset,
      distinct: true // important when using include to avoid count duplication
    });

    return apiResponse(res, 200, LeadMessages.LEAD_NOTES_FETCH, {
      total: count,
      page: pageNumber,
      pageSize,
      leads: notes,
    });

  } catch (error) {
    handleError(res, error);
  }
};