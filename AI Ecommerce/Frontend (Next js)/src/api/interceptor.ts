import axios from "axios";
import store from "store";

const axiosInstanceApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
});

axiosInstanceApi.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, message } = error;

    const { status, data } = response || {};
    let errorMessage = data?.message || "Something went wrong.";

    switch (status) {
      case 400:
        console.error("Bad Request:", errorMessage);
        break;
      case 401:
        console.error("Unauthorized:", errorMessage);
        break;
      case 403:
        console.error("Forbidden:", errorMessage);
        break;
      case 404:
        console.error("Not Found:", errorMessage);
        break;
      case 500:
        console.error("Internal Server Error:", errorMessage);
        break;
      default:
        console.error("API Error:", errorMessage);
        break;
    }

    return Promise.reject({ status, message: errorMessage });
  }
);

export default axiosInstanceApi;
