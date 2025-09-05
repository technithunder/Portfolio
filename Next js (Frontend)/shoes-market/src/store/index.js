import { combineReducers, configureStore } from "@reduxjs/toolkit";
import checkoutReducer from './slices/checkoutSlice'
import contentReducer from './slices/contentSlice'

// persistence 
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({ 
  checkout: checkoutReducer,
  content: contentReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// config the store
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
});

// export redux-persist
export const persistor = persistStore(store)
