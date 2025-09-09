import * as yup from "yup";

const addressSchema = yup.object().shape({
  street: yup
    .string()
    .required("Street is required")
    .min(5, "Street must be at least 5 characters")
    .max(100, "Street cannot exceed 100 characters"),
  city: yup
    .string()
    .required("City is required")
    .min(2, "City must be at least 2 characters")
    .max(50, "City cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s\-']+$/, "City can only contain letters and hyphens"),
  state: yup
    .string()
    .required("State is required")
    .min(2, "State must be at least 2 characters")
    .max(50, "State cannot exceed 50 characters"),
  country: yup
    .string()
    .required("Country is required")
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country cannot exceed 50 characters"),
  zipCode: yup
    .string()
    .required("Zip code is required")
    .matches(/^[0-9\-]+$/, "Zip code can only contain numbers and hyphens")
    .test(
      "zip-length",
      "Zip code must be between 4 and 10 characters",
      (val) =>
        val &&
        val.replace(/\D/g, "").length >= 4 &&
        val.replace(/\D/g, "").length <= 10
    ),
});

export default addressSchema;
