import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showSidebar: false
};

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        showSidebar: (state) => {
            state.showSidebar = true;
        },
        hideSidebar: (state) => {
            state.showSidebar = false;
        }
    }
})

export const { showSidebar, hideSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer