import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikes, likeVideoToggle } from "../controllers/like.controller.js";

const routerLike = Router();

routerLike.route("/like-video/:videoId").patch(verifyJWT,likeVideoToggle);
routerLike.route("/get-likes/:videoId").get(getLikes);


export default routerLike;