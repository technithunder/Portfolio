import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  userInfo: null,
  fcmToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = action?.payload?.token ? true : false;
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
      state.fcmToken = null;
    },
    manageFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
  },
});

export const { login, logout, manageFcmToken } = authSlice.actions;

export default authSlice.reducer;
