import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import doExist from "../utils/doExist.js";


const checkOwner = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(400, "User not logged in!");
    }
    const videoId = req.params.videoId;
    const videoInfo = await doExist(videoId);

    if (!videoInfo.owner.equals(userId)) {
        throw new ApiError(403, "Video owner mismatch")
    }
    req.video = videoInfo;
    next();
})

export default checkOwner;