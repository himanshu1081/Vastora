import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changePassword, currentUser, updateAvatar, updateCoverImage,getUserChannelProfile, getWatchHistory, updateDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const routerUser = Router();


routerUser.route("/register").post
    (upload.fields([
        {
            name: "coverImage",
            maxCount: 1
        },
        {
            name: "avatar",
            maxCount: 1
        }])
        ,
        registerUser);

routerUser.route("/login").post(loginUser);
routerUser.route("/logout").post(verifyJWT, logoutUser);
routerUser.route("/refresh-token").post(refreshAccessToken);
routerUser.route("/change-password").patch(verifyJWT, changePassword);
routerUser.route("/get-user").get(verifyJWT, currentUser);
routerUser.route("/update-user").patch(verifyJWT, updateDetails);
routerUser.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar);
routerUser.route("/update-cover-image").patch(verifyJWT,upload.single("coverImage"),updateCoverImage);
routerUser.route('/profile/:username').get(verifyJWT,getUserChannelProfile);
routerUser.route('/history').get(verifyJWT,getWatchHistory);



export default routerUser