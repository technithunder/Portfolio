import axios from 'axios';
import {IS_IOS} from '../utils/helper';
import Toast from 'react-native-toast-message';
import {verticalScale} from 'react-native-size-matters';
import {store} from '../redux';
import {logout} from '../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

console.log(process.env.API_URL, 'API URL from .env file');

const axiosInstanceApi = axios.create({
  // baseURL: 'http://192.168.1.41:5000/api',
  baseURL: `${API_URL}/api`,
});

axiosInstanceApi.interceptors.request.use(
  async config => {
    const token = store.getState().auth.user?.token;
    const fcmToken = store.getState().notification.fcmToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

    // Check if token is expired (401 Unauthorized)
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('user');
      store.dispatch(logout());

      // Show specific message for token expiry
      Toast.show({
        type: 'error',
        text1: 'Session Expired',
        text2: 'Please login again to continue',
        topOffset: verticalScale(IS_IOS ? 60 : 40),
      });

      return Promise.reject(error);
    }

    if (error.response) {
      // Server responded with an error
      errorMessage =
        error.response?.data?.errorMessage ||
        error.response?.data?.message ||
        'Something went wrong';
    } else if (error.request) {
      // No response from server
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // Other errors
      errorMessage = error?.message || 'Something went wrong';
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
