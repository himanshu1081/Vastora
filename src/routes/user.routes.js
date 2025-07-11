import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changePassword, currentUser, updateAvatar, updateCoverImage,getUserChannelProfile, getWatchHistory, updateDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post
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

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/get-user").get(verifyJWT, currentUser);
router.route("/get-user").patch(verifyJWT, updateDetails);
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar);
router.route("/update-cover-image").patch(verifyJWT,upload.single("coverImage"),updateCoverImage);
router.route('/profile/:username').get(verifyJWT,getUserChannelProfile);
router.route('/history').get(verifyJWT,getWatchHistory);



export default router