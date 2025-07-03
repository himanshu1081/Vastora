import { User } from "../models/users.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js"
import uploadOnCloudinary from "../utils/cloudinary.js";

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

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
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
        new ApiResponse(201, "User Created Successfully", user)
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
            new ApiResponse(200, "Cookies sent!", {userData,accessToken,refreshToken})
        )
    } else {
        throw new ApiError(404, "Please check your password");
    }
});

const logoutUser = asyncHandler(async(req,res)=>{
    const userData = req.user;
    userData.refreshToken = undefined;
    await userData.save({validateBeforeSave:false})
    const option = {
            httpOnly: true,
            secure: true
        }
    res.clearCookie("refreshToken",option).clearCookie("accessToken",option).json({
        message:"Cookies cleared"
    })
})

export { loginUser, registerUser,logoutUser };