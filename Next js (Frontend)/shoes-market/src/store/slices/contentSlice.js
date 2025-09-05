import { createSlice } from "@reduxjs/toolkit";

const contentSlice = createSlice({
  name: "content",
  initialState: {
    content: "",
    currency: "",
    brand_data: ""
  },
  reducers: {
    updateContent: (state, action) => {
      state.content = {...state.content, ...action.payload}
    },
    updateCurrency: (state, action) => {
      state.currency = action.payload
    },
    updateBrandData: (state, action) => {
      state.brand_data = {...state.content, ...action.payload}
    }
  },
});

export const {updateContent, updateCurrency, updateBrandData} = contentSlice.actions
export default contentSlice.reducer