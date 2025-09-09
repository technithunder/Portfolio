import { Request, Response } from "express";
import { Op } from "sequelize"; // Import Op for Sequelize operators
import { apiResponse } from "@/utils/apiResponse";
import {
  CategoryMessages,
  ProductMessages,
  QuantityMessages,
} from "@/utils/common";
import { handleError } from "@/utils/handleError";
import { Category } from "@/models/category";
import { Quantity } from "@/models/quantity";
import { Cloudinary } from "@/utils/cloudinary";
import productSchema, { UpdateProductSchema } from "../schemas/productSchema";
import Product from "@/models/product";
import { CartItem, sequelize, User, Wishlist } from "@/models";
import ProductVariant from "@/models/productVariant";
import ProductAttributeDiscount from "@/models/ProductAttributeDiscounts";

// export const createProduct = async (req: Request, res: Response) => {
//   try {
//     const { ledColors, bodyColors, watts, reflectors, images, ...rest } = req.body;
//     const productExist = await Product.findOne({ where: { productName: req.body.productName } })
//     if (productExist) {
//       return handleError(res, { message: "Product already Exist" });
//     }
//     const dataWithCorrectTypes = {
//       ...rest,
//       // Parse JSON strings if necessary
//       ...(ledColors && {
//         ledColors:
//           typeof ledColors === "string" ? JSON.parse(ledColors) : ledColors,
//       }),
//       ...(bodyColors && {
//         bodyColors:
//           typeof bodyColors === "string" ? JSON.parse(bodyColors) : bodyColors,
//       }),
//       ...(watts && {
//         watts: typeof watts === "string" ? JSON.parse(watts) : watts,
//       }),
//       ...(reflectors && {
//         reflectors:
//           typeof reflectors === "string" ? JSON.parse(reflectors) : reflectors,
//       }),
//     };

//     // Default values for stock if missing
//     if (dataWithCorrectTypes.openingStock === undefined) {
//       dataWithCorrectTypes.openingStock = dataWithCorrectTypes.addedStock;
//     }
//     if (dataWithCorrectTypes.remainingStock === undefined) {
//       dataWithCorrectTypes.remainingStock = dataWithCorrectTypes.addedStock;
//     }

//     // Check for image files
//     // if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
//     //   return handleError(res, { message: "Image files are required" });
//     // }

//     // Expect images to be an array of base64 strings
//     if (!images || !Array.isArray(images) || images.length === 0) {
//       return handleError(res, { message: "Base64 images are required" });
//     }
//     if (images.length > 6) {
//       return handleError(res, { message: "Max 6 images are allowed" });
//     }

//     const validatedData = productSchema.parse(dataWithCorrectTypes);

//     // Upload images
//     // const files = req.files as Express.Multer.File[];
//     // const uploadedImages: string[] = [];

//     // for (const file of files) {
//     //   const uploadResult = await Cloudinary.uploadToCloudinary(
//     //     file,
//     //     "products"
//     //   );
//     //   uploadedImages.push(uploadResult.secure_url);
//     // }

//     const uploadPromises = images.map((base64: string) =>
//       Cloudinary.uploadToCloudinary(base64, "products") // Adjust your upload utility to accept base64
//     );
//     const uploadResults = await Promise.all(uploadPromises);
//     const uploadedImages = uploadResults.map(result => result.secure_url);

//     // Final data to insert
//     const dataWithCorrectExpiryDate = {
//       ...validatedData,
//       image: uploadedImages,
//       // expiryDate: new Date(validatedData.expiryDate),
//     };

//     const product = await Product.create(dataWithCorrectExpiryDate);
//     apiResponse(res, 201, ProductMessages.CREATED, product);
//   } catch (error: any) {
//     handleError(res, error);
//   }
// };

export const createProduct = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      // ledColors, 
      // bodyColors, 
      // watts, 
      // reflectors, 
      images,
      variants,
      attributeDiscounts,
      ...rest
    } = req.body;

    // check product exists
    const productExist = await Product.findOne({ where: { productName: rest.productName } });
    if (productExist) {
      return handleError(res, { message: "Product already exists" });
    }

    // --- Upload images ---
    if (!images || !Array.isArray(images) || images.length === 0) {
      return handleError(res, { message: "Base64 images are required" });
    }
    if (images.length > 6) {
      return handleError(res, { message: "Max 6 images are allowed" });
    }

    const uploadPromises = images.map((base64: string) =>
      Cloudinary.uploadToCloudinary(base64, "products")
    );
    const uploadResults = await Promise.all(uploadPromises);
    const uploadedImages = uploadResults.map(result => result.secure_url);

    // --- Create Product ---
    const product = await Product.create(
      {
        ...rest,
        image: uploadedImages,
      },
      { transaction }
    );

    // --- Create Product Variants ---
    if (variants && Array.isArray(variants)) {
      for (const v of variants) {
        await ProductVariant.create(
          {
            productId: product.id,
            ledColor: v.ledColor || null,
            bodyColor: v.bodyColor || null,
            watts: v.watts || null,
            reflector: v.reflector || null,
            stock: v.stock || 0,
          },
          { transaction }
        );
      }
    }

    // --- Create Attribute Discounts ---
    if (attributeDiscounts) {
      await ProductAttributeDiscount.create(
        {
          productId: product.id,
          ledColor: attributeDiscounts.ledColor || null,
          bodyColor: attributeDiscounts.bodyColor || null,
          watts: attributeDiscounts.watts || null,
          reflector: attributeDiscounts.reflector || null,
        },
        { transaction }
      );
    }

    await transaction.commit();
    apiResponse(res, 201, ProductMessages.CREATED, product);
  } catch (error: any) {
    await transaction.rollback();
    handleError(res, error);
  }
};

export const getAllProduct = async (req: any, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      sortBy = "productName",
      order = "ASC",
      categoryId, // <-- categoryId filter
    } = req.query;

    const userId = req.user?.dataValues?.id || req.query.userId;
    const userRole = req.user?.dataValues?.role || "";

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;
    const sortOrder = (order as string).toUpperCase() === "DESC" ? "DESC" : "ASC";

    const whereCondition: any = {
      isDeleted: false,
      ...(categoryId && { categoryId }), // Apply category filter
      ...(search && {
        [Op.or]: [
          { productName: { [Op.iLike]: `%${search}%` } },
          // Add other searchable fields if needed
        ],
      }),
    };

    const includeOptions: any[] = [];

    if (userId) {
      includeOptions.push({
        model: User,
        as: "wishlistedBy",
        attributes: ["id"],
        through: { attributes: [] },
        where: { id: userId },
        required: false,
      });
    }

    const { rows: products, count: totalCount } = await Product.findAndCountAll({
      where: whereCondition,
      offset,
      limit: pageSize,
      order: [[sortBy as string, sortOrder]],
      include: includeOptions,
    });
    const categoryCount = await Category.count()
    // Fetch user to determine discount
    const user = await User.findByPk(userId);
    const isDealer = userRole === "dealer";
    const userDiscount = isDealer && user?.dataValues?.discount
      ? parseFloat(user.dataValues.discount)
      : 0;

    const formattedProducts = products.map((product: any) => {
      const isWishlisted = product.wishlistedBy && product.wishlistedBy.length > 0;
      const prod = product.toJSON();
      const price = parseFloat(prod.productPrice);

      const afterDiscountPrice = userDiscount
        ? price - (price * userDiscount) / 100
        : price;

      return {
        ...prod,
        isWishlisted,
        price: Math.round(price * 100) / 100,
        afterDiscountPrice: Math.round(afterDiscountPrice * 100) / 100,
      };
    });

    return apiResponse(res, 200, ProductMessages.FETCHED, {
      total: totalCount,
      page: pageNumber,
      pageSize,
      categoryCount: categoryCount,
      products: formattedProducts,
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

// export const getProductById = async (req: any, res: Response) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user?.dataValues?.id || req.query.userId;
//     const userRole = req.user?.dataValues?.role || "";

//     const product = await Product.findOne({
//       where: { id, isDeleted: false },
//       include: [
//         ...(userId
//           ? [
//             {
//               model: User,
//               as: "wishlistedBy",
//               attributes: ["id"],
//               through: { attributes: [] },
//               where: { id: userId },
//               required: false,
//             },
//           ]
//           : []),
//       ],
//     });

//     if (!product) {
//       return apiResponse(res, 400, ProductMessages.NOT_FOUND, []);
//     }

//     // Extract wishlisted status and remove wishlistedBy array
//     const productData = product.toJSON();
//     const isWishlisted = productData.wishlistedBy?.length > 0;
//     delete productData.wishlistedBy;
//     const user = await User.findByPk(userId);
//     const isDealer = userRole === "dealer";
//     const userDiscount = isDealer && user?.dataValues?.discount
//       ? parseFloat(user.dataValues.discount)
//       : 0;

//     const prod = product.toJSON();
//     const price = parseFloat(prod.productPrice);

//     const afterDiscountPrice = userDiscount
//       ? price - (price * userDiscount) / 100
//       : price;

//     apiResponse(res, 200, ProductMessages.FETCHED, {
//       ...productData,
//       isWishlisted,
//       price: Math.round(price * 100) / 100,
//       afterDiscountPrice: Math.round(afterDiscountPrice * 100) / 100,
//     });

//   } catch (error: any) {
//     handleError(res, error);
//   }
// };


export const getProductById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.dataValues?.id || req.query.userId;
    const userRole = req.user?.dataValues?.role || "";

    const product = await Product.findOne({
      where: { id, isDeleted: false },
      include: [
        ...(userId
          ? [
            {
              model: User,
              as: "wishlistedBy",
              attributes: ["id"],
              through: { attributes: [] },
              where: { id: userId },
              required: false,
            },
          ]
          : []),
        {
          model: ProductVariant,
          as: "variants",
        },
        {
          model: ProductAttributeDiscount,
          as: "attributeDiscounts",
        },
        { model: Category, as: "category" }
      ],
    });

    if (!product) {
      return apiResponse(res, 400, ProductMessages.NOT_FOUND, []);
    }

    // Extract wishlisted status and remove wishlistedBy array
    const productData = product.toJSON();
    const isWishlisted = productData.wishlistedBy?.length > 0;
    delete productData.wishlistedBy;

    const user = await User.findByPk(userId);
    const isDealer = userRole === "dealer";
    const userDiscount =
      isDealer && user?.dataValues?.discount
        ? parseFloat(user.dataValues.discount)
        : 0;

    const price = parseFloat(productData.productPrice);

    const afterDiscountPrice = userDiscount
      ? price - (price * userDiscount) / 100
      : price;

    apiResponse(res, 200, ProductMessages.FETCHED, {
      ...productData,
      isWishlisted,
      price: Math.round(price * 100) / 100,
      afterDiscountPrice: Math.round(afterDiscountPrice * 100) / 100,
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return apiResponse(res, 404, ProductMessages.NOT_FOUND);
    }

    await CartItem.destroy({
      where: {
        productId: id,
      },
    });

    await Wishlist.destroy({
      where: {
        productId: id,
      },
    });
    const deletedProduct = await Product.update(
      { isDeleted: true },
      { where: { id } }
    );

    apiResponse(res, 200, ProductMessages.DELETED, deletedProduct);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    if (!categories) {
      apiResponse(res, 400, CategoryMessages.FETCHED, []);
    }

    apiResponse(res, 200, CategoryMessages.FETCHED, categories);
  } catch (error: any) {
    handleError(res, error);
  }
};

// export const updateProduct = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findByPk(id);

//     if (!product) {
//       return apiResponse(res, 404, ProductMessages.NOT_FOUND);
//     }

//     const {
//       ledColors,
//       bodyColors,
//       watts,
//       reflectors,
//       image, // Can be a stringified array or a real array
//       ...rest
//     } = req.body;

//     // Safely parse JSON fields
//     const parseField = (field: any) =>
//       typeof field === "string" ? JSON.parse(field) : field;

//     const dataWithCorrectTypes = {
//       ...rest,
//       ...(ledColors && { ledColors: parseField(ledColors) }),
//       ...(bodyColors && { bodyColors: parseField(bodyColors) }),
//       ...(watts && { watts: parseField(watts) }),
//       ...(reflectors && { reflectors: parseField(reflectors) }),
//     };
//     // Validate input data
//     const validatedData = UpdateProductSchema.parse(dataWithCorrectTypes);

//     // Upload new images if provided
//     const files = (req.files as Express.Multer.File[]) || [];
//     const uploadedImages: string[] = [];

//     for (const file of files) {
//       const uploadResult = await Cloudinary.uploadToCloudinary(
//         file,
//         "products"
//       );
//       uploadedImages.push(uploadResult.secure_url);
//     }

//     let retainedImages: string[] = [];
//     if (image) {
//       if (Array.isArray(image)) {
//         retainedImages = image;
//       } else if (typeof image === "string") {
//         try {
//           retainedImages = JSON.parse(image);
//         } catch {
//           retainedImages = [image];
//         }
//       }
//     }
//     // Merge retained + newly uploaded images
//     const finalImages = [...retainedImages, ...uploadedImages];

//     const finalData: any = {
//       ...validatedData,
//       image: finalImages,
//       // expiryDate: validatedData.expiryDate
//       //   ? new Date(validatedData.expiryDate)
//       //   : undefined,
//     };

//     await product.update(finalData);
//     return apiResponse(res, 201, ProductMessages.UPDATED, product);
//   } catch (error: any) {
//     handleError(res, error);
//   }
// };

// export const updateProduct = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findByPk(id);

//     if (!product) {
//       return apiResponse(res, 404, ProductMessages.NOT_FOUND);
//     }

//     const {
//       ledColors,
//       bodyColors,
//       watts,
//       reflectors,
//       images, // Array containing URLs or base64 strings
//       ...rest
//     } = req.body;

//     const parseField = (field: any) =>
//       typeof field === "string" ? JSON.parse(field) : field;

//     const dataWithCorrectTypes = {
//       ...rest,
//       ...(ledColors && { ledColors: parseField(ledColors) }),
//       ...(bodyColors && { bodyColors: parseField(bodyColors) }),
//       ...(watts && { watts: parseField(watts) }),
//       ...(reflectors && { reflectors: parseField(reflectors) }),
//     };

//     const validatedData = UpdateProductSchema.parse(dataWithCorrectTypes);

//     // Use images from request or fallback to product's current images
//     let incomingImages: string[] = [];
//     if (Array.isArray(images)) {
//       incomingImages = images;
//     } else if (typeof images === "string") {
//       // If client sends as JSON string
//       try {
//         incomingImages = JSON.parse(images);
//       } catch {
//         incomingImages = [images];
//       }
//     } else if (product.image && Array.isArray(product.image)) {
//       incomingImages = product.image;
//     }

//     // Enforce max 6 images
//     if (incomingImages.length > 6) {
//       incomingImages = incomingImages.slice(0, 6);
//     }

//     // Upload all base64 images, retain URLs
//     const uploadPromises = incomingImages.map(async (item) => {
//       // Heuristic: if item starts with 'http', treat as URL; otherwise upload as base64
//       if (typeof item === "string" && item.startsWith("http")) {
//         return item;
//       } else {
//         // Assume it's a base64 image string
//         const result = await Cloudinary.uploadToCloudinary(item, "products");
//         return result.secure_url;
//       }
//     });

//     const finalImages = await Promise.all(uploadPromises);

//     const finalData: any = {
//       ...validatedData,
//       image: finalImages,
//     };

//     await product.update(finalData);
//     return apiResponse(res, 201, ProductMessages.UPDATED, product);
//   } catch (error: any) {
//     handleError(res, error);
//   }
// };


export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return apiResponse(res, 404, ProductMessages.NOT_FOUND);
    }

    const {
      // ledColors,
      // bodyColors,
      // watts,
      // reflectors,
      images,
      variants,
      attributeDiscounts,
      ...rest
    } = req.body;

    const parseField = (field: any) =>
      typeof field === "string" ? JSON.parse(field) : field;

    const dataWithCorrectTypes = {
      ...rest,
      // ...(ledColors && { ledColors: parseField(ledColors) }),
      // ...(bodyColors && { bodyColors: parseField(bodyColors) }),
      // ...(watts && { watts: parseField(watts) }),
      // ...(reflectors && { reflectors: parseField(reflectors) }),
    };

    // const validatedData = UpdateProductSchema.parse(dataWithCorrectTypes);

    // Handle images
    let incomingImages: string[] = [];
    if (Array.isArray(images)) {
      incomingImages = images;
    } else if (typeof images === "string") {
      try {
        incomingImages = JSON.parse(images);
      } catch {
        incomingImages = [images];
      }
    } else if (product.image && Array.isArray(product.image)) {
      incomingImages = product.image;
    }

    if (incomingImages.length > 6) {
      incomingImages = incomingImages.slice(0, 6);
    }

    const uploadPromises = incomingImages.map(async (item) => {
      if (typeof item === "string" && item.startsWith("http")) {
        return item;
      } else {
        const result = await Cloudinary.uploadToCloudinary(item, "products");
        return result.secure_url;
      }
    });

    const finalImages = await Promise.all(uploadPromises);

    // Update product itself
    await product.update({
      ...dataWithCorrectTypes,
      image: finalImages,
    });

    // 🔹 Update Product Variants (replace old with new)
    if (variants) {
      const parsedVariants = parseField(variants);

      await ProductVariant.destroy({ where: { productId: product.id } });

      if (Array.isArray(parsedVariants) && parsedVariants.length > 0) {
        await ProductVariant.bulkCreate(
          parsedVariants.map((variant: any) => ({
            productId: product.id,
            ledColor: variant.ledColor || null,
            bodyColor: variant.bodyColor || null,
            watts: variant.watts || null,
            reflector: variant.reflector || null,
            stock: variant.stock || 0,
          }))
        );
      }
    }

    // 🔹 Update Attribute Discounts (replace old with new)
    if (attributeDiscounts) {
      const parsedDiscounts = parseField(attributeDiscounts);

      await ProductAttributeDiscount.destroy({ where: { productId: product.id } });

      await ProductAttributeDiscount.create({
        productId: product.id,
        ledColor: parsedDiscounts.ledColor || null,
        bodyColor: parsedDiscounts.bodyColor || null,
        watts: parsedDiscounts.watts || null,
        reflector: parsedDiscounts.reflector || null,
      });
    }

    return apiResponse(res, 200, ProductMessages.UPDATED, product);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const getAllQuantities = async (req: Request, res: Response) => {
  try {
    const quantities = await Quantity.findAll();
    if (!quantities) {
      apiResponse(res, 404, QuantityMessages.NOT_FOUND);
    }

    apiResponse(res, 200, QuantityMessages.FETCHED, quantities);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const getProductWithOutPagination = async (req: any, res: Response) => {
  try {
    const { search = "", userId } = req.query;

    const whereCondition: any = {
      isDeleted: false,
      ...(search && {
        [Op.or]: [
          { productName: { [Op.iLike]: `%${search}%` } },
          // Add more searchable fields here if needed
        ],
      }),
    };

    const products = await Product.findAll({ where: whereCondition });

    let user: any = null;
    let isDealer = false;
    let userDiscount = 0;

    if (userId) {
      user = await User.findByPk(userId);
      isDealer = user?.dataValues?.role === "dealer";
      userDiscount = isDealer && user?.dataValues?.discount
        ? parseFloat(user.dataValues.discount)
        : 0;
    }

    const formattedProducts = products.map((product: any) => {
      const prod = product.toJSON();
      const price = parseFloat(prod.productPrice);

      const afterDiscountPrice = userDiscount
        ? price - (price * userDiscount) / 100
        : price;

      return {
        ...prod,
        price: Math.round(price * 100) / 100,
        afterDiscountPrice: Math.round(afterDiscountPrice * 100) / 100,
      };
    });

    return apiResponse(res, 200, ProductMessages.FETCHED, formattedProducts);
  } catch (error: any) {
    handleError(res, error);
  }
};
