import { User } from "../models/users.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js"
import uploadOnCloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, password, email } = req.body;
    if (!fullName || !username || !password || !email) {
        throw new ApiError(404, "All fields not filled!");
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        if (existedUser.username === username) {
            throw new ApiError(407, "Username already exists")
        } else if (existedUser.email === email) {
            throw new ApiError(407, "Email already exists")
        }
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    const user = await User.create({
        email,
        username: username.toLowerCase(),
        password,
        fullName,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || ""
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
    const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }]
    })
    if (!user) {
        throw new ApiError(404, "No user exists!");
    }

    if (await user.toCheckPassword(password)) {
        const { accessToken, refreshToken, userData } = await generateAccessTokenAndRefreshToken(user);


        console.log(`Welcome back ${user.fullName}`)
        const option = {
            httpOnly: true,
            secure: true
        }
        return res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option).json(
            new ApiResponse(200, { userData, accessToken, refreshToken }, "Cookies sent!")
        )
    } else {
        throw new ApiError(404, "Please check your password");
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    const userData = req.user;
    userData.refreshToken = undefined;
    await userData.save({ validateBeforeSave: false })
    const option = {
        httpOnly: true,
        secure: true
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
    const newToken = await jwt.verify(token, process.env.REFRESH_TOKEN)
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
        .json(new ApiResponse(200, null, "Cookie Refreshed"))
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
    if (!fullName || !email) {
        throw new ApiError(400, "Fill all details")
    }

    user.fullName = fullName;
    user.email = email;
    await user.save({ validateBeforeSave: true });

    return res.status(200).json(new ApiResponse(200, null, "Details Updated"))
})

export { loginUser, registerUser, logoutUser, refreshAccessToken, changePassword, currentUser, updateDetails };