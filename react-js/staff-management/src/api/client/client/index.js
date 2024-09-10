import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const addClient = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreClient/AddProScoreClient`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllClient = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreClient/GetAllProScoreClients`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const singleClient = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreClient/GetProScoreClient`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const editClient = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreClient/UpdateProScoreClient`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteClient = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/ProScoreClient/DeleteProScoreClient`,
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

export const clientName = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreClient/CheckProScoreClientCompanyName?prosScoreClientCompanyName=${payload}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllClientType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientType/GetAllClientTypes`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllStates = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/DropDown/GetAllStates`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};
