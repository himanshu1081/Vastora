import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { deleteVideo, getVideos, publishedToggle, updateVideo, videoUpload, watchVideo, videoDetails } from "../controllers/video.controller.js";
import checkOwner from "../middlewares/checkOwner.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

const routerVideo = Router();

routerVideo.route("/upload").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        }
        , {
            name: "thumbnail",
            maxCount: 1
        }
    ])
    , verifyJWT, videoUpload);

routerVideo.route("/is-published/:videoId").patch(verifyJWT, checkOwner, publishedToggle);
routerVideo.route("/").get(getVideos);
routerVideo.route("/my-videos").get(verifyJWT, getVideos);
routerVideo.route("/del-video/:videoId").delete(verifyJWT, checkOwner, deleteVideo);
routerVideo.route("/update-video/:videoId").patch(verifyJWT, upload.single("thumbnail"), checkOwner, updateVideo);
routerVideo.route("/watch/:videoId").get(optionalAuth, watchVideo);
routerVideo.route("/video-info/:videoId").get(verifyJWT, videoDetails);



export default routerVideo;