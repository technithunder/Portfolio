import * as Yup from 'yup';

export const userDetailSchema = Yup.object().shape({
  userName: Yup.string().required('Name is required'),
  userPhone: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
    .required('Phone number is required'),
    description: Yup.string().nullable(),
  userEmail: Yup.string().email('Invalid email').required('Email is required'),
});
