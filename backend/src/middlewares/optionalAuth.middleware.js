import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";

export const optionalAuth = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
   
    if (!token) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        const userData = await User.findById(decoded._id);
        if (!userData) {
            throw new ApiError(401, "token authorization error");
        }
        req.user = userData;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access")
    }
});