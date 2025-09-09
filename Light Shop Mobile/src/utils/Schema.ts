import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    // .min(8, 'Password must be at least 8 characters')
    // .matches(/[0-9]/, 'Password must contain at least one number')
    // .matches(
    //   /[!@#$%^&*]/,
    //   'Password must contain at least one special character',
    // )
    // .matches(
    //   /(?=.*[A-Z])/,
    //   'Password must contain at least one uppercase letter',
    // )
    // .matches(
    //   /(?=.*[a-z])/,
    //   'Password must contain at least one lowercase letter',
    // )

    .required('Password is required'),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});
export const changePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*]/,
      'Password must contain at least one special character',
    )
    .matches(
      /(?=.*[A-Z])/,
      'Password must contain at least one uppercase letter',
    )
    .matches(
      /(?=.*[a-z])/,
      'Password must contain at least one lowercase letter',
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const editProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'Too short'),
  lastName: Yup.string().required('Last name is required').min(2, 'Too short'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  gender: Yup.object({
    label: Yup.string().required(),
    value: Yup.string()
      .oneOf(['Male', 'Female', 'Other'], 'Select a valid gender')
      .required('Gender is required'),
  }).required('Gender is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
});
