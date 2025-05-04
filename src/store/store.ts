import { configureStore, combineReducers } from '@reduxjs/toolkit';
import leadsReducer from '../features/leads/leadsSlice';
import authReducer from '../features/auth/authSlice';
import purchaseReducer from '../features/purchase/purchaseSlice';
import salesReducer from '../features/sales/salesSlice';

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

const rootReducer = combineReducers({
  leads: leadsReducer,
  auth: authReducer,
  purchase: purchaseReducer,
  sales: salesReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'purchase', 'sales'], // ✅ leads رو از whitelist حذف کردم
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
