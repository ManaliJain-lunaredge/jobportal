import type { NextFunction ,Request,Response} from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import { sql } from "../utils/db.js";
export interface AuthenticatedRequest extends Request{
    user?:User
}
interface User {

    user_id: number;
    name: string,
    email: string,
    phone_number: number,
    role: 'jobseeker' | "recruiter",
    bio: string | null,
    resume: string | null,
    resume_public_id: string | null,
    profile_pic: string | null,
    profile_pic_public_id: string | null,
    skills: string[],
    subscription: string | null

}


export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Authorization header is missing or invalid"
            })
            return;
        }

        const token = authHeader.split(" ")[1]
        const decodedPayload = jwt.verify(
            token!, process.env.JWT_SEC as string) as JwtPayload;

        if (!decodedPayload || !decodedPayload.id) {
            res.status(401).json({
                message: "invalid token"
            })
            return;
        }

const users=await sql `SELECT u.user_id,u.name,u.email ,u.phone_number,u.bio,u.role,u.resume,u.resume_public_id,u.profile_pic,u.profile_pic_public_id,u.subscription,ARRAY_AGG (s.name) FILTER (WHERE s.name IS NOT NULL ) as skills FROM users u LEFT JOIN user_skills us ON u.user_id=us.user_id LEFT JOIN skills s ON us.skills_id=s.skills_id WHERE u.user_id=${decodedPayload.id} GROUP BY u.user_id`;

if(users.length==0){
       res.status(401).json({
                message: "user associated wioth this token not exist"
            })
    return;
}
const user=users[0] as User;
user.skills=user.skills||[];
// attach user to request so downstream handlers can access it
(req as AuthenticatedRequest).user = user;
next();


    } catch (error) {
        console.log(error);
        
   res.status(401).json({
                message: "authtication error"
            })
    }
}