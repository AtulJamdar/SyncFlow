import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

//Admin only
export const getAllUsers = async (req, res, next) => {
  try {
    // Exclude passwords and refresh tokens from the result
    const users = await User.find().select("-password -refreshToken");
    res
      .status(200)
      .json(new ApiResponse(200, users, "Users retrieved successfully"));
  } catch (error) {
    next(new ApiError(500, "Error retrieving users"));
  }
};

//    Update user role and specialization (admin only)

export const updateUser = async (req, res, next) => {
  const { role, specialization } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    // Update fields if they are provided
    if (role) user.role = role;
    if (specialization) user.specialization = specialization;

    await user.save({ validateBeforeSave: false });

    const updatedUser = await User.findById(req.params.id).select(
      "-password -refreshToken"
    );
    res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "User updated successfully"));
  } catch (error) {
    next(new ApiError(500, "Error updating user"));
  }
};

// Only Admin can delete Users
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }
    // Note: In a real-world app, you'd handle reassignment of their projects, etc.
    res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
  } catch (error) {
    next(new ApiError(500, "Error deleting user"));
  }
};
