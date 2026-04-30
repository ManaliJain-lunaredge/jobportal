import express from "express"
import { addSkillToUser, deleteSkillFromUser, getUserProfile, myProfile, updateProfile, updateProfilePic, updateProfileResume } from "../controller/user.js";
import {isAuth } from "../../middleware/auth.js"
import uploadFile from "../../middleware/multer.js";

const router=express.Router();

router.get("/me",isAuth,myProfile)
router.get("/:userId",isAuth,getUserProfile)
router.post("/update/:userId",isAuth,updateProfile)
router.post("/profile-pic",isAuth,uploadFile,updateProfilePic)
// fixed route path (was missing leading slash)
router.post("/update/resume",isAuth,uploadFile,updateProfileResume)

router.post("/skill/add",isAuth,addSkillToUser)
router.delete("/skill/delete",isAuth,deleteSkillFromUser)

export default router;