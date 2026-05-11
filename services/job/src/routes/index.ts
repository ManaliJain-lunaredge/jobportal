import express from "express"
import { createCompany, createJob, deleteCompany, getAllCompany, getCompanyDetail, updateJob } from "../controller/job.js"
import { isAuth } from "../middleware/auth.js"
import uploadFile from "../middleware/multer.js"
const router = express.Router()

router.post("/create-company", isAuth, uploadFile, createCompany)
router.delete("/delete-company/:companyId",isAuth,deleteCompany)
router.post("/create-job",isAuth,createJob)
router.post("/update-job/:jobId",isAuth,updateJob)
router.get("/all-compaines",isAuth,getAllCompany)
router.get("/company/:id",isAuth,getCompanyDetail)
export default router