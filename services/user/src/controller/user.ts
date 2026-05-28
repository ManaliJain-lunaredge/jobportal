import axios from "axios";
import type { AuthenticatedRequest } from "../../middleware/auth.js";
import getBuffer from "../../utils/buffer.js";
import { sql } from "../../utils/db.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { TryCatch } from "../../utils/TryCatch.js";
// import { application } from "express"; // unused

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    res.json(user);


})


export const getUserProfile = TryCatch(async (req, res, next) => {
    const { userId } = req.params;
    const users = await sql`SELECT u.user_id,u.name,u.email ,u.phone_number,u.bio,u.role,u.resume,u.resume_public_id,u.profile_pic,u.profile_pic_public_id,u.subscription,ARRAY_AGG (s.name) FILTER (WHERE s.name IS NOT NULL ) as skills FROM users u LEFT JOIN user_skills us ON u.user_id=us.user_id LEFT JOIN skills s ON us.skills_id=s.skills_id WHERE u.user_id=${userId} GROUP BY u.user_id`;

    if (users.length == 0) {
        throw new ErrorHandler(400, "user not found")
    }


    const user = users[0]!;
    user.skills = user.skills || [];
    res.json(user)
})



export const updateProfile = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "authorixation required")
    }

    // guard against missing or non-parsed body (e.g., client sent multipart/form-data without multer)
    const body = req.body || {};
    const { name, phone_numer, bio, email } = body as { name?: string; phone_numer?: number; bio?: string; email?: string };

    const newName = name || user.name;
    const newPhoneNumber = phone_numer || user.phone_number;
    const newbio = bio || user.bio;
    const newEmail = email || user.email;

    const [updatedUser] = await sql`UPDATE users SET name=${newName},phone_number=${newPhoneNumber},bio=${newbio},email=${newEmail} WHERE user_id=${user.user_id} RETURNING user_id,name,phone_number,bio,email`
    res.json({
        message: "profile updated ",
        updatedUser
    })
})



export const updateProfilePic = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "authorixation required")
    }


    const file = req.file;

    if (!file) {
        throw new ErrorHandler(401, "no image  provided")
    }

    const oldPublicId = user.profile_pic_public_id;
    const fileBuffer = getBuffer(file)
    if (!fileBuffer || !fileBuffer.content) {
        throw new ErrorHandler(500, "failed to genrate file buffer")
    }


    const { data: uploadResult } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, {
        buffer: fileBuffer.content,
        public_id: oldPublicId
    })


    const [updatedUser] = await sql`
 update USERS SET profile_pic =${uploadResult.url},profile_pic_public_id=${uploadResult.public_id} WHERE user_id =${user.user_id} RETURNING user_id,name,profile_pic
 `;
    res.json({
        message: "profile pic updated ",
        user: updatedUser
    })


})





export const updateProfileResume = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "authorixation required")
    }


    const file = req.file;

    if (!file) {
        throw new ErrorHandler(401, "no pdf to  provided")
    }

    const oldPublicId = user.resume_public_id;
    const fileBuffer = getBuffer(file)
    if (!fileBuffer || !fileBuffer.content) {
        throw new ErrorHandler(500, "failed to genrate file buffer")
    }


    const { data: uploadResult } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, {
        buffer: fileBuffer.content,
        public_id: oldPublicId
    })


    const [updatedUser] = await sql`
 update USERS SET resume =${uploadResult.url},resume_public_id=${uploadResult.public_id} WHERE user_id =${user.user_id} RETURNING user_id,name,resume
 `;
    res.json({
        message: "resume updated ",
        user: updatedUser
    })


})




export const addSkillToUser = TryCatch(
    async (req: AuthenticatedRequest, res, next) => {

        const userId = req.user?.user_id;
        const { skillName } = req.body;

        if (!userId) {
            throw new ErrorHandler(401, "Authorization required");
        }

        if (!skillName || skillName.trim() === "") {
            throw new ErrorHandler(400, "Please provide a skill name");
        }

        let wasSkillAdded = false;

        try {
            await sql`BEGIN`;

            const users = await sql`
        SELECT user_id FROM users WHERE user_id = ${userId}
      `;

            if (users.length === 0) {
                throw new ErrorHandler(404, "User not found");
            }

         const [skill] = await sql`
  INSERT INTO skills (name)
  VALUES (${skillName.trim()})
  ON CONFLICT (name)
  DO UPDATE SET name = EXCLUDED.name
  RETURNING skills_id
`;

            const skill_id = skill!.skills_id;

                const insertionResult = await sql`
          INSERT INTO user_skills (user_id, skills_id)
          VALUES (${userId}, ${skill_id})
          ON CONFLICT (user_id, skills_id) DO NOTHING
          RETURNING user_id
        `;

            if (insertionResult.length > 0) {
                wasSkillAdded = true;
            }

            await sql`COMMIT`;

        } catch (error) {
            await sql`ROLLBACK`;
            throw error;
        }

        if (!wasSkillAdded) {
            return res.status(200).json({
                message: "User already has this skill"
            });
        }

        return res.json({
            message: `Skill ${skillName.trim()} is added successfully`
        });
    }
);


export const deleteSkillFromUser = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "Authorization required");
    }
    const { skillName } = req.body;
    if (!skillName || skillName.trim() === "") {
        throw new ErrorHandler(400, "Please provide a skill name");
    }
    const result = await sql`DELETE FROM user_skills WHERE user_id=${user.user_id} AND skills_id = (SELECT skills_id FROM skills WHERE name=${skillName.trim()}) RETURNING user_id`
    if (result.length === 0) {
        throw new ErrorHandler(404, `Skill ${skillName.trim()} was not found `);
    }
    res.json({
        message: `Skill ${skillName.trim()} is deleted successfully`
    })

})


export const applyForJob=TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user=req.user;
    if(!user){
        throw new ErrorHandler(401,"Authentication Required")
    }
    if(user.role!=="jobseeker"){
         throw new ErrorHandler(403,"Forbiddenn not allowed")
    }
    const applicant_id = user.user_id;
    const resume = user.resume;
    if(!resume){
         throw new ErrorHandler(400,"You need to add resume for this job")
    }
    const {job_id}=req.body;
    if(!job_id){
         throw new ErrorHandler(400,"Job id is required")
    }
    const [job]=await sql`SELECT is_active FROM jobs WHERE job_id =${job_id}`;
    if(!job){
         throw new ErrorHandler(404,"No job with this id")
    }
    if(!job.is_active){
         throw new ErrorHandler(400,"Job is not active")
    }

    const now =Date.now();
    const subTime=req.user?.subscription ?new Date(req.user.subscription).getTime():0;
    const isSubscribed=subTime> now;
 let newApplication;
 try{
     [newApplication]=await sql`INSERT INTO applications(job_id,applicant_id,applicant_email,resume,subscribed) VALUES (${job_id},${applicant_id},${user?.email},${resume},${isSubscribed})`;

 }catch(error:any){
 if(error.code==="23505"){
throw new ErrorHandler(409,"you have already applied")
 }
 throw error;

 }

res.json({
    message:"Applied for job succesfully",
    application:newApplication
})
})


export const getAllAplication=TryCatch(async(req:AuthenticatedRequest,res)=>{
    const applications=await sql`SELECT a.*, j.title AS job_title, j.salary AS job_salary, j.location AS job_location FROM applications a JOIN jobs j ON a.job_id = j.job_id WHERE a.applicant_id=${req.user?.user_id}`
res.json(applications)
})