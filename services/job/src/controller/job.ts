import axios from "axios";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";
import { applicationStatusUpdateTemplate } from "../Template.js";
import { publishToTopic } from "../producer.js";

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


export const deleteCompany = TryCatch(async (req: AuthenticatedRequest, res, next) => {
  const user = req.user;
  const { companyId } = req.params;
  const [company] = await sql`SELECT logo_public_id FROM companies WHERE company_id=${companyId} AND recruiter_id =${user?.user_id} `;

  if (!company) {
    throw new ErrorHandler(404, "Company not found or you are not authorised to delete");
  }

  await sql`DELETE FROM companies WHERE company_id=${companyId} `
  res.json({
    message: "Company and all asociated jobs have been deleted"
  })


})

export const createJob = TryCatch(async (req: AuthenticatedRequest, res, next) => {
  const user = req.user;

  if (!user) {
    throw new ErrorHandler(401, "Authentication failed");
  }

  if (user.role !== "recruiter") {
    throw new ErrorHandler(403, "Forbidden: only recruiter can create company");
  }
  const { title, description, salary, location, role, job_type, work_location, company_id, openings } = req.body;
  if (!title || !description || !salary || !location || !role || !job_type || !work_location || !company_id || !openings) {
    throw new ErrorHandler(400, "All fields are required")
  }
  const [company] = await sql`SELECT company_id FROM companies WHERE company_id=${company_id} AND recruiter_id=${user.user_id}`
  if (!company) {
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
    ${title}, 
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
  res.json({
    message: "Job created Succesfully",
    job: newJob
  })


})



export const updateJob = TryCatch(async (req: AuthenticatedRequest, res, next) => {
  const user = req.user;

  if (!user) {
    throw new ErrorHandler(401, "Authentication failed");
  }

  if (user.role !== "recruiter") {
    throw new ErrorHandler(403, "Forbidden: only recruiter can create company");
  }
  const { title, description, salary, location, role, job_type, work_location, company_id, openings, is_active } = req.body;
  if (!title || !description || !salary || !location || !role || !job_type || !work_location || !company_id || !openings) {
    throw new ErrorHandler(400, "All fields are required")
  }



  const [exsitngJob] = await sql`SELECT posted_by_recruiter_id FROM jobs WHERE job_id=${req.params.jobId} `


  if (!exsitngJob) {
    throw new ErrorHandler(404, "Job Not Found")
  }

  if (exsitngJob.posted_by_recruiter_id !== user.user_id) {
    throw new ErrorHandler(403, "Forbidden : not allowed to update")
  }
  const [updatedJob] = await sql`UPDATE jobs SET title=${title} ,description = ${description},
salary = ${salary},
location = ${location},
role = ${role},
job_type = ${job_type},
work_location = ${work_location},
openings = ${openings},
is_active = ${is_active}
WHERE job_id = ${req.params.jobId} RETURNING *;`

  res.json({
    message: "job updated",
    job: updatedJob
  })

})


export const getAllCompany = TryCatch(
  async (req: AuthenticatedRequest, res) => {

    console.log("USER:", req.user);

    const companies = await sql`
      SELECT *
      FROM companies
      WHERE recruiter_id = ${req.user?.user_id}
    `;

    console.log("COMPANIES:", companies);

    res.json({ companies });
  }
);



export const getCompanyDetail = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ErrorHandler(400, "Company id is required")
  }
  const [companyData] = await sql`SELECT c.*,COALESCE(
  (
  SELECT json_agg(j.*) FROM jobs J WHERE j.company_id =c.company_id
  
  ),
  '[]' :: json
  ) AS jobs FROM companies c WHERE c.company_id=${id} GROUP BY c.company_id;`;


  if (!companyData) {
    throw new ErrorHandler(404, "Company not found")
  }

  res.json(companyData)
})


export const getAllActiveJob = TryCatch(async (req, res) => {
  const { title, location } = req.query as {
    title?: string;
    location?: string
  };

  let queryString = `SELECT j.job_id,j.title,j.description,j.salary,j.location,j.job_type,j.role,j.work_location,j.created_at,c.name As company_name,c.logo As company_logo,c.company_id As company_id FROM jobs j JOIN companies c ON j.company_id=c.company_id WHERE j.is_active=true `;
  const values = [];
  let paramsIndex = 1;
  if (title) {
    queryString += ` AND j.title ILIKE $${paramsIndex}`;
    values.push(`%${title}%`);
    paramsIndex++;
  }
  if (location) {
    queryString += ` AND j.location ILIKE $${paramsIndex}`;
    values.push(`%${location}%`);
    paramsIndex++;
  }

  queryString += " ORDER BY j.created_at DESC";
  const jobs = (await sql.query(queryString, values)) as any[];
  res.json(jobs);

})


export const getSingleJob = TryCatch(async (req, res) => {
  const [job] = await sql`
    SELECT j.*, c.name AS company_name, c.logo AS company_logo, c.company_id AS company_id, c.website AS company_website
    FROM jobs j
    JOIN companies c ON j.company_id = c.company_id
    WHERE j.job_id = ${req.params.id}
  `;

  if (!job) {
    throw new ErrorHandler(404, "Job not found");
  }

  res.json(job);
})



export const getAllApplicationsForJob = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  if (!user) {
    throw new ErrorHandler(401, "Authentication failed");
  }

  if (user.role !== "recruiter") {
    throw new ErrorHandler(403, "Forbidden: only recruiter can access this");
  }

  const { jobId } = req.params;
  const [job] = await sql`SELECT posted_by_recruiter_id FROM jobs WHERE job_id=${jobId}`
  if (!job) {
    throw new ErrorHandler(404, "Job Not Found")
  }
  if (job.posted_by_recruiter_id != user.user_id) {
    throw new ErrorHandler(403, "Forbiddenn not allowed")
  }
  const applications = await sql`SELECT * FROM applications WHERE job_id=${jobId} ORDER BY subscribed DESC,applied_at ASC`
  res.json(applications)

})


export const updatepplication = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  if (!user) {
    throw new ErrorHandler(401, "Authentication failed");
  }

  if (user.role !== "recruiter") {
    throw new ErrorHandler(403, "Forbidden: only recruiter can access this");
  }
  const { id } = req.params;
  const [application] = await sql`SELECT * FROM applications WHERE application_id=${id}`;
  if (!application) {
    throw new ErrorHandler(404, "Application Not Found")
  }

  const [job] = await sql`SELECT posted_by_recruiter_id , title FROM jobs WHERE job_id=${application.job_id}`
  if (!job) {
    throw new ErrorHandler(404, "No job with this Application Found")
  }
  if (job.posted_by_recruiter_id != user.user_id) {
    throw new ErrorHandler(404, "No job with this Application Found")
  }
  const [updatedApplication] = await sql`UPDATE applications SET status=${req.body.status} WHERE application_id=${id} RETURNING *`
  const message = {
    to: application.applicant_email,
    subject: "Application Update-Job Portal",
    html: applicationStatusUpdateTemplate(job.title)
  };
  publishToTopic("send-mail", message).catch(error => {
    console.error("Failed to publish message to kafka", error);

  })

  res.json({
    message:"Application Updated",
    updatedApplication
  })
}
)