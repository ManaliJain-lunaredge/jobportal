import express from "express"
const router =express.Router();
import {registerUser} from "../controller/auth.js"

import uploadFile from "../middleware/multer.js";
router.post("/register",  uploadFile,registerUser)
export default router;