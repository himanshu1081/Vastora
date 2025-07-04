import { Router } from "express";
import {registerUser,loginUser,logoutUser, refreshAccessToken,changePassword,currentUser} from "../controllers/user.controller.js";
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
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,changePassword);
router.route("/get-user").post(verifyJWT,currentUser);



export default router