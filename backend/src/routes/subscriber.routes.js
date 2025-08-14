import { Router } from "express";
import { getChannelSubscribers, subscribeChannel, unsubscribeChannel } from "../controllers/subscriber.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

const routerSubscriber = Router();

routerSubscriber.route("/:channelId").get(optionalAuth, getChannelSubscribers);
routerSubscriber.route("/subscribe/:channelId").post(verifyJWT, subscribeChannel);
routerSubscriber.route("/unsubscribe/:channelId").delete(verifyJWT, unsubscribeChannel);



export default routerSubscriber;