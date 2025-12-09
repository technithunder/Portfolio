import axiosInstance from "../interceptor";

export const getAllUsers = async (paginationParams = {}) => {
  let result;
  try {
    result = await axiosInstance.get("/admin/clients/list", {
      params: paginationParams,
    });
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleUserInfo = async (clientId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/clients/profile/${clientId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateUserInfo = async (clientId: string) => {
  let result;
  try {
    result = await axiosInstance.put(`/admin/clients/update/${clientId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const removeUSerInfo = async (clientId: string) => {
  let result;
  try {
    result = await axiosInstance.put(`/admin/clients/delete/${clientId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getUserSummary = async () => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/clients/summary`);
  } catch (e) {
    result = e;
  }
  return result;
};
