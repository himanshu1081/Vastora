import asyncHandler from "../utils/asyncHandler.js";
import { Likes } from "../models/likes.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import doExist from "../utils/doExist.js";
import { Comment } from "../models/comment.model.js";

const likeVideoToggle = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const videoId = req.params.videoId;
    doExist(videoId);
    let { type } = req.body;
    type = type.toLowerCase();
    const existing = await Likes.findOne({ video: videoId, toggledBy: userId })

    if (existing?.likeToggle == type) {
        return res.status(200).json(new ApiResponse(200, null, type));
    }

    if (type == "like" || type == "dislike") {
        if (!existing) {
            await Likes.create({
                video: videoId,
                toggledBy: userId,
                likeToggle: type
            })
        } else {
            await Likes.findByIdAndUpdate(existing._id, { likeToggle: type })
        }
        return res.status(200).json(new ApiResponse(200, null, type));
    }
    if (type == "neutral") {
        if (!existing) {
            throw new ApiError(404, "Bad request");
        }
        await Likes.deleteOne({ _id: existing._id })
        return res.status(200).json(new ApiResponse(200, null, type));
    }
    return res.status(400).json(new ApiResponse(400, null, "Invalid reaction type"));
});

const likeCommentToggle = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const commentId = req.params.commentId;
    let { type } = req.body;
    type = type.toLowerCase();
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "No comment exist");
    }

    const existing = await Likes.findOne({ comment: commentId, toggledBy: userId })

    if (existing?.likeToggle == type) {
        return res.status(200).json(new ApiResponse(200, null, type));
    }
    if (type == "like" || type == "dislike") {
        if (!existing) {
            await Likes.create({
                comment: commentId,
                toggledBy: userId,
                likeToggle: type
            })
        } else {
            await Likes.findByIdAndUpdate(existing._id, { likeToggle: type })
        }
        return res.status(200).json(new ApiResponse(200, null, type));
    }
    if (type == "neutral") {
        if (!existing) {
            throw new ApiError(404, "Bad request");
        }
        await Likes.deleteOne({ _id: existing._id })
        return res.status(200).json(new ApiResponse(200, null, type));
    }
    return res.status(400).json(new ApiResponse(400, null, "Invalid reaction type"));
});

const getVideoLikes = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    doExist(videoId);
    const data = await Likes.aggregate([
        { $match: { video: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {
                from: "users",
                localField: "toggledBy",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $facet: {
                totalLikes: [
                    {
                        $match:
                        {
                            likeToggle: "like"
                        }
                    },
                    {
                        $count: "totalLikes"
                    }],
                totalDislikes: [{
                    $match:
                    {
                        likeToggle: "dislike"
                    }
                },
                {
                    $count: "totalDislikes"
                }
                ],
                owner: [
                    {
                        $project: {
                            owner: 1,
                        }
                    }]
            }
        }
    ])
    if (data.length == 0 || !data) {
        throw new ApiError(404, "Data could not be fetched")
    }
    const likes = data[0]?.totalLikes[0]?.totalLikes || 0;
    const dislikes = data[0]?.totalDislikes[0]?.totalDislikes || 0;
    const owner = data[0]?.owner.map(o => o.owner).flat() || [];

    const response = { likes, dislikes, owner }

    res.status(200).json(new ApiResponse(200, response, "Data fetched"))
});

const getCommentLikes = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const comment = Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(400, "No comment exist");
    }

    const data = await Likes.aggregate([
        { $match: { comment: new mongoose.Types.ObjectId(commentId) } },
        {
            $lookup: {
                from: "users",
                localField: "toggledBy",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $facet: {
                totalLikes: [
                    {
                        $match:
                        {
                            likeToggle: "like"
                        }
                    },
                    {
                        $count: "totalLikes"
                    }],
                totalDislikes: [{
                    $match:
                    {
                        likeToggle: "dislike"
                    }
                },
                {
                    $count: "totalDislikes"
                }
                ],
                owner: [
                    {
                        $project: {
                            owner: 1,
                        }
                    }]
            }
        }
    ])
    if (data.length == 0 || !data) {
        throw new ApiError(404, "Data could not be fetched")
    }
    const likes = data[0]?.totalLikes[0]?.totalLikes || 0;
    const dislikes = data[0]?.totalDislikes[0]?.totalDislikes || 0;
    const owner = data[0]?.owner.map(o => o.owner).flat() || [];

    const response = { likes, dislikes, owner }

    res.status(200).json(new ApiResponse(200, response, "Data fetched"))
});


export { likeVideoToggle, getVideoLikes, likeCommentToggle, getCommentLikes };