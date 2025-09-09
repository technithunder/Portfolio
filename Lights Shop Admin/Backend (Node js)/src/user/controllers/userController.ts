import { Request, Response } from "express";
import UserSchema, {
  UpdateUserSchema,
  userCreate,
} from "../schemas/userSchema";
import { apiResponse } from "@/utils/apiResponse";
import { ResetPassMessages, UserMessages } from "@/utils/common";
import { handleError } from "@/utils/handleError";
import { Cloudinary } from "@/utils/cloudinary";
import { col, fn, Op, where } from "sequelize";
import User from "@/models/user";
import { formatPersonResponse } from "@/utils/formatPersonResponse";
import bcrypt from "bcrypt";
import sendEmail from "@/helpers/sendEmail";
import crypto from "crypto";
import Order from "@/models/order";
import { Address } from "@/models/address";
import Notification from "@/models/notification";
import OrderStaff from "@/models/orderStaff";
import { DailyProgress, Wishlist } from "@/models";
import DeviceToken from "@/models/deviceToken";

// generate random password
export const generateRandomPassword = (length: number = 10): string => {
  const chars =
    "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz0123456789@#$!";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const generateEmpId = async (role: string): Promise<string> => {
  const prefixMap: Record<string, string> = {
    staff: "emp",
    dealer: "del",
    customer: "cus"
  };

  const prefix = prefixMap[role];
  if (!prefix) throw new Error("Invalid role for empId generation");

  // Get all existing IDs for this role
  const existingUsers = await User.findAll({
    where: { role },
    attributes: ['empId'], // assuming empId is the field name
    order: [['empId', 'ASC']],
    paranoid: false
  });
  const existingIds = existingUsers.map((user: any) => {
    const idNumber = parseInt(user.empId.replace(prefix, ''));
    return idNumber;
  });

  // Find the first gap or next number
  let nextNumber = 1;
  for (const id of existingIds) {
    if (id === nextNumber) {
      nextNumber++;
    } else {
      break;
    }
  }

  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { qualification, image, address, department, discount, position, earning, ...rest } = req.body;
    // Parse `qualification` field if it's a JSON string
    const dataWithCorrectTypes = {
      ...rest,
      ...(qualification && {
        qualification:
          typeof qualification === "string"
            ? JSON.parse(qualification)
            : qualification,
      }),
    };
    const validatedData = UserSchema.parse(dataWithCorrectTypes);

    const userExists = await User.findOne({
      where: {
        email: validatedData.email,
        role: validatedData.role,
      },
    });
    if (userExists) {
      return await apiResponse(res, 400, UserMessages.USER_EXIST);
    }
    const file = req.file as Express.Multer.File | undefined;
    let imageUrl: string | undefined;

    if (file) {
      const uploadResult = await Cloudinary.uploadToCloudinary(file, "users");
      imageUrl = uploadResult.secure_url;
    } else if (image && typeof image === "string") {
      const isDataUri = image.startsWith("data:image");
      const base64String = isDataUri
        ? image
        : `data:image/jpeg;base64,${image}`;
      const uploadResult = await Cloudinary.uploadToCloudinary(
        base64String,
        "users"
      );
      imageUrl = uploadResult.secure_url;
    }

    const toDateOnly = (value: any) => {
      const parsed = new Date(value);
      return !isNaN(parsed.getTime())
        ? parsed.toISOString().split("T")[0]
        : null;
    };
    const plainPassword = generateRandomPassword(10);
    const hasPass = await bcrypt.hash(plainPassword, 10);
    await sendEmail({
      email: req.body.email,
      subject: "Welcome to Our Platform",
      message: `<p>Your account has been created.</p><p><strong>Password:</strong> ${plainPassword}</p>`,
    });
    const empId = await generateEmpId(validatedData.role);

    const finalData: any = {
      ...validatedData,
      qualification: dataWithCorrectTypes.qualification,
      empId,
      image: imageUrl,
      Password: hasPass,
      joiningDate: toDateOnly(validatedData.joiningDate),
      dob: toDateOnly(validatedData.dob),
      discount: discount,
      earning: earning,
      department: department,
      position: position,
      status: "Active",
    };
    if (typeof address === 'string') {
      finalData.address = address
    }
    const user = await User.create(finalData);
    if (address) {
      if (Array.isArray(address)) {
        for (const addr of address) {
          await Address.create({
            userId: user.id,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            country: addr.country,
            zipCode: addr.zipCode,
          });
        }
      }
    }
    const { Password, ...userWithoutPassword } = user.toJSON();
    return apiResponse(res, 201, UserMessages.CREATED, userWithoutPassword);
  } catch (error: any) {
    return handleError(res, error);
  }
};

// User Signup api
export const userSignup = async (req: Request, res: Response) => {
  try {
    const validatedData = userCreate.parse(req?.body);
    const userExists = await User.findOne({
      where: {
        email: validatedData.email,
        role: validatedData.role,
      },
    });
    if (userExists) {
      return await apiResponse(res, 400, UserMessages.USER_EXIST);
    }
    const plainPassword = generateRandomPassword(10);
    const hasPass = await bcrypt.hash(plainPassword, 10);
    const empId = await generateEmpId(validatedData.role);
    const finalData = {
      ...validatedData,
      empId,
      status: "In Active",
      Password: hasPass,
    };
    await sendEmail({
      email: req.body.email,
      subject: "Welcome to Our Platform",
      message: `<p>Your account has been created.</p><p><strong>Password:</strong> ${plainPassword}</p>`,
    });
    const user = await User.create(finalData);
    const { Password, ...userWithoutPassword } = user.toJSON();
    await apiResponse(res, 201, UserMessages.CREATED, userWithoutPassword);
  } catch (error) {
    await handleError(res, error);
  }
};

// User Get All User
export const getAllUser = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      sortBy = "firstName",
      order = "ASC",
      role,
      status,
    } = req.query;


    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;
    const sortOrder = (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

    const whereCondition: any = {
      [Op.and]: [{ role: { [Op.ne]: "admin" } }],
    };

    if (role) {
      whereCondition[Op.and].push({ role: { [Op.eq]: role } });
    }


    if (status) {
      whereCondition[Op.and].push({ status: { [Op.eq]: status } });
    }

    if (search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { position: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { empId: { [Op.iLike]: `%${search}%` } },
          { department: { [Op.iLike]: `%${search}%` } },
          // 👇 Full name search using CONCAT
          where(
            fn("concat", col("firstName"), " ", col("lastName")),
            {
              [Op.iLike]: `%${search}%`,
            }
          ),
        ],
      });
    }


    const { rows: users, count: totalCount } = await User.findAndCountAll({
      where: whereCondition,
      offset,
      limit: pageSize,
      order: [[sortBy as string, sortOrder]],
    });

    if (users.length === 0) {
      return apiResponse(res, 200, UserMessages.FETCHED, {
        total: 0,
        page: pageNumber,
        pageSize,
        users: [],
      });
    }

    let formattedUsers: any[];

    if (role === "dealer") {
      const userIds = users.map((u: any) => u.id);

      // Get order count per dealer
      const orders = await Order.findAll({
        where: { userId: { [Op.in]: userIds } },
        attributes: [
          "userId",
          [fn("COUNT", col("id")), "orderCount"]
        ],
        group: ["userId"],
        raw: true,
      });

      const orderMap = orders.reduce((acc: any, cur: any) => {
        acc[cur.userId] = parseInt(cur.orderCount);
        return acc;
      }, {});

      formattedUsers = users.map((user: any) => {
        const formatted = formatPersonResponse(user, true);
        return {
          ...formatted,
          totalOrders: orderMap[user.id] || 0,
        };
      });
    } else {
      formattedUsers = users.map((user: any) =>
        formatPersonResponse(user, true)
      );
    }

    return apiResponse(res, 200, UserMessages.FETCHED, {
      total: totalCount,
      page: pageNumber,
      pageSize,
      users: formattedUsers,
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

//Get User by id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user: any = await User.findByPk(id, {
      include: [
        {
          model: Address,
          as: 'addresses', // or just `as` if you’ve defined it
        },
      ],
    })

    const today = new Date().toISOString().slice(0, 10);

    let progress = await DailyProgress.findOne({
      where: {
        userId: id,
        date: today,
      },
    });
    if (!user) {
      return apiResponse(res, 404, UserMessages.NOT_FOUND);
    }

    const formattedUser = formatPersonResponse(user, true, progress);
    return apiResponse(res, 200, UserMessages.FETCHED, formattedUser);
  } catch (error: any) {
    handleError(res, error);
  }
};

//delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id)
    const user = await User.findByPk(id);
    if (!user) {
      return apiResponse(res, 404, UserMessages.NOT_FOUND);
    }

    Notification.destroy({
      where: {
        userId: id
      }
    })
    OrderStaff.destroy({
      where: {
        staffId: id
      }
    })
    Wishlist.destroy({
      where: {
        userId: id
      }
    })
    DeviceToken.destroy({
      where: {
        userId: id
      }
    })
    const deleteduser = await User.destroy({
      where: {
        id: id,
      },
    });

    apiResponse(res, 200, UserMessages.DELETED, deleteduser);
  } catch (error: any) {
    handleError(res, error);
  }
};

//Update User
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { image, qualification, department, address, discount, position, earning, ...rest } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return apiResponse(res, 404, UserMessages.NOT_FOUND);
    }
    // Parse `qualification` if it's a string
    const dataWithCorrectTypes = {
      ...rest,
      ...(qualification && {
        qualification:
          typeof qualification === "string"
            ? JSON.parse(qualification)
            : qualification,
      }),
    };
    const validatedData = UpdateUserSchema.parse(req.body);

    let finalData: any = {
      ...validatedData,
      joiningDate: validatedData.joiningDate
        ? new Date(validatedData.joiningDate)
        : undefined,
      dob: validatedData.dob ? new Date(validatedData.dob) : undefined,
      qualification: dataWithCorrectTypes.qualification,
      department: department,
      discount: discount,
      earning: earning,
      position: position
    };

    const isValidUrl = (str: string) => {
      try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch (_) {
        return false;
      }
    };
    const file = req.file as Express.Multer.File | undefined;
    let imageUrl: string | undefined;
    if (file) {
      // Case 1: Image is uploaded via file
      const uploadResult = await Cloudinary.uploadToCloudinary(file, "users");
      imageUrl = uploadResult.secure_url;
    } else if (image && typeof image === "string") {
      if (isValidUrl(image)) {
        // Case 2: Image is already a valid URL
        imageUrl = image;
      } else {
        // Case 3: Image is a base64 string
        const isDataUri = image.startsWith("data:image");
        const base64String = isDataUri
          ? image
          : `data:image/jpeg;base64,${image}`;

        const uploadResult = await Cloudinary.uploadToCloudinary(
          base64String,
          "users"
        );
        imageUrl = uploadResult.secure_url;
      }
    }
    if (imageUrl) {
      finalData.image = imageUrl;
    }
    if (typeof address === 'string') {
      finalData.address = address
    }
    await user.update(finalData);

    if (address) {
      await Address.destroy({ where: { userId: id } });

      // If array has new addresses, insert them
      if (Array.isArray(address) && address.length > 0) {
        for (const addr of address) {
          await Address.create({
            userId: user.id,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            country: addr.country,
            zipCode: addr.zipCode,
          });
        }
      }

    }
    return apiResponse(res, 200, UserMessages.UPDATED, user);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ where: { email: email } });
    if (!userExist) {
      return apiResponse(res, 404, UserMessages.NOT_FOUND);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.update(
      {
        Password: hashedPassword,
      },
      {
        where: { email: email },
      }
    );

    return apiResponse(res, 200, ResetPassMessages.PASSWORD_RESET, {
      email: email,
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, email, password } = req.body;

    const decodedEmail = decodeURIComponent(email);

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      where: {
        email: decodedEmail,
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return apiResponse(res, 400, ResetPassMessages.LINK_EXPIRE);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.update(
      {
        Password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      {
        where: { id: user.id },
      }
    );

    return apiResponse(res, 200, ResetPassMessages.PASSWORD_RESET, {
      email: decodedEmail,
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

export const addAddress = async (req: any, res: Response) => {
  try {
    const { street, city, state, country, zipCode } = req.body;
    const userId = req?.user?.dataValues?.id;
    // Validate the input data
    if (!userId || !street || !city || !state || !country || !zipCode) {
      return apiResponse(res, 400, "All fields are required.");
    }

    // Create the address
    const address = await Address.create({
      userId,
      street,
      city,
      state,
      country,
      zipCode,
    });

    return apiResponse(res, 201, "Address added successfully.", address);
  } catch (error: any) {
    handleError(res, error);

  }
}

export const updateAddress = async (req: any, res: Response) => {
  try {

    const { id } = req.params;
    const { street, city, state, country, zipCode } = req.body;
    const userId = req?.user?.dataValues?.id;

    // Validate the input data
    if (!userId || !street || !city || !state || !country || !zipCode) {
      return apiResponse(res, 400, "All fields are required.");
    }

    // Find the address by ID
    const address = await Address.findOne({ where: { id, userId } });
    if (!address) {
      return apiResponse(res, 404, "Address not found.");
    }

    // Update the address
    await address.update({
      street,
      city,
      state,
      country,
      zipCode,
    });

    return apiResponse(res, 200, "Address updated successfully.", address);
  } catch (error: any) {
    handleError(res, error);
  }
}

export const getAddressByID = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const AddressData = await Address.findOne({ where: { id: id } })
    if (!AddressData) {
      return apiResponse(res, 404, "Address not found.");
    }
    return apiResponse(res, 200, "Address fetched successfully.", AddressData);
  } catch (error: any) {
    handleError(res, error);
  }
}

export const getAllAddress = async (req: any, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      sortBy = "id",
      order = "ASC",

    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;
    const sortOrder = (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

    const whereCondition: any = {
      userId: req?.user?.dataValues?.id,
    };

    if (search) {
      whereCondition[Op.or] = [
        { street: { [Op.iLike]: `%${search}%` } },
        { city: { [Op.iLike]: `%${search}%` } },
        { state: { [Op.iLike]: `%${search}%` } },
        { country: { [Op.iLike]: `%${search}%` } },
        { zipCode: { [Op.iLike]: `%${search}%` } },
      ];
    }


    const { rows: address, count: totalCount } = await Address.findAndCountAll({
      where: whereCondition,
      offset,
      limit: pageSize,
      order: [[sortBy as string, sortOrder]],
    });

    if (address.length === 0) {
      return apiResponse(res, 200, "Address List Fetch", {
        total: 0,
        page: pageNumber,
        pageSize,
        users: [],
      });
    }

    return apiResponse(res, 200, "Address List Fetch", {
      total: totalCount,
      page: pageNumber,
      pageSize,
      users: address,
    });
  } catch (error: any) {
    handleError(res, error);
  }
}

export const deleteAddress = async (req: any, res: Response) => {
  try {

    const { id } = req.params;
    const userId = req?.user?.dataValues?.id;

    // Find the address by ID
    const address = await Address.findOne({ where: { id, userId } });
    if (!address) {
      return apiResponse(res, 404, "Address not found.");
    }

    // Delete the address
    await address.destroy();

    return apiResponse(res, 200, "Address deleted successfully.");
  } catch (error: any) {
    handleError(res, error);
  }
}

export const getAllUserWithoutPagination = async (req: any, res: Response) => {
  try {
    const { role, search } = req.query

    let whereCondition: any = {
      status: "Active",
    }
    whereCondition = {
      [Op.and]: [{ role: { [Op.ne]: "admin" } }],
    };

    if (role === "both") {
      whereCondition[Op.and].push({
        [Op.or]: [{ role: "customer" }, { role: "dealer" }],
      });
    } else if (["customer", "dealer", "staff"].includes(role as string)) {
      whereCondition[Op.and].push({ role });
    }

    if (search) {
      whereCondition[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const user = await User.findAll({
      where: whereCondition,
      attributes: [
        "id",
        "firstName",
        "lastName",

        "image",
        "empId",
      ],
    })
    return apiResponse(res, 200, UserMessages.FETCHED, {
      users: user,
    });
  } catch (error: any) {
    handleError(res, error);
  }
}

export const getAllAddressWithoutPagination = async (req: any, res: Response) => {
  try {
    const { userId } = req.query

    let whereCondition: any = {
      status: "Active",
    }
    whereCondition = {
      [Op.and]: [{ userId: { [Op.eq]: userId } }],
    };

    const address = await Address.findAll({
      where: whereCondition,

    })
    return apiResponse(res, 200, "Address List Fetch", {
      address: address,
    });
  } catch (error: any) {
    handleError(res, error);
  }
}

export const activeUser = async (req: any, res: Response) => {
  try {
    const { status } = req.body
    const { id } = req.params

    const user = await User.findByPk(id);
    if (!user) {
      return apiResponse(res, 400, UserMessages.NOT_FOUND, true)
    }
    await User.update({ status }, { where: { id } });
    apiResponse(res, 200, UserMessages.UPDATED, true)
  } catch (error) {
    return handleError(res, error);
  }
}

export const getAllDeletedUser = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      sortBy = "firstName",
      order = "ASC",
      role,
      status,
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;
    const sortOrder = (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Main WHERE: Only deleted users (deletedAt NOT NULL)
    const whereCondition: any = {
      deletedAt: { [Op.ne]: null },
      role: { [Op.ne]: "admin" }
    };

    // if (role) {
    //   whereCondition.role = role;
    // }
    if (status) {
      whereCondition.status = status;
    }

    if (search) {
      whereCondition[Op.and] = [
        {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
            { position: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { empId: { [Op.iLike]: `%${search}%` } },
            { department: { [Op.iLike]: `%${search}%` } },
            where(
              fn("concat", col("firstName"), " ", col("lastName")),
              { [Op.iLike]: `%${search}%` }
            ),
          ],
        },
      ];
    }

    // Important: Use paranoid: false so Sequelize "sees" deleted records!
    const { rows: users, count: totalCount } = await User.findAndCountAll({
      attributes: ["id", "role", "firstName", "lastName", "email", "empId", "createdAt", "updatedAt", "deletedAt", "position", "department", "image"],
      where: whereCondition,
      offset,
      limit: pageSize,
      order: [[sortBy as string, sortOrder]],
      paranoid: false,
    });

    // Format response if needed (you can use your existing formatting logic here)
    return apiResponse(res, 200, UserMessages.FETCH_DELETE_USER, {
      total: totalCount,
      page: pageNumber,
      pageSize,
      users, // possibly map to a formatter function if needed
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

export const restoreDeletedUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the deleted user (even if soft deleted)
    const user: any = await User.findOne({
      where: { id },
      paranoid: false, // Make sure to find even the deleted ones
    });

    if (!user || user.deletedAt === null) {
      return apiResponse(res, 400, UserMessages.NOT_FOUND);
    }

    // Restore the user (undelete)
    await user.restore();

    return apiResponse(res, 200, UserMessages.USER_RESTORE, { user });
  } catch (error: any) {
    handleError(res, error);
  }
};

export const changePassword = async (req: any, res: Response) => {
  try {

    const { oldPassword, newPassword } = req.body;
    const userId = req?.user?.dataValues?.id;
    const user: any = await User.findByPk(userId);
    if (!user) {
      return apiResponse(res, 404, UserMessages.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.dataValues?.Password);
    if (!isMatch) {
      return apiResponse(res, 400, "Old password is incorrect.");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      {
        Password: hashedPassword,
      },
      {
        where: { id: userId },
      }
    );

    return apiResponse(res, 200, "Password changed successfully.");

  } catch (error: any) {
    handleError(res, error);
  }
}