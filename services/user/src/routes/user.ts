import express from "express"
import { addSkillToUser, applyForJob, deleteSkillFromUser, getAllAplication, getUserProfile, myProfile, updateProfile, updateProfilePic, updateProfileResume } from "../controller/user.js";
import {isAuth } from "../../middleware/auth.js"
import uploadFile from "../../middleware/multer.js";

const router=express.Router();

// place specific/static routes before the dynamic '/:userId' route
router.get("/me", isAuth, myProfile)
router.put("/update/profile-pic", isAuth, uploadFile, updateProfilePic)
// fixed route path (was missing leading slash)
router.post("/update/resume", isAuth, uploadFile, updateProfileResume)

router.post("/update/:userId", isAuth, updateProfile)

router.post("/skill/add", isAuth, addSkillToUser)
router.delete("/skill/delete", isAuth, deleteSkillFromUser)
router.post("/apply/job", isAuth, applyForJob)
router.get("/getapplication", isAuth, getAllAplication)

// dynamic userId route should be last so it doesn't capture literal paths like '/getapplication'
router.get("/:userId", isAuth, getUserProfile)
export default router;