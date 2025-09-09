import * as yup from "yup";

const leadSchema = yup.object().shape({
  customerName: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  mobileNumber: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  type: yup.string().required("Type is required"),
  followUpDate: yup
    .string()
    .required("Date is required")
    .test("is-date", "Invalid date format", (value) => {
      if (!value) return false;
      return !isNaN(Date.parse(value));
    }),
});

export default leadSchema;
