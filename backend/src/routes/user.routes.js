import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changePassword,freeEndPoint, currentUser, updateAvatar, updateCoverImage, getWatchHistory, updateDetails,getUserChannelProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {optionalAuth} from "../middlewares/optionalAuth.middleware.js";

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
routerUser.route("/get-user").get(optionalAuth, currentUser);
routerUser.route("/update-userdetails").patch(verifyJWT, updateDetails);
routerUser.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar);
routerUser.route("/update-coverImage").patch(verifyJWT,upload.single("coverImage"),updateCoverImage);
routerUser.route("/profile/:username").get(optionalAuth,getUserChannelProfile);
routerUser.route('/history').get(optionalAuth,getWatchHistory);
routerUser.route('/free-end-point').get(freeEndPoint);




export default routerUser