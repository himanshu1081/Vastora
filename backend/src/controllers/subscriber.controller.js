import { Subscription } from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose, { Mongoose } from "mongoose";


const getChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { _id } = req.user || {};
    if (!channelId) {
        throw new ApiError(404, "No channel found");
    }
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }
    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        }, {
            $count: "subscribersCount"
        }
    ])
    let isSubscribed = false;
    if (_id) {
        isSubscribed = !!(await Subscription.exists({ subscriber: _id, channel: new mongoose.Types.ObjectId(channelId) }))
    }
    const count = subscribers.length > 0 ? subscribers[0].subscribersCount : 0
    res.status(200).json(new ApiResponse(200, { count, isSubscribed }, "Subscribers Fetched"));
});

const subscribeChannel = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { _id } = req.user || {};


    if (!channelId) {
        throw new ApiError(404, "No channel found");
    }
    const isSubscribed = !!(await Subscription.exists({ subscriber: _id, channel: new mongoose.Types.ObjectId(channelId) }))
    if (!isSubscribed) {
        await Subscription.create({
            subscriber: _id,
            channel: channelId
        })
    }

    res.status(200).json(new ApiResponse(200, null, "Subscribed"));
});

const unsubscribeChannel = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { _id } = req.user || {};
    if (!channelId) {
        throw new ApiError(404, "No channel found");
    }
    await Subscription.deleteOne({
        subscriber: _id,
        channel: channelId
    })

    res.status(200).json(new ApiResponse(200, null, "unsubscribed"));
});

export { getChannelSubscribers, subscribeChannel, unsubscribeChannel }