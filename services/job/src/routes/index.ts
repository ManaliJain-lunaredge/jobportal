import express from "express"
import { createCompany, createJob, deleteCompany, getAllActiveJob, getAllApplicationsForJob, getAllCompany, getCompanyDetail, getSingleJob, updateJob, updatepplication } from "../controller/job.js"
import { isAuth } from "../middleware/auth.js"
import uploadFile from "../middleware/multer.js"
const router = express.Router()

router.post("/create-company", isAuth, uploadFile, createCompany)
router.delete("/delete-company/:companyId",isAuth,deleteCompany)
router.post("/create-job",isAuth,createJob)
router.post("/update-job/:jobId",isAuth,updateJob)
router.get("/all-compaines",isAuth,getAllCompany)
// route for active jobs must come before the dynamic company id route
// otherwise "/company/:id" will catch "/company/active-jobs" and run auth middleware
router.get("/company/active-jobs", getAllActiveJob)
router.get("/company/getsinglejob/:id", getSingleJob);
router.get("/getallapplications/:jobId",isAuth,getAllApplicationsForJob)
router.put("/update-application/:id",isAuth,updatepplication)
router.get("/company/:id", isAuth, getCompanyDetail)
export default router