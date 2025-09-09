import axios from 'axios';
import Toast from 'react-native-toast-message';
import {verticalScale} from 'react-native-size-matters';
import {IS_IOS} from '../utils/helper';
import store from '../redux/store';

const axiosInstanceApi = axios.create({
  // baseURL: `http://192.168.1.16:5000/api`,
  // baseURL: `http://89.116.34.232:5000/api`,
  // baseURL: 'http://192.168.1.11:5000/api',
  // baseURL:'http://192.168.1.18:5000/api',
  baseURL:`${process.env.API_URL}/api`
});

axiosInstanceApi.interceptors.request.use(
  async config => {
    const token = store.getState().main.userToken;
    const fcmToken = store.getState().notification.fcmToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('token', token);
    }
    if (fcmToken) {
      config.headers['fcmtoken'] = fcmToken;
    }
    config.headers['devicetype'] = 'mobile';
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    console.log('====================================>');
    console.log(config, 'config');
    console.log('====================================>');
    console.log(config.data, 'config data');
    console.log('====================================>');

    return config;
  },
  error => Promise.reject(error),
);

axiosInstanceApi.interceptors.response.use(
  response => {
    console.log('====================================>');
    console.log(response, 'response');
    console.log('====================================>');

    return response;
  },
  error => {
    let errorMessage = '';

    if (error.response) {
      // Server responded with an error
      errorMessage =
        error.response?.data?.errorMessage ||
        error.response?.data?.message ||
        errorMessage;
    } else if (error.request) {
      // No response from server
      errorMessage =
        error.response?.data?.errorMessage ||
        error.response?.data?.message ||
        errorMessage;
    } else {
      // Other errors
      errorMessage = error.message || error;
    }
    console.log('====================================>');
    console.log(error.response?.data, 'error message');
    console.log('====================================>');

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: errorMessage,
      topOffset: verticalScale(IS_IOS ? 60 : 40),
    });

    return Promise.reject(error);
  },
);

export default axiosInstanceApi;
