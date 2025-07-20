import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import doExist from "../utils/doExist.js";


const addComment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const videoId = req.params.videoId;
    await doExist(videoId);
    const content = req.body.content;
    if (content?.trim() === "") {
        throw new ApiError(400, "Comment can't be empty");
    }
    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: userId
    });
    res.status(200).json(new ApiResponse(200, comment, "Comment done!"))
});

const getComments = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    await doExist(videoId);
    const data = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                let: { ownerId: "$owner" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$ownerId"] }
                        }
                    },
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ],
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        }, {
            $project: {
                owner: 1,
                content: 1
            }
        }
    ])
    res.status(200).json(new ApiResponse(200, data, "Comment Fetched"))
});

const deleteComment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const commentId = req.params.commentId;
    const commentInfo = await Comment.findById(commentId).populate("video");
    if (!commentInfo) {
        throw new ApiError(404, "Bad request");
    }
    const ownerId = commentInfo.video.owner;
    const videoId = commentInfo.video._id;

    const isCommentOwner = commentInfo.owner.equals(userId);
    const isVideoOwner = videoId.equals(ownerId);

    if (!isCommentOwner && !isVideoOwner) {
        throw new ApiError(200, "You can't delete this comment");
    }

    const likes = await Likes.find({ comment: commentId })
    const likeIds = likes.map(l => l._id);
    await Likes.deleteMany({ _id: { $in: commentIds } })
    await Comment.findByIdAndDelete(commentId)

    res.status(200).json(new ApiResponse(200, null, "Comment deleted"));
});

export { addComment, getComments, deleteComment };