import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";

import visaApplicationReducer from '../Slice/VisaApplicationslice';
import userReducer from '../Slice/UserSlice';

// Configure persist options
const persistConfig = {
    key: "root",
    storage,
};

// Combine your reducers
const rootReducer = combineReducers({
    visaApplication: visaApplicationReducer,
    user: userReducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
const store = configureStore({
    reducer: persistedReducer,
});

// Create persistor
export const persistor = persistStore(store);
export default store;