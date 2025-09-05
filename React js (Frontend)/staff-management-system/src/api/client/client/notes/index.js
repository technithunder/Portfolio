import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const addNotes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/ClientNote/AddClientNote`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllNotes = async (payload, clientId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientNote/GetAllClientNotes?clientId=${clientId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const singleNotes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/ClientNote/GetClientNote`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const editNotes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientNote/UpdateClientNote`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteNotes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(`/api/ClientNote/DeleteClientNote`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    });
  } catch (e) {
    result = e;
  }
  return result;
};
