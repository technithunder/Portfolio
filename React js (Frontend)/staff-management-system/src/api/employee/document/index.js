import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getAllEmployeeDocument = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmployeeDocument/GetAllEmployeeDocuments?employeeId=${payload?.id}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteEmployeeDocument = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/EmployeeDocument/DeleteEmployeeDocument`,
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

export const getAllEmployeeDocumentType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmploymentDocumentType/GetAllEmploymentDocumentTypes`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addEmployeeDocument = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmployeeDocument/AddEmployeeDocument`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getEmployeeDocument = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmployeeDocument/GetEmployeeDocument`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateEmployeeDocument = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmployeeDocument/UpdateEmployeeDocument`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
