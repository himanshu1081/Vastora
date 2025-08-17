import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getComments } from "../controllers/comment.controller.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

const routerComment = Router();

routerComment.route("/add-comment/:videoId").post(verifyJWT,addComment);
routerComment.route("/get-comments/:videoId").get(optionalAuth,getComments);
routerComment.route("/del-comment/:commentId").delete(verifyJWT,deleteComment);

export default routerComment;