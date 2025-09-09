export interface loginDetailProps {
  email: string;
  password: string;
}
export interface forgotPasswordProps {
  email: string;
}
export interface changePasswordProps {
  password: string;
  confirmPassword: string;
}
export interface editProfileProps {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
}
