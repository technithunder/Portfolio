import axiosInstance from "../interceptor";

export const getAllProvider = async (paginationParams = {}) => {
  try {
    return await axiosInstance.get("/admin/provider/list", {
      params: paginationParams,
    });
  } catch (error) {
    console.error("Error fetching clinical data:", error);
    throw error;
  }
};

export const getProviderSummary = async () => {
  let result;
  try {
    result = await axiosInstance.get("/admin/provider/summary");
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateProvider = async (clientId: string) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/provider/update/${clientId}?isactive=false`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const removeProvider = async (clientId: string) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/admin/provider/delete/${clientId}?isdelete=false`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleProviderInfo = async (providerId: string) => {
  let result;
  try {
    result = await axiosInstance.get(`/admin/provider/profile/${providerId}`);
  } catch (e) {
    result = e;
  }
  return result;
};
