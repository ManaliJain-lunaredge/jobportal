import axios from "axios";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import  { TryCatch } from "../utils/TryCatch.js";

export const createCompany = TryCatch(
  async (req: AuthenticatedRequest, res, next) => {

    const user = req.user;

    if (!user) {
      throw new ErrorHandler(401, "Authentication failed");
    }

    if (user.role !== "recruiter") {
      throw new ErrorHandler(403, "Forbidden: only recruiter can create company");
    }

    const { name, description, website } = req.body;

    if (!name || !description || !website) {
      throw new ErrorHandler(400, "All fields are required");
    }

    const existingCompany = await sql`
      SELECT company_id FROM companies WHERE name = ${name}
    `;

    if (existingCompany.length > 0) {
      throw new ErrorHandler(409, "Company already exists");
    }

    const file = req.file;

    if (!file) {
      throw new ErrorHandler(400, "Company logo is required");
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer?.content) {
      throw new ErrorHandler(500, "Failed to create file buffer");
    }

    const { data } = await axios.post(
      `${process.env.UPLOAD_SERVICE}/api/utils/upload`,
      { buffer: fileBuffer.content }
    );

    const newCompany = await sql`
      INSERT INTO companies (name, description, website, logo, logo_public_id, recruiter_id)
      VALUES (${name}, ${description}, ${website}, ${data.url}, ${data.public_id}, ${user.user_id})
      RETURNING *
    `;

    res.json({
      message: "Company created successfully",
      newCompany
    });
  }
);


export const deleteCompany=TryCatch(async(req:AuthenticatedRequest,res,next)=>{
    const user=req.user;
    const {companyId}=req.params;
    const [company]=await sql`SELECT logo_public_id FROM companies WHERE company_id=${companyId} AND recruiter_id =${user?.user_id} `;

    if(!company){
         throw new ErrorHandler(404, "Company not found or you are not authorised to delete");
    }

await sql`DELETE FROM companies WHERE company_id=${companyId} `
res.json({
    message:"Company and all asociated jobs have been deleted"
})


})

export const createJob =TryCatch(async(req:AuthenticatedRequest,res,next)=>{
     const user = req.user;

    if (!user) {
      throw new ErrorHandler(401, "Authentication failed");
    }

    if (user.role !== "recruiter") {
      throw new ErrorHandler(403, "Forbidden: only recruiter can create company");
    }
    const {name,description,salary,location,role,job_type,work_location,company_id,openings}=req.body;
 if (!name || !description || !salary||!location||!role||!job_type||!work_location||!company_id||!openings) {
      throw new ErrorHandler(400, "All fields are required")
    }
const [company]=await sql`SELECT company_id FROM companies WHERE company_id=${company_id} AND recruiter_id=${user.user_id}`
if(!company){
     throw new ErrorHandler(404, "Company not found");
}

const [newJob] =
await sql`
  INSERT INTO jobs (
    title, 
    description, 
    salary, 
    location, 
    role,
    job_type, 
    work_location, 
    company_id, 
    posted_by_recruiter_id, 
    openings
  ) 
  VALUES (
    ${name}, 
    ${description}, 
    ${salary}, 
    ${location}, 
    ${role}, 
    ${job_type}, 
    ${work_location}, 
    ${company_id}, 
    ${user.user_id}, 
    ${openings}
  ) 
  RETURNING *;
`;


})