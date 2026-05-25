export interface JobOptions{
    title:string;
    responsibilities:string;
    why:string;
}

export interface SkillsToLearn{
    title:string;
    why:string;
    how:string;
}

export interface SkillsCategory{
    category:string;
    skills:SkillsToLearn[]
}

export interface LearningApporach{
    title:string;
    points:string[];

}
export interface CarrierGuideResponse{
    summary:string;
    // matches backend response keys
    jobOptions: JobOptions[];
    skillsToLearn:SkillsCategory[];
    learningApproach:LearningApporach;
}

// NOTE: utils service runs on port 5001 (see services/utils/.env)
export const utils_service = "http://localhost:5001"