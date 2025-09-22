import Cookies from "js-cookie";
import { persistor } from "../app/store.js";   
import { logout } from "../features/authSlice"; 

export const checkAuthOnLoad = (store) => {
  const token = Cookies.get("accessToken");

  if (!token) {
    store.dispatch(logout());
    persistor.purge(); /
  }
};
