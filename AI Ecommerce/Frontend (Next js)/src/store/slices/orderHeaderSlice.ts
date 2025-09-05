"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  delivery_date: "",
  deliveryMethod: "",
  po_number: "",
  order_message: "",
};

const orderHeaderSlice = createSlice({
  name: "orderHeader",
  initialState,
  reducers: {
    setOrderHeader: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearOrderHeader: () => initialState,
  },
});

export const { setOrderHeader, clearOrderHeader } = orderHeaderSlice.actions;
export default orderHeaderSlice.reducer;
