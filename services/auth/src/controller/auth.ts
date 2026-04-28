

import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js"
import axios from "axios"
import bcrypt from "bcrypt"
export const registerUser = TryCatch(async (req, res) => {

    const { name, email, password, role, phoneNumber, bio } = req.body;

    if (!name || !email || !password || !role || !phoneNumber || !bio) {
        throw new ErrorHandler(400, "Please Fill all details")
    }

    const existing_user = await sql`SELECT user_id from users where email=${email}`
   if (existing_user.length > 0) {
   throw new ErrorHandler(409, "Email already exist");
}
    const hashPassword = await bcrypt.hash(password, 10)
    let registerUser;


    if (role === "recruiter") {
        const [user] = await sql` INSERT INTO users(name,email,password,phone_number,role) VALUES (${name},${email},${hashPassword},${phoneNumber},${role}) RETURNING user_id,name,email,phone_number,role,created_at`;
        registerUser = user
    }
    else if (role === "jobseeker") {
        const file = req.file

        if (!file) {
            throw new ErrorHandler(400, "resume file is required")
        }

        const fileBuffer = getBuffer(file)


        if (!fileBuffer || !fileBuffer.content) {
            throw new ErrorHandler(500, "failed to generate buffer")
        }
        const { data } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, { buffer: fileBuffer.content })

        const [user] = await sql` INSERT INTO users(name,email,password,phone_number,role,bio,resume,resume_public_id) VALUES (${name},${email},${hashPassword},${phoneNumber},${role},${bio},${data.url},${data.public_id}) RETURNING user_id,name,email,phone_number,role,bio,resume,created_at`;
        registerUser = user;
    }

res.json({
    message:"user registerd",
    registerUser
})
})