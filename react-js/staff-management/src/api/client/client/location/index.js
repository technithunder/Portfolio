import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const addClientLocation = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientLocation/AddClientLocation`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllClientLocation = async (payload, clientId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientLocation/GetAllClientLocations?clientId=${clientId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const singleClientLocation = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientLocation/GetClientLocation`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const editClientLocation = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientLocation/UpdateClientLocation`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteClientLocation = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/ClientLocation/DeleteClientLocation`,
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
