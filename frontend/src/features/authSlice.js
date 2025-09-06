import { createSlice } from "@reduxjs/toolkit";

const userData = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null;

const initialState = {
  isLoggedIn: !!userData,
  userData: userData || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload;

      localStorage.setItem("userData", JSON.stringify(action.payload.userData));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;

      localStorage.removeItem("userData")
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
