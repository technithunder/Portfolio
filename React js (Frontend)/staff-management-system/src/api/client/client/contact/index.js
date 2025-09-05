import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const addContact = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientContact/AddClientContact`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllContact = async (payload, clientId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientContact/GetAllClientContacts?clientId=${clientId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const singleContact = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientContact/GetClientContact`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const editContact = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientContact/UpdateClientContact`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteContact = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/ClientContact/DeleteClientContact`,
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

export const getAllContactType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ContactType/GetAllContactTypes`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
