import * as yup from "yup";

const orderSchema = yup.object().shape({
  userId: yup.string().required("Customer Name is required"),
  shippingAddress: yup.string().required("Shipping address is required"),
  // expectedDate: yup.string().test("is-date", "Invalid date format", (value) => {
  //   if (!value) return false;
  //   return !isNaN(Date.parse(value));
  // }),
  totalAmount: yup
    .number()
    .min(1, "Total amount must be greater than 0")
    .required("Total amount is required"),
  totalItems: yup
    .number()
    .min(1, "At least one item is required")
    .required("Total items is required"),
});

export default orderSchema;
