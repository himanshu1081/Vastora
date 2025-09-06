import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  isLoggedIn: false,
  userData: null,
  token: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload.userData;
      state.token = action.payload.token;

      localStorage.setItem("accessToken", action.payload.token);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
      state.token = null;
      
      localStorage.removeItem("accessToken");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
