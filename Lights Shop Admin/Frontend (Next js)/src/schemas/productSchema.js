import * as yup from "yup";

const productSchema = yup.object({
  productName: yup
    .string()
    .required("Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must not exceed 100 characters"),
  categoryId: yup.string().required("Product category is required"),
  productPrice: yup
    .number()
    .transform((value, originalValue) => {
      if (
        originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return undefined;
      }
      return Number(originalValue);
    })
    .required("Product price is required")
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least 0.01"),
  discount: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  discountPrice: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  productDescription: yup
    .string(),
    // .required("Product Description is required")
    // .min(10, "Description must be at least 10 characters")
    // .max(500, "Description must not exceed 500 characters"),
  image: yup
    .array()
    .of(yup.mixed())
    .min(1, "At least one product image is required")
    .max(5, "Maximum 5 image allowed"),
  addedStock: yup
    .number()
    .typeError("Added stock is required")
    .required("Added stock is required")
    .integer("Must be an integer")
    .min(0, "Cannot be negative"),
  // expiryDate: yup
  //   .string()
  //   .required("Expiry date is required")
  //   .test("is-date", "Invalid date format", (value) => {
  //     if (!value) return false;
  //     return !isNaN(Date.parse(value));
  //   }),
  openingStock: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  remainingStock: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  // ledColors: yup
  //   .array()
  //   .of(
  //     yup.object().shape({
  //       color: yup.string().required("Color is required"),
  //       discount: yup
  //         .number()
  //         .nullable()
  //         .transform((value, originalValue) =>
  //           originalValue === "" ? null : Number(originalValue)
  //         )
  //         .typeError("Discount must be a number")
  //         .required("Discount is required"),
  //     })
  //   )
  //   .min(1, "At least one Led Color is required"),
  // bodyColors: yup
  //   .array()
  //   .of(
  //     yup.object().shape({
  //       color: yup.string().required("Color is required"),
  //       discount: yup
  //         .number()
  //         .nullable()
  //         .transform((value, originalValue) =>
  //           originalValue === "" ? null : Number(originalValue)
  //         )
  //         .typeError("Discount must be a number")
  //         .required("Discount is required"),
  //     })
  //   )
  //   .required("Body Colors are required")
  //   .min(1, "At least one Body Color is required"),
  // watts: yup
  //   .array()
  //   .of(
  //     yup.object().shape({
  //       value: yup.string().required("Value is required"),
  //       discount: yup
  //         .number()
  //         .nullable()
  //         .transform((value, originalValue) =>
  //           originalValue === "" ? null : Number(originalValue)
  //         )
  //         .typeError("Discount must be a number")
  //         .required("Discount is required"),
  //     })
  //   )
  //   .required("Watts are required")
  //   .min(1, "At least one Watt is required"),
  // reflectors: yup
  //   .array()
  //   .of(
  //     yup.object().shape({
  //       color: yup.string().required("color is required"),
  //       discount: yup
  //         .number()
  //         .nullable()
  //         .transform((value, originalValue) =>
  //           originalValue === "" ? null : Number(originalValue)
  //         )
  //         .typeError("Discount must be a number")
  //         .required("Discount is required"),
  //     })
  //   )
  //   .required("Reflectors are required")
  //   .min(1, "At least one Reflector is required"),
});

export default productSchema;
