import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProgressId: "",
};

const userProgessSlice = createSlice({
  name: "userProgress",
  initialState,
  reducers: {
    setUserProgressId: (state, action) => {
      state.userProgressId = action.payload;
    },
    resetUserProgressId: () => initialState,
  },
});

export const { setUserProgressId, resetUserProgressId } = userProgessSlice.actions;

export default userProgessSlice.reducer;
