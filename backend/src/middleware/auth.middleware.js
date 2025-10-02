// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import { ApiError } from "../utils/apiError.js";

// export const authMiddleware = async (req, res, next) => {
//   console.log(req.headers);
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       throw new ApiError(401, "Unauthorized request");
//     }

//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decodedToken?._id).select(
//       "-password -refreshToken"
//     );

//     if (!user) {
//       throw new ApiError(401, "Invalid Access Token");
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     next(new ApiError(401, error?.message || "Invalid access token"));
//   }
// };

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Check header OR query param
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.query.token) {
      token = req.query.token; // For SSE
    }

    if (!token) {
      return next(
        new ApiError(401, "Unauthorized request - No token provided")
      );
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3️⃣ Attach user to req
    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return next(new ApiError(401, "Unauthorized request - User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(
      new ApiError(401, "Unauthorized request - Invalid or expired token")
    );
  }
};
