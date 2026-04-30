import express from "express"
const router =express.Router();
import {forgotPassword, loginUser, registerUser, resetPassword} from "../controller/auth.js"

import uploadFile from "../middleware/multer.js";
router.post("/register",  uploadFile,registerUser)
router.post("/login",  loginUser)
router.post("/forgot-password",  forgotPassword)
router.post("/reset-password/:token",resetPassword)


export default router;