import * as yup from "yup";

const dealerSchema = yup.object().shape({
  image: yup
    .mixed()
    .required("Image is required")
    .test("fileSize", "Image size must be less than 10MB", (value) => {
      if (typeof value === "string") return true;
      return !value || (value && value.size <= 10000000);
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (typeof value === "string") return true;
      return (
        !value ||
        (value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
      );
    }),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  discount: yup.string().required("Discount is required"),
  mobileNumber: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  dob: yup
    .string()
    .required("Date of birth is required")
    .test("is-date", "Invalid date format", (value) => {
      if (!value) return false;
      return !isNaN(Date.parse(value));
    }),
  maritalStatus: yup.string().required("Marital status is required"),
  gender: yup.string().required("Gender is required"),
  nationality: yup.string().required("Nationality is required"),
  address: yup
    .array()
    .of(
      yup.object().shape({
        street: yup.string().required("Street address is required"),
        city: yup.string().required("City is required"),
        state: yup.string().required("State is required"),
        country: yup.string().required("Country is required"),
        zipCode: yup
          .string()
          .required("Zip Code is required")
          .matches(/^[0-9]+$/, "Must be only digits")
          .min(3, "Must be at least 3 digits")
          .max(6, "Must be at most 6 digits"),
      })
    )
    .min(1, "At least one address is required"),
  joiningDate: yup
    .string()
    .required("Joining Date is required")
    .test("is-date", "Invalid date format", (value) => {
      if (!value) return false;
      return !isNaN(Date.parse(value));
    }),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .positive("Age must be a positive number")
    .integer("Age must be a whole number"),
  role: yup.string().required("Role is required"),
  status: yup.string().required("Status is required"),
  panCardNumber: yup
    .string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN card format")
    .nullable(),
  bankName: yup
    .string()
    .max(100, "Bank name must be less than 100 characters")
    .nullable(),
  accountNumber: yup
    .string()
    .matches(/^[0-9]{9,18}$/, "Account number must be 9-18 digits")
    .nullable(),
  bankBranchName: yup
    .string()
    .max(100, "Branch name must be less than 100 characters")
    .nullable(),
  ifscCode: yup
    .string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
    .nullable(),
  gstNumber: yup
    .string()
    .nullable()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST Number format"
    )
    .notRequired(),
  companyName: yup
    .string()
    .nullable()
    .max(150, "Company Name must be less than 150 characters")
    .notRequired(),
});

export default dealerSchema;
