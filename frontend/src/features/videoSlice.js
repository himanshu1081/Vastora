import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videos: []
};

const videoSlice = createSlice({
    name: "videos",
    initialState,
    reducers: {
        storedVideos: (state, action) => {
            state.videos = action.payload;
        },
        deleteStoredVideos: (state) => {
            state.videos = [];
        }
    }
})

export const { storedVideos, deleteStoredVideos } = videoSlice.actions;
export default videoSlice.reducer