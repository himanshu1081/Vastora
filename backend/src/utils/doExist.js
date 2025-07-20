import { Video } from "../models/videos.model.js";
import mongoose from "mongoose";
import ApiError from "./ApiError.js";

const doExist = async (videoId) => {
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const videoInfo = await Video.findById(videoId);
    if (!videoInfo) {
        throw new ApiError(404, "Video does not exist");
    }
    return videoInfo;
}
export default doExist;