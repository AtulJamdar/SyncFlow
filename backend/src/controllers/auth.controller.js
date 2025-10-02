import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import crypto from "crypto";
import sendEmail from "../utils/email.js";

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ApiError(400, "All fields are required"));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError(409, "User with this email already exists"));
  }

  const user = await User.create({ name, email, password });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return next(
      new ApiError(500, "Something went wrong while registering the user")
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError(400, "Email and password are required"));
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    return next(new ApiError(401, "Invalid email or password"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
};

export const logoutUser = async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
};

export const forgotPassword = async (req, res, next) => {
  // 1. Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(404, "There is no user with that email address."));
  }

  // 2. Generate the random reset token
  const resetToken = User.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send it to user's email
  try {
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json(new ApiResponse(200, null, "Token sent to email!"));
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ApiError(
        500,
        "There was an error sending the email. Try again later."
      )
    );
  }
};

export const resetPassword = async (req, res, next) => {
  // 1. Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. If token has not expired, and there is a user, set the new password
  if (!user) {
    return next(new ApiError(400, "Token is invalid or has expired"));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3. Log the user in, send JWT
  // You can re-use the login logic here to send back tokens
  res
    .status(200)
    .json(
      new ApiResponse(200, null, "Password reset successfully. Please log in.")
    );
};
