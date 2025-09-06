import { createSlice } from "@reduxjs/toolkit";

const userData = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null;
const token = localStorage.getItem("accessToken")

const initialState = {
  isLoggedIn: !!token,
  userData: userData,
  token: token || null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload;
      state.token = action.payload.token;

      // localStorage.setItem("userData", JSON.stringify(action.payload.userData));
      // localStorage.setItem("accessToken", action.payload.token);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
      state.token = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData")
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
