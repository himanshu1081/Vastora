import { User } from "../models/users.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, password, email } = req.body;
    if (!fullName || !username || !password || !email) {
        throw new ApiError(404, "All fields are required !");
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        if (existedUser.username === username) {
            throw new ApiError(400, "Username already exists")
        } else if (existedUser.email === email) {
            throw new ApiError(400, "Email already exists")
        }
    }
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    let avatar = null;
    let coverImage = null;
    if (avatarLocalPath) {
        let result = await uploadOnCloudinary(avatarLocalPath);
        avatar = result?.url?.replace("/upload/", "/upload/f_auto/")
        if (!avatar) {
            throw new ApiError(500, "Avatar upload failed!");
        }
    }
    if (coverImageLocalPath) {
        let result = await uploadOnCloudinary(coverImageLocalPath);
        coverImage = result?.url?.replace("/upload/", "/upload/f_auto/");
    }


    const user = await User.create({
        email,
        username: username.toLowerCase(),
        password,
        fullName,
        avatar,
        coverImage: coverImage || ""
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating the user!")
    }

    //sending back response
    res.status(200).json(
        new ApiResponse(201, user, "User Created Successfully")
    )
});

const generateAccessTokenAndRefreshToken = async (user) => {
    try {
        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        const userData = await User.findById(user._id).select("-password -refreshToken");
        return { accessToken, refreshToken, userData }
    } catch (error) {
        ApiError(500, error.message);
    }
}

const loginUser = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier.trim() || !password.trim()) {
        throw new ApiError(400, "Username/email and password required")
    }
    const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }]
    })
    if (!user) {
        throw new ApiError(401, "No user exists!");
    }

    if (await user.toCheckPassword(password)) {
        const { accessToken, refreshToken, userData } = await generateAccessTokenAndRefreshToken(user);

        console.log(`Welcome back ${user.fullName}`)

        const option= {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        }


        return res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option).json(
            new ApiResponse(200, { userData, accessToken, refreshToken }, "Cookies sent!")
        )
    } else {
        throw new ApiError(401, "Please check your password!");
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    const userData = req.user;
    userData.refreshToken = undefined;
    await userData.save({ validateBeforeSave: false })
    const isProd = process.env.NODE_ENV === "production";
    const isCrossDomain = process.env.FRONTEND_URL !== process.env.BACKEND_URL; // or any logic you use

    const option = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: 'vastora.onrender.com',
    }

    res.clearCookie("refreshToken", option).clearCookie("accessToken", option).json({
        message: "Cookies cleared"
    })
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) {
        throw new ApiError(401, "No token found");
    }
    const newToken = await jwt.verify(token, process.env.REFRESH_TOKEN);
    if (!newToken) {
        throw new ApiError(500, "Couldn't verify");
    }
    const user = await User.findById(newToken._id);
    if (!user) {
        throw new ApiError(401, "No user exists");
    }
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user);
    const option = {
        httpOnly: true,
        secure: true
    }
    return res.cookie("refreshToken", refreshToken, option)
        .cookie("accessToken", accessToken, option)
        .json(new ApiResponse(200, accessToken, "Cookie Refreshed"))
});

const changePassword = asyncHandler(async (req, res) => {
    const userData = req.user;
    const { oldPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(oldPassword, userData.password)
    if (!isMatch) {
        throw new ApiError(400, "Password wrong!")
    }
    if (newPassword.length < 6) {
        throw new ApiError(400, "Password too short")
    }
    userData.password = newPassword;
    await userData.save({ validateBeforeSave: true });
    return res.status(200).json(
        new ApiResponse(200, null, "Password Changed")
    )
});

const currentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched"))
});

const updateDetails = asyncHandler(async (req, res) => {
    const user = req.user;
    const { fullName, email } = req.body;
    if (!fullName && !email) {
        throw new ApiError(400, "At least one field is required")
    }
    if (fullName) user.fullName = fullName;

    if (req?.user.email !== email) {
        if (email) {
            const checkEmail = await User.findOne({ email: email });
            console.log(checkEmail)
            if (checkEmail) {
                throw new ApiError(404, "Email already used");
            }
            user.email = email;
        }
    }

    await user.save({ validateBeforeSave: true });

    return res.status(200).json(new ApiResponse(200, null, "Details Updated"))
});

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "No file found");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(500, "Failed to upload");
    }
    await User.findByIdAndUpdate(req.user._id, { avatar: avatar.url })
    return res.status(200).json(new ApiResponse(200, null, "Avatar updated"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "No file found");
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage) {
        throw new ApiError(500, "Failed to upload");
    }
    await User.findByIdAndUpdate(req.user._id, { coverImage: coverImage.url })
    return res.status(200).json(new ApiResponse(200, null, "Cover image updated"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const { id } = req?.user || {};
    if (!username?.trim()) {
        throw new ApiError(400, "No user found");
    }
    var ownProfile;
    if (req.user?.username == username) {
        ownProfile = true;
    } else {
        ownProfile = false;
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $lookup: {
                from: "videos",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$owner", "$$userId"] }
                        }
                    }
                ],
                as: "videos"
            }
        }, {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                subcribedCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: id ? {
                    $cond: {
                        if: { $in: [req.user._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                } : false
            }
        }, {
            $project: {
                fullName: 1,
                username: 1,
                subscriberCount: 1,
                subcribedCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
                createdAt: 1,
                videos: 1
            }
        }
    ])
    if (!channel?.length) {
        throw new ApiError(404, "No channel Exists");
    }
    if (!ownProfile) {
        const videos = channel[0]?.videos?.filter(v => v.isPublished === true);
        return res.status(200).json(new ApiResponse(200, { ...channel[0], ownProfile, videos }, "Channel Fetched"));

    }
    res.status(200).json(new ApiResponse(200, { ...channel[0], ownProfile }, "Channel Fetched"));
});

const getWatchHistory = asyncHandler(async (req, res) => {
    const { _id } = req?.user || {};

    const watchHistory = await User.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(_id) } },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
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
                            ownerUsername: "$owner.username",
                            ownerAvatar: "$owner.avatar",
                            ownerFullname: "$owner.fullName"
                        }
                    }
                ]
            }
        },
        {
            $project: {
                watchHistory: 1,
                username: 1,
                fullName: 1,
                avatar: 1,
                coverImage: 1
            }
        }
    ]);
    res.status(200).json(new ApiResponse(200, watchHistory[0], "Watch History fetched successfully"))
});

export {
    loginUser, registerUser, logoutUser, refreshAccessToken, getWatchHistory, updateDetails,
    changePassword, currentUser, updateAvatar, updateCoverImage, getUserChannelProfile
};