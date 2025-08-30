import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    sameSite: "none",
}));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

//routes import

import routerUser from "./routes/user.routes.js";
import routerVideo from "./routes/video.routes.js";
import routerLike from "./routes/likes.routes.js";
import routerComment from "./routes/comment.routes.js";
import routerSubscriber from "./routes/subscriber.routes.js";

//routes
app.use("/api/v1/user", routerUser);
app.use("/api/v1/video", routerVideo);
app.use("/api/v1/like", routerLike);
app.use("/api/v1/comment", routerComment);
app.use("/api/v1/subscriber", routerSubscriber);


// global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message: message,
    });
});


export default app