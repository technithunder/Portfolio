import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productDetails: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
    clearProductDetails: (state) => {
      state.productDetails = null;
    },
  },
});

export const { setProductDetails, clearProductDetails } = productSlice.actions;

export default productSlice.reducer;
