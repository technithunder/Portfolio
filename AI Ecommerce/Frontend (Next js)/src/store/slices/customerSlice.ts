import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerDetails: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    selectCustomer: (state, action) => {
      state.customerDetails = action.payload;
    },
    removeCustomer: (state) => {
      state.customerDetails = null;
    },
  },
});

export const { selectCustomer, removeCustomer } = customerSlice.actions;
export default customerSlice.reducer;
