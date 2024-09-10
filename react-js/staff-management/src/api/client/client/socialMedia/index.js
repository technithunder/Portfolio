import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const addClientSocialMedia = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `api/ClientSocialMedia/AddClientSocialMedia`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllClientSocialMedia = async (payload, clientId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientSocialMedia/GetAllClientSocialMedia?clientId=${clientId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const singleClientSocialMedia = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientSocialMedia/GetClientSocialMedia`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const editClientSocialMedia = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientSocialMedia/UpdateClientSocialMedia`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteClientSocialMedia = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/ClientSocialMedia/DeleteClientSocialMedia`,
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

export const getAllSocialMediaType = async (payload) => {
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
