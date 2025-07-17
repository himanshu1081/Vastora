import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getComments } from "../controllers/comment.controller.js";

const routerComment = Router();

routerComment.route("/add-comment/:videoId").post(verifyJWT,addComment);
routerComment.route("/get-comments/:videoId").get(verifyJWT,getComments);
routerComment.route("/del-comment/:commentId").delete(verifyJWT,deleteComment);

export default routerComment;