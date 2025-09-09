import {
  changePasswordProps,
  editProfileProps,
  forgotPasswordProps,
  loginDetailProps,
} from './types';

export const loginValues: loginDetailProps = {
  email: '',
  password: '',
};
export const forgotPasswordValues: forgotPasswordProps = {
  email: '',
};
export const changePasswordValues: changePasswordProps = {
  password: '',
  confirmPassword: '',
};
export const editProfileValues: editProfileProps = {
  firstName: '',
  lastName: '',
  email: '',
  gender: '',
  phone: '',
};
