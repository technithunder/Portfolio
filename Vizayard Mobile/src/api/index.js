import {END_POINTS} from './endpoint';
import axiosInstanceApi from './Interceptor';

export const loginApi = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post('/auth/login-user', payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const verifyOtp = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post('/auth/verify-otp', payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const resendOtp = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post('/auth/resend-otp', payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateUser = async (query, payload, token) => {
  let result;
  try {
    result = await axiosInstanceApi.patch(
      `/auth/update-user?id=${query}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Replace `token` with your actual token variable
        },
      },
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllVisas = async (query = '', page) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/visa/visa-list${query && `?query=${query}`}${
        query ? '&' : '?'
      }page=${page}&limit=6`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getTrendingNowCountry = async () => {
  let result;
  try {
    result = await axiosInstanceApi.get(END_POINTS.TRENDING_NOW);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleVisa = async visaID => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/visa/get-visa/${visaID}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const createVisaAPI = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(
      `/visaApplication/create-visa-application`,
      payload,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllVisaApplications = async (parentUserId, page, status) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/visaApplication/get-all-visa-application?parentUserId=${parentUserId}&page=${page}&limit=10&status=${status}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllVisaType = async () => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/admin/visaType/get-all-visatype`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllVisaCategory = async () => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/admin/category/get-all-category`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const createChildUser = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/childUser/add-child`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const createVisaApplication = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.put(`/visaApplication/apply-visa`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllChildUser = async paranetUserID => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/childUser/get-child-users?parentUserId=${paranetUserID}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleChildUser = async paranetUserID => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/childUser/get-single-child-user?id=${paranetUserID}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteChildUser = async childUserId => {
  let result;
  try {
    result = await axiosInstanceApi.delete(
      `/childUser/delete-child-user?id=${childUserId}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAvailableSlots = async date => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/scheduled-call/available-slots?date=${date}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const bookAvailableSlots = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/scheduled-call/book`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const paymentCreateApi = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/payment/create`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const paymentVerifyApi = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.patch(`/payment/update`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllScheduledCall = async userId => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/scheduled-call/user-calls?userId=${userId}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const editScheduleCall = async (id, data) => {
  let result;
  try {
    result = await axiosInstanceApi.put(`/scheduled-call/${id}`, data);
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteScheduledCall = async id => {
  let result;
  try {
    result = await axiosInstanceApi.delete(`/scheduled-call/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleVisaApplication = async id => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/visaApplication/get-visa-application/${id}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const scheduledCallCreatePaymentApi = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(
      `/payment/schedule-call/create`,
      payload,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const scheduledCallPaymentVerify = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.patch(
      `/payment/schedule-call/update`,
      payload,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllTrendingVideosApi = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/video-asset/list`,
      payload,
    );
  } catch (e) {
    result = e;
  }
  return result;
};
