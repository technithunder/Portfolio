import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getAllProScoreEmployees = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreEmployee/GetAllProScoreEmployees`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getProScoreEmployees = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreEmployee/GetProScoreEmployee`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addEmployee = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreEmployee/AddProScoreEmployee`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const UpdateEmployee = async (payload) => {
  let result;
  console.log(payload);
  try {
    result = await axiosInstance.post(
      `/api/ProScoreEmployee/UpdateProScoreEmployee`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteProScoreEmployees = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/ProScoreEmployee/DeleteProScoreEmployee`,
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

export const getAllLanguageType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/LanguageType/GetAllLanguageType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllManagerType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/DropDown/GetAllEmployees`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllNotificationType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/NotificationType/GetAllNotificationType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllEmployeeStatus = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmployeeStatusType/GetAllEmployeeStatusType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllEmployeeTerm = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmploymentTermType/GetAllEmploymentTermType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllFringePaymentMethod = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/FringePaymentMethodType/GetAllFringePaymentMethodType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getUserNameCheck = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreEmployee/CheckProScoreEmployeeUserNameCheck?userName=${payload?.userName}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

// apprentice info dropdowns

export const getAllEthnicityTypes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/DropDown/GetAllEthnicityTypes`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllVeteranStatusTypes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/DropDown/GetAllVeteranStatusTypes`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllRaceTypes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/DropDown/GetAllRaceTypes`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllEducationLevelTypes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/DropDown/GetAllEducationLevelTypes`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllDisabilityTypes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/DropDown/GetAllDisabilityTypes`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllRAPInfo = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/DropDown/GetAllRAPInfo`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllApprenticeStatusTypes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/DropDown/GetAllApprenticeStatusTypes`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllCareerConnectionTypes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/DropDown/GetAllCareerConnectionTypes`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
