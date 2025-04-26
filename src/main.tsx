import "./styles/fonts.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'inherit',
              direction: 'rtl',
              textAlign: 'right',
            },
          }}
        />
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);


