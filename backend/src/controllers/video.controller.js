import { User } from "../models/users.model.js";
import { Video } from "../models/videos.model.js";
import { Comment } from "../models/comment.model.js"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { videoInfo } from "../utils/videoInfo.js";
import { v2 as cloudinary } from "cloudinary"
import { Likes } from "../models/likes.model.js";
import doExist from "../utils/doExist.js";
import mongoose from "mongoose";

const videoUpload = asyncHandler(async (req, res) => {
    const { title, description, isPublished } = req.body;
    const { _id } = req.user;
    if (!_id) {
        throw new ApiError(400, "User not logged in!");
    }

    const videoPath = req.files?.videoFile?.[0]?.path;

    const thumbnailPath = req.files?.thumbnail?.[0]?.path;
    const info = await videoInfo(videoPath);
    if (!info) {
        throw new ApiError(400, "File info could not be extracted");
    }
    const duration = info.streams[0].duration / 60;
    const videoFile = await uploadOnCloudinary(videoPath);
    let thumbnail;
    if (thumbnailPath) {
        thumbnail = await uploadOnCloudinary(thumbnailPath);
        if (!thumbnail) {
            console.warn("Thumbnail upload failed");
        }
    }
    if (!videoFile) {
        throw new ApiError(404, "Video could not be uploaded");
    }
    const videoDetails = await Video.create({
        videoFile: videoFile?.secure_url,
        thumbnail: thumbnail?.secure_url || "",
        owner: _id,
        title,
        description: description || "",
        duration,
        isPublished,
        vPublicId: videoFile?.public_id,
        tPublicId: thumbnail?.public_id
    })
    res.status(200).json(new ApiResponse(200, videoDetails, "Video uploaded successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished } = req?.body;
    const { _id } = req.video;
    const updateData = {};
    const newThumbnailPath = req.file?.path || null;
    if (newThumbnailPath) {
        const newThumbnail = await uploadOnCloudinary(newThumbnailPath);
        if (!newThumbnail) {
            throw new ApiError(500, "Cloudinary upload failed");
        }
        updateData.thumbnail = newThumbnail.secure_url;
    }
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (isPublished) updateData.isPublished = isPublished;


    const updatedVideo = await Video.findByIdAndUpdate(_id, updateData, { new: true });

    res.status(200).json(new ApiResponse(200, updatedVideo, "Details updated"))
});

const publishedToggle = asyncHandler(async (req, res) => {
    const videoInfo = req.video;
    const updatedVideo = await Video.findByIdAndUpdate(videoInfo._id, { isPublished: !videoInfo.isPublished }, { new: true })
    return res.status(200).json(new ApiResponse(200, `Video is ${updatedVideo.isPublished ? "public" : "private"} now`))
});

const getVideos = asyncHandler(async (req, res) => {
    let limit = parseInt(req.query.limit) || 15;
    if (limit > 50) {
        limit = 50
    } else if (limit < 1) {
        limit = 10
    }
    const videos = await Video.aggregate([
        {
            $match: { isPublished: true }
        },
        {
            $sample: { size: limit }
        }
        ,
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: {
                path: "$owner",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $project: {
                _id: 1,
                title: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                ownerId: "$owner._id",
                ownerName: "$owner.fullName",
                ownerAvatar: "$owner.avatar",
                ownerUsername: "$owner.username"
            }
        }
    ]);
    res.status(200).json(new ApiResponse(200, videos, "Videos fetched"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { _id, vPublicId, tPublicId } = req.video;
    console.log(_id, vPublicId, tPublicId)

    //Fetching all the comments on the video
    const comment = await Comment.find({ video: _id })
    console.log(comment)

    //Getting their id's in an array using map
    if (comment) {
        const commentIds = comment.map(c => c._id);
        //deleting all the likes on the comments
        await Likes.deleteMany({ comment: { $in: commentIds } })
    }

    //deleting likes from the video
    await Likes.deleteMany({ video: _id })

    //deleting all comments from the video
    await Comment.deleteMany({ video: _id })

    //deleting the video from database
    await Video.findByIdAndDelete(_id);

    //deleting video and file from the server (I am using cloudinary)
    await cloudinary.uploader.destroy(vPublicId, { resource_type: "video" })
    await cloudinary.uploader.destroy(tPublicId, { resource_type: "image" })

    res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"))
});

const watchVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    await doExist(videoId)
    if (!videoId) {
        return res.redirect("/");
    }
    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }).select('-vPublicId -tPublicId -isPublished');
    const video = await Video.aggregate([
        {
            $match: {
                isPublished: true,
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: {
                path: "$owner",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $project: {
                title: 1,
                videoFile: 1,
                description: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                ownerId: "$owner._id",
                ownerName: "$owner.fullName",
                ownerUsername: "$owner.username",
                ownerAvatar: "$owner.avatar"
            }
        }
    ]);
    const videoObjectId = new mongoose.Types.ObjectId(videoId);
    const user = req?.user;
    if (!user) {
        res.status(200).json(new ApiResponse(200, video, "View Counted"))
        return
    }
    if (user) {
        await User.findByIdAndUpdate(
            user._id,
            [
                {
                    $set: {
                        watchHistory: {
                            $concatArrays: [
                                [videoObjectId], // new video first
                                {
                                    $filter: {
                                        input: "$watchHistory",
                                        cond: { $ne: ["$$this", videoObjectId] } // remove old occurrences
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        );

    }
    res.status(200).json(new ApiResponse(200, video, "View counted and history updated"))
});

const videoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { _id } = req?.user || {}
    if (!_id) {
        throw new ApiError(404, "Bad request")
    }
    await doExist(videoId)
    if (!videoId) {
        return res.redirect("/");
    }
    const videoDetails = await Video.findById(videoId).select('-vPublicId -tPublicId');
    res.status(200).json(new ApiResponse(200, videoDetails, "Video Info retrieved"))

})

export { videoUpload, publishedToggle, getVideos, deleteVideo, updateVideo, watchVideo, videoDetails };