import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { deleteVideo, getVideos, publishedToggle, updateVideo, videoUpload, watchVideo } from "../controllers/video.controller.js";
import checkOwner from "../middlewares/checkOwner.middleware.js";

const routerVideo = Router();

routerVideo.route("/upload-video").post(
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
routerVideo.route("/videos").get(verifyJWT, getVideos);
routerVideo.route("/del-video/:videoId").delete(verifyJWT, checkOwner, deleteVideo);
routerVideo.route("/update-video").patch(verifyJWT, checkOwner, updateVideo);
routerVideo.route("/watch/:videoId").patch(watchVideo);


export default routerVideo;