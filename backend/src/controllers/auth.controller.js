import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

const generateAccessAndRefreshTokens = async(userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};


export const registerUser = async(req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new ApiError(400, 'All fields are required'));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ApiError(409, 'User with this email already exists'));
    }

    const user = await User.create({ name, email, password });
    const createdUser = await User.findById(user._id).select('-password -refreshToken');

    if (!createdUser) {
        return next(new ApiError(500, 'Something went wrong while registering the user'));
    }

    return res.status(201).json(new ApiResponse(201, createdUser, 'User registered successfully'));
};

export const loginUser = async(req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ApiError(400, 'Email and password are required'));
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordCorrect(password))) {
        return next(new ApiError(401, 'Invalid email or password'));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, 'User logged in successfully'));
};

export const logoutUser = async(req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id, { $set: { refreshToken: undefined } }, { new: true }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'User logged out successfully'));
};