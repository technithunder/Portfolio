import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import authReducer from "./slices/authSlice";
import customerReducer from "./slices/customerSlice"; // Import customerReducer
import productReducer from "./slices/productSlice"; // Import customerReducer
import cartReducer from "./slices/cartSlice";
// store/index.ts
import orderHeaderReducer from "./slices/orderHeaderSlice";


// Combine Reducers
const rootReducer = combineReducers({
  auth: authReducer,
  customer: customerReducer,
  product: productReducer,
  cart: cartReducer,
  orderHeader: orderHeaderReducer,
});

// Redux Persist Config
const persistConfig = {
  key: "root", // Key for storage
  storage, // Use localStorage
  whitelist: ["auth", "customer", "product", "cart"], // Persist auth and customer state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store); // Persistor to rehydrate state
export default store;
