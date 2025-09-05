import axios from "axios"
import { toast } from "react-toastify";
import store from "@/redux/Store/store";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

axiosInstance.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem("token")
        const token = store.getState().user.user.token;
        if (
            config.data instanceof FormData ||
            config.headers['Content-Type'] === 'multipart/form-data'
        ) {
            delete config.headers['Content-Type'];
        } else {
            config.headers['Content-Type'] = 'application/json';
        }
        config.headers["Authorization"] = `Bearer ${token}`
        return config;
    },
    (error) => {
        toast.error("Request error!");
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        // if (response?.data?.message) {
        //     toast.success(response.data.message);
        // }
        return response;
    },
    (error) => {
        if (error.response) {
            const { message } = error.response.data.errorMessage || {};
            toast.error(error.response.data.errorMessage || "Something went wrong!");
        } else if (error.request) {
            toast.error("No response from server!");
        } else {
            toast.error("Request failed to send!");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;