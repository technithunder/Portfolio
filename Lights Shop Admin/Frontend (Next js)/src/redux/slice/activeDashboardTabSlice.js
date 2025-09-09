import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTabKey: 1,
};

const dashboardTabSlice = createSlice({
  name: "dashboardTab",
  initialState,
  reducers: {
    manageActiveTab: (state, action) => {
      state.activeTabKey = action.payload;
    },
  },
});

export const { manageActiveTab } = dashboardTabSlice.actions;

export default dashboardTabSlice.reducer;
