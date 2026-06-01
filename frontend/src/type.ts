import { ReactNode } from "react";
export interface JobOptions {
    title: string;
    responsibilities: string;
    why: string;
}

export interface SkillsToLearn {
    title: string;
    why: string;
    how: string;
}

export interface SkillsCategory {
    category: string;
    skills: SkillsToLearn[]
}

export interface LearningApporach {
    title: string;
    points: string[];

}
export interface CarrierGuideResponse {
    summary: string;
    // matches backend response keys
    jobOptions: JobOptions[];
    skillsToLearn: SkillsCategory[];
    learningApproach: LearningApporach;
}

// NOTE: utils service runs on port 5001 (see services/utils/.env)


export interface ScoreBreakDown {
    formatting: { score: number; feedback: string };
    keyword: { score: number; feedback: string };
    structure: { score: number; feedback: string };
    readability: { score: number; feedback: string };
}

export interface Suggestion {
    category: string;
    issue: string;
    recommendation: string;
    priority: "high" | "medium" | "low";
}

export interface ResumeAnalysisResponse {
    atsScore: number;
    scoreBreakdown: ScoreBreakDown;
    suggestions: Suggestion[];
    strengths: string[];
    summary: string;
}

export interface User {

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
    // optional company metadata supplied by job service for convenience
    company_name?: string;
    company_logo?: string;
    company_website?: string;
    skills: string[],
    subscription: string | null


}

export interface Company {
    company_id: number;
    name: string;
    description: string;
    website: string;
    logo: string;
    logo_public_id: string;
    recruiter_id: number;
    created_at: string;
    jobs?: Job[];
}

export interface Job {
    job_id: number;
    title: string;
    description: string;
    salary: number | string;
    location: string | null;
    job_type: "Full-time" | "Part-time" | "Contract" | "Internship";
    role: string;
    work_location: "On-site" | "Remote" | "Hybrid";
    company_id: number;
    posted_by_recruiter_id: number;
    openings: number;
    is_active: boolean;
    // optional company metadata supplied by job service
    company_name?: string;
    company_logo?: string;
    company_website?: string;
    created_at?: string;
}

export interface JobPayload {
    title: string;
    description: string;
    salary: number | string;
    location: string;
    role: string;
    job_type: Job["job_type"];
    work_location: Job["work_location"];
    company_id: number;
    openings: number;
    is_active?: boolean;
}

export interface AppContextType {
    user: User | null;
    loading: boolean;
    btnLoading: boolean;
    isAuth: boolean;
    accessToken?: string | null;
    companies: Company[];

    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setAccessToken?: React.Dispatch<React.SetStateAction<string | null>>;

    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
    logOutUser:()=>Promise<void>
    updateProfilePic:(formData:any)=>Promise<void>
    updateResume:(formData:any)=>Promise<void>
    updateProfile:(payload:{name?:string,email?:string,phone_number?:string|number,bio?:string})=>Promise<void>
    addSkill:(skillName:string)=>Promise<void>
    deleteSkill:(skillName:string)=>Promise<void>
    fetchCompanies:()=>Promise<void>
    createCompany:(formData:FormData)=>Promise<void>
    deleteCompany:(companyId:number)=>Promise<void>
}

export interface AppProviderProps{
    children:ReactNode;
}

export interface AccountProps{
  user:User;
 isYourAccount:boolean;
 
}