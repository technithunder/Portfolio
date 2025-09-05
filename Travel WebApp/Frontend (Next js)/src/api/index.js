import { paginationClasses } from '@mui/material';
import axiosInstance from './interceptor';

export const loginApi = async (payload) => {
    const res = await axiosInstance.post('/auth/login-user', payload);
    return res;
};

export const verifyOtp = async payload => {

    const res = await axiosInstance.post('/auth/verify-otp', payload);
    return res
};

export const resendOtp = async payload => {
    let result;
    try {
        result = await axiosInstance.post('/auth/resend-otp', payload);
    } catch (e) {
        result = e;
    }
    return result;
};

export const updateUser = async (query, payload) => {
    let result;
    try {
        result = await axiosInstance.patch(
            `/auth/update-user?id=${query}`,
            payload,
        );
    } catch (e) {
        result = e;
    }
    return result;
};

export const getAllVisas = async ({ page = 1, limit = 10, query = "" }) => {
    try {
        const result = await axiosInstance.get('/visa/visa-list', {
            params: { page, limit, query },
        });
        return result.data;
    } catch (e) {
        console.error('Error fetching visas:', e);
        return { error: e.message || 'An error occurred' };
    }
};

export const getTrendingVisas = async () => {
    try {
        const response = await axiosInstance.get('/visa/trending-visa-list');
        return response.data;
    } catch (e) {
        console.error('Error fetching trending visas:', e);
        return { error: e.message || 'An error occurred' };
    }
};

export const getVisaInfo = async (id) => {
    try {
        const result = await axiosInstance.get(`/visa/get-visa/${id}`);
        return result.data;
    } catch (e) {
        console.error('Error fetching visas:', e);
        return { error: e.message || 'An error occurred' };
    }
};

export const getAllVisaApplication = async (status) => {
    try {
        const result = await axiosInstance.get(`/visaApplication/get-all-visa-application?status=${status}`);
        return result.data;
    } catch (e) {
        console.error('Error fetching visas:', e);
        return { error: e.message || 'An error occurred' };
    }
};


export const createVisaApplication = async (payload) => {
    const response = await axiosInstance.post(
        '/childUser/add-child',
        payload
    );
    return response.data;
};

export const getParticularVisaApplicantDetails = async (id) => {
    let result;
    try {
        result = await axiosInstance.get(`/visaApplication/get-visa-application/${id}`);
    } catch (error) {
        result = error;
    }
    return result;
};

export const createVisaAPI = async (payload) => {
    const response = await axiosInstance.post(
        '/visaApplication/create-visa-application',
        payload,
    );
    return response.data;
};

export const getAllVisaType = async () => {
    let result;
    try {
        result = await axiosInstance.get("/admin/visaType/get-all-visatype");
    } catch (e) {
        result = e;
    }
    return result;
};

export const getAllVisaCategory = async () => {
    let result;
    try {
        result = await axiosInstance.get("/admin/category/get-all-category");
    } catch (e) {
        result = e;
    }
    return result;
};

export const getAllChildUser = async (userId) => {
    let result;
    try {
        result = await axiosInstance.get(
            `/childUser/get-child-users?parentUserId=${userId}`,
        );
    } catch (e) {
        result = e;
    }
    return result;
}


export const getSingleChildUser = async userid => {
    let result;
    try {
        result = await axiosInstance.get(
            `/childUser/get-single-child-user?id=${userid}`,
        );
    } catch (e) {
        result = e;
    }
    return result;
};