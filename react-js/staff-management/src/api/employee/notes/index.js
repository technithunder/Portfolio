import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getAllEmployeeNote = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmployeeNote/GetAllEmployeeNotes?employeeId=${payload?.id}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteEmployeeNote = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/EmployeeNote/DeleteEmployeeNote`,
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

export const getEmployeeNoteType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/NoteType/GetAllNoteTypes`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const addEmployeeNoteType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmployeeNote/AddEmployeeNote`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getEmployeeNote = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmployeeNote/GetEmployeeNote`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateEmployeeNote = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmployeeNote/UpdateEmployeeNote`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
