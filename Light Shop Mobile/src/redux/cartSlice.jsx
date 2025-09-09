import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  clearCartAPI,
  deleteCartProductApi,
  getAllCarts,
  updateCartAPI,
} from '../api';

// Thunks
export const fetchCart = createAsyncThunk('cart/fetch', async (_, thunkAPI) => {
  try {
    const response = await getAllCarts();
    return response?.data?.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

export const updateCart = createAsyncThunk(
  'cart/update',
  async (payload, thunkAPI) => {
    try {
      const response = await updateCartAPI(payload);
      
      const cartResponse = await getAllCarts();
      
      return {
        payload, 
        response: response.data,
        updatedCart: cartResponse?.data?.data
      };
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data || e.message);
    }
  },
);

export const deleteCartItem = createAsyncThunk(
  'cart/delete',
  async (productId, thunkAPI) => {
    try {
      const response = await deleteCartProductApi(productId);
      
      // After successful delete, fetch fresh cart data to get updated totals
      const cartResponse = await getAllCarts();
      
      return {
        productId, 
        response: response.data,
        updatedCart: cartResponse?.data?.data
      };
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data || e.message);
    }
  },
);

export const clearCart = createAsyncThunk('cart/clear', async (_, thunkAPI) => {
  try {
    const response = await clearCartAPI();
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || e.message);
  }
});

// Helper function to calculate total amount
const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => {
    const itemPrice = item.price || 0;
    const itemQuantity = item.quantity || 1;
    return total + (itemPrice * itemQuantity);
  }, 0);
};

// Helper function to calculate total items (count of unique items, not quantity)
const calculateTotalItems = (items) => {
  return items.length; // Just return the count of unique items
};

// Helper function to calculate total quantity (sum of all quantities)
const calculateTotalQuantity = (items) => {
  return items.reduce((total, item) => total + (item.quantity || 1), 0);
};

// Initial State
const initialState = {
  items: [],
  loading: false,
  selected: {}, // This should always start empty
  error: null,
  totalAmount: 0,
  totalItems: 0, // Count of unique items
  totalQuantity: 0, // Sum of all quantities
};

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleSelect(state, action) {
      const id = action.payload;
      state.selected[id] = !state.selected[id];
    },
    selectAll(state) {
      // Clear selected first, then select all current items
      state.selected = {};
      state.items.forEach(item => {
        state.selected[item.id] = true;
      });
    },
    deselectAll(state) {
      state.selected = {}; // Clear all selections
    },
    clearError(state) {
      state.error = null;
    },
    // Manual recalculation if needed
    recalculateTotals(state) {
      state.totalAmount = calculateTotalAmount(state.items);
      state.totalItems = calculateTotalItems(state.items);
      state.totalQuantity = calculateTotalQuantity(state.items);
    },
    // Optimistic update for immediate UI feedback
    updateCartItemQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        item => item.product?.id === productId || item.id === productId
      );
      
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = quantity;
        
        // Recalculate totals immediately
        state.totalAmount = calculateTotalAmount(state.items);
        state.totalItems = calculateTotalItems(state.items);
        state.totalQuantity = calculateTotalQuantity(state.items);
      }
    },
    // New action to clean selected items that don't exist in cart
    cleanSelectedItems(state) {
      const itemIds = state.items.map(item => item.id);
      const cleanSelected = {};
      
      // Only keep selected items that still exist in cart
      Object.keys(state.selected).forEach(id => {
        if (itemIds.includes(parseInt(id)) || itemIds.includes(id)) {
          cleanSelected[id] = state.selected[id];
        }
      });
      
      state.selected = cleanSelected;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
        
        // Use API totals if available, otherwise calculate
        state.totalAmount = action.payload?.totalAmount || calculateTotalAmount(state.items);
        state.totalItems = action.payload?.totalItems || calculateTotalItems(state.items);
        state.totalQuantity = action.payload?.totalQuantity || calculateTotalQuantity(state.items);
        
        // IMPORTANT: Clean selected items to remove any stale selections
        const itemIds = state.items.map(item => item.id);
        const cleanSelected = {};
        
        // Only keep selected items that still exist in the current cart
        Object.keys(state.selected).forEach(id => {
          if (itemIds.includes(parseInt(id)) || itemIds.includes(id)) {
            cleanSelected[id] = state.selected[id];
          }
        });
        
        state.selected = cleanSelected;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Cart - FIXED VERSION
      .addCase(updateCart.pending, (state, action) => {
        // Don't set loading to true for better UX - optimistic updates should already be applied
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        
        // If we have updated cart data from API, use it (most reliable)
        if (action.payload.updatedCart) {
          state.items = action.payload.updatedCart.items || [];
          state.totalAmount = action.payload.updatedCart.totalAmount || calculateTotalAmount(state.items);
          state.totalItems = action.payload.updatedCart.totalItems || calculateTotalItems(state.items);
          state.totalQuantity = action.payload.updatedCart.totalQuantity || calculateTotalQuantity(state.items);
        } else {
          // Fallback: update the specific item and recalculate
          const { payload } = action.payload;
          
          // Try multiple ways to find the item (different API structures)
          const itemIndex = state.items.findIndex(item => 
            item.product?.id === payload.productId || 
            item.id === payload.productId ||
            item.productId === payload.productId
          );
          
          if (itemIndex !== -1) {
            // Update quantity
            if (payload.quantity !== undefined) {
              state.items[itemIndex].quantity = payload.quantity;
            }
            
            // Update price if provided
            if (payload.price !== undefined) {
              state.items[itemIndex].price = payload.price;
            }
            
            // Recalculate totals
            state.totalAmount = calculateTotalAmount(state.items);
            state.totalItems = calculateTotalItems(state.items);
            state.totalQuantity = calculateTotalQuantity(state.items);
          }
        }
        
        // Clean selected items after update
        const itemIds = state.items.map(item => item.id);
        const cleanSelected = {};
        Object.keys(state.selected).forEach(id => {
          if (itemIds.includes(parseInt(id)) || itemIds.includes(id)) {
            cleanSelected[id] = state.selected[id];
          }
        });
        state.selected = cleanSelected;
        
        state.error = null;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        // On error, refetch cart to ensure consistency
        // Note: You might want to dispatch fetchCart() from your component on error
      })

      // Delete Cart Item
      .addCase(deleteCartItem.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        
        const { productId } = action.payload;
        
        // Remove from selected items FIRST
        delete state.selected[productId];
        
        // If we have updated cart data from API, use it
        if (action.payload.updatedCart) {
          state.items = action.payload.updatedCart.items || [];
          state.totalAmount = action.payload.updatedCart.totalAmount || calculateTotalAmount(state.items);
          state.totalItems = action.payload.updatedCart.totalItems || calculateTotalItems(state.items);
          state.totalQuantity = action.payload.updatedCart.totalQuantity || calculateTotalQuantity(state.items);
        } else {
          // Fallback: remove the item and recalculate
          state.items = state.items.filter(item => 
            item.product?.id !== productId && 
            item.id !== productId &&
            item.productId !== productId
          );
          
          // Recalculate totals
          state.totalAmount = calculateTotalAmount(state.items);
          state.totalItems = calculateTotalItems(state.items);
          state.totalQuantity = calculateTotalQuantity(state.items);
        }
        
        // Clean selected items to ensure consistency
        const itemIds = state.items.map(item => item.id);
        const cleanSelected = {};
        Object.keys(state.selected).forEach(id => {
          if (itemIds.includes(parseInt(id)) || itemIds.includes(id)) {
            cleanSelected[id] = state.selected[id];
          }
        });
        state.selected = cleanSelected;
        
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, state => {
        state.loading = false;
        state.items = [];
        state.selected = {}; // Clear all selections
        state.totalAmount = 0;
        state.totalItems = 0;
        state.totalQuantity = 0;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  toggleSelect, 
  selectAll, 
  deselectAll, 
  clearError, 
  recalculateTotals,
  updateCartItemQuantity,
  cleanSelectedItems
} = cartSlice.actions;

export default cartSlice.reducer;