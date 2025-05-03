import { configureStore, combineReducers } from '@reduxjs/toolkit';
import leadsReducer from '../features/leads/leadsSlice';
import authReducer from '../features/auth/authSlice'; // 👈 اضافه کن
import purchaseReducer from '../features/purchase/purchaseSlice'; // 👈 اینو اضافه کن
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
  auth: authReducer, // 👈 اینجا اضافه کن
  purchase: purchaseReducer,
  sales: salesReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['leads', 'auth', 'purchase', 'sales'], // 👈 اینجا هم auth رو اضافه کن
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
