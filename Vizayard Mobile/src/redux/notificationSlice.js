import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  fcmToken: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
  },
});

export const { setFcmToken } = notificationSlice.actions;
export default notificationSlice.reducer;
