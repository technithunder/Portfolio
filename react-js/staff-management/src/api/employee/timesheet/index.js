import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getAllEmployeeTimeSheet = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmployeeTimesheet/GetAllEmployeeTimesheet?employeeId=${payload?.id}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteEmployeeTimeSheet = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/EmployeeTimesheet/DeleteEmployeeTimesheet`,
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

export const getAllProjects = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/Project/GetAllProject`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllReasonType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/TimeEntryReasonType/GetAllTimeEntryReasonType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addTimeSheet = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmployeeTimesheet/AddEmployeeTimesheet`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getEmployeeTimeSheet = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmployeeTimesheet/GetEmployeeTimesheet`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateEmployeeTimeSheet = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmployeeTimesheet/UpdateEmployeeTimesheet`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
