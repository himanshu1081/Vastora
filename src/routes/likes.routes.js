import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getVideoLikes, likeCommentToggle, likeVideoToggle,getCommentLikes } from "../controllers/like.controller.js";

const routerLike = Router();

routerLike.route("/like-video/:videoId").patch(verifyJWT,likeVideoToggle);
routerLike.route("/get-vlikes/:videoId").get(getVideoLikes);
routerLike.route("/like-comment/:commentId").patch(verifyJWT,likeCommentToggle);
routerLike.route("/get-clikes/:commentId").get(getCommentLikes);


export default routerLike;