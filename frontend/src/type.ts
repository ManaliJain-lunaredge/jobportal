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
    skills: string[],
    subscription: string | null


}

export interface AppContextType {
    user: User | null;
    loading: boolean;
    btnLoading: boolean;
    isAuth: boolean;

    setUser: React.Dispatch<React.SetStateAction<User | null>>;

    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
    logOutUser:()=>Promise<void>
}

export interface AppProviderProps{
    children:ReactNode;
}

export interface AccountProps{
  user:User;
 isYourAccount:boolean;
 
}