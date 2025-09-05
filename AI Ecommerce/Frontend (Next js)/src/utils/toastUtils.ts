import { toast } from "react-toastify";

export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
};
