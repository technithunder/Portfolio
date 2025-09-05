import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  guid: [],
  items: [],
  totalAmount: 0,
  totalQuantity: 0,
  currentOrderId: '',
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setGuidId(state, action) {
      const newGuid = action.payload;

      if (!state.guid) {
        state.guid = [];
      }
    
      if (state.guid.length === 0 || !state.guid.some(g => g.customerId === newGuid.customerId)) {
        state.guid.push(newGuid);
      }
    },
    removeGuiId(state, action) {
      const customerId = action.payload;
      state.guid = state.guid.filter(g => g.customerId !== customerId);
    },
    upsertCartItem(state, action) {
      const { item, quantity } = action.payload;
      const existingItem = state.items.find(
        (cartItem) => cartItem.id === item.id
      );

      if (!existingItem) {
        state.items.push({
          ...item,
          quantity,
        });
        state.totalQuantity += quantity;
        state.totalAmount += item.price * quantity;
      } else {
        const quantityDifference = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        state.totalQuantity += quantityDifference;
        state.totalAmount += item.price * quantityDifference;
      }
    },

    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter((item) => item.id !== id);
      }
    },

    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      state.guid = [];
    },
    setCurrentOrderId(state, action) {
      state.currentOrderId = action.payload;
    },
    removeCurrentOrderId(state) {
      state.currentOrderId = '';
    },
    updateUmid(state, action) {
      const { id, umid } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.umid = umid;
      }
    },
  },
});

export const { upsertCartItem, removeFromCart, clearCart, setGuidId,removeGuiId, setCurrentOrderId, removeCurrentOrderId,updateUmid } =
  cartSlice.actions;
export default cartSlice.reducer;
