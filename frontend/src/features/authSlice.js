import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  isLoggedIn: false,
  userData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload;

    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;

    },
  },
});

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["isLoggedIn", "userData"],
};

export default persistReducer(persistConfig, authSlice.reducer);
export const { login, logout } = authSlice.actions;
