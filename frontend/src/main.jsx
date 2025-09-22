import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { store,persistor } from './app/store.js'
import { Provider } from 'react-redux'
import App from './App.jsx'
import './index.css';
import { checkAuthOnLoad } from "../src/util/checkAuthOnLoad.js"
import { PersistGate } from "redux-persist/integration/react";

checkAuthOnLoad(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider >
  </StrictMode>,
)
