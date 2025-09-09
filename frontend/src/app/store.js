import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js'
import sidebarReducer from '../features/sidebarSlice.js'
import registerReducer from '../features/registeredSlice.js';

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "auth",
    storage,
};

const persistAuth = persistReducer(persistConfig, authReducer)

export const store = configureStore({
    reducer: {
        auth: persistAuth,
        sidebar: sidebarReducer,
        register: registerReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store)