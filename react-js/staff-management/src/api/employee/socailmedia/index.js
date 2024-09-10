import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getAllEmployeeocialMedia = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreEmployeeSocialMedia/GetAllProScoreEmployeeSocialMedia?employeeId=${payload?.id}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addEmployeeocialMedia = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreEmployeeSocialMedia/AddProScoreEmployeeSocialMedia`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteEmployeeSocialMedia = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/ProScoreEmployeeSocialMedia/DeleteProScoreEmployeeSocialMedia`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        data: payload
      }
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getEmployeeocialMediaType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/SocialMedia/GetAllSocialMediaByClient`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getEmployeeocialMedia = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreEmployeeSocialMedia/GetProScoreEmployeeSocialMedia`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateEmployeeocialMedia = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreEmployeeSocialMedia/UpdateProScoreEmployeeSocialMedia`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
