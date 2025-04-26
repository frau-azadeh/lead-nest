// src/store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import leadsReducer from '../features/leads/leadsSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  leads: leadsReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['leads'], // فقط leads رو ذخیره میکنیم
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
