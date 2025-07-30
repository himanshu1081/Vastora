import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js'
import sidebarReducer from '../features/sidebarSlice.js'
import registerReducer from '../features/registeredSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        sidebar: sidebarReducer,
        register : registerReducer
    },
});