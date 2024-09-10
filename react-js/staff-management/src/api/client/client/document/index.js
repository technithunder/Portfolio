import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const addDocument = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientDocument/AddClientDocument`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllDocument = async (payload, clientId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientDocument/GetAllClientDocuments?clientId=${clientId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const singleDocument = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientDocument/GetClientDocument`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const editDocument = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientDocument/UpdateClientDocument`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteDocument = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/ClientDocument/DeleteClientDocument`,
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

export const getAllDocumentType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientDocumentType/GetAllClientDocumentTypes`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
