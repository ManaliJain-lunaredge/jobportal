import express from "express"
const router = express.Router();
import {forgotPassword, loginUser, registerUser, resetPassword, refreshAccessToken, logoutUser} from "../controller/auth.js"

import uploadFile from "../middleware/multer.js";
router.post("/register", uploadFile, registerUser)
router.post("/login", loginUser)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

// refresh access token using HttpOnly refresh cookie
router.post("/refresh", refreshAccessToken)
// logout: revoke refresh token and clear cookie
router.post("/logout", logoutUser)

export default router;