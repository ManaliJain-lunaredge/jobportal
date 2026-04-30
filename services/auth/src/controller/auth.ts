

import { redisClient } from "../index.js";
import { publishToTopic } from "../producer.js";
import { forgotPasswordTemplate } from "../template.js";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js"
import axios from "axios"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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

    const token = jwt.sign({ id: registerUser?.user_id }, process.env.JWT_SEC as string, {
        expiresIn: "15d"
    })

    res.json({
        message: "user registerd",
        registerUser,
        token
    })
})



export const loginUser = TryCatch(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new ErrorHandler(400, "Please fill all details")
    }
    const user = await sql`
    SELECT u.user_id,u.name,u.email,u.password,u.phone_number,u.role,u.bio,u.resume,u.profile_pic,u.subscription , ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) AS skills FROM users u LEFT JOIN user_skills us ON u.user_id=us.user_id LEFT JOIN skills s ON us.skills_id =s.skills_id WHERE u.email =${email} GROUP BY u.user_id`;


    if (user.length === 0) {
        throw new ErrorHandler(400, "Invalid credentails")
    }

    const userObject: Record<string, any> | undefined = user[0];
    if (!userObject) {
        throw new ErrorHandler(400, "Invalid credentails")
    }
    const matchPassword = await bcrypt.compare(password, userObject.password)

    if (!matchPassword) {
        throw new ErrorHandler(400, "Invalid credentails")
    }
    userObject.skills = userObject.skills || [];
    delete userObject.password;

    const token = jwt.sign({ id: userObject?.user_id }, process.env.JWT_SEC as string, {
        expiresIn: "15d"
    })

    res.json({
        message: "user LoggiedIn",
        userObject,
        token
    })

})


export const forgotPassword = TryCatch(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        throw new ErrorHandler(400, "email required")
    }
    const users = await sql`SELECT user_id,email FROM users WHERE email=${email}`;

    if (users.length == 0) {
        return res.json({
            message: "if that email exist, we will sent a link"
        })
    }

    const user = users[0]!;

    const resetToken = jwt.sign({
        email: user.email,
        type: 'reset'
    },

        process.env.JWT_SEC as string,
        { expiresIn: '15m' }

    );

    await redisClient.set(`forgot:${email}`, resetToken, {
        EX: 900
    });


    const resentLink = `${process.env.Frontend_Url}/reset/${resetToken}`
    const message = {
        to: email,
        subject: 'reset your password',
        html: forgotPasswordTemplate(resentLink)
    }
    publishToTopic("send-mail", message).catch((error) => {
        console.error("failed to send ", error);
    })
    res.json({
        message: 'if email exist if have sent mail'
    })
})




export const resetPassword = TryCatch(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    let decoded: any;

    try {
        decoded = jwt.verify(req.params.token as string, process.env.JWT_SEC as string);

    } catch (error: any) {
  throw new ErrorHandler(400, error.message);
}
    if (decoded.type !== "reset") {
        throw new ErrorHandler(400, "Invalid token ")
        
    }

    const email = decoded.email;
    const storedToken = await redisClient.get(`forgot:${email}`)


    if (!storedToken || storedToken !== token) {
        throw new ErrorHandler(400, "token has been expired")
    }


    const users = await sql`SELECT user_id FROM users WHERE email=${email}`
    if (users.length === 0) {
        throw new ErrorHandler(400, "user not found")
    }

    const [user] = users;

    if (!user) {
        throw new ErrorHandler(400, "User not found");
    }
    const hashpassword = await bcrypt.hash(password, 10)
    await sql`UPDATE users SET password=${hashpassword} WHERE user_id=${user.user_id}`
    await redisClient.del(`forgot:${email}`)
    res.json({
        message: "Password chnaged succesfully"
    })
})