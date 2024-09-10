import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const addClientNotes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/ClientNote/AddClientNote`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllClientNotes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientNote/GetAllClientNotes`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const singleClientNote = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/ClientNote/GetClientNote`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const editClientNote = async (payload) => {
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

export const deleteClientNote = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientNote/DeleteClientNote`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllNotesType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/NoteType/GetAllNoteTypes`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};
