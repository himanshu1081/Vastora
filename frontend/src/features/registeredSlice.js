import { createSlice, isRejected } from "@reduxjs/toolkit";

const initialState = {
    isRegistered: false
}

const registeredSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        registerDone: (state) => {
            state.isRegistered = true
        }
    }
})

export const {registerDone}=registeredSlice.actions;
export default registeredSlice.reducer;