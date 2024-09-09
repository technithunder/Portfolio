import { createSlice } from "@reduxjs/toolkit";

const checkoutDetailSlice = createSlice({
  name: "checkout",
  initialState: {
    details: {},
  },
  reducers: {
    updateCheckoutDetails: (state, action) => {
      state.details = {...state.details, ...action.payload}
    }
  },
});

export const {updateCheckoutDetails} = checkoutDetailSlice.actions
export default checkoutDetailSlice.reducer