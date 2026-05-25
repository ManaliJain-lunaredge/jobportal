"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { CarrierGuideResponse } from "@/type";
import {utils_service} from "@/context/AppContext"
import axios from "axios";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "./ui/dialog";
import { 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  Dot, 
  Lightbulb, 
  Loader, 
  Sparkles, 
  Target, 
  TrendingUp, 
  X 
} from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import toast from "react-hot-toast";

export default function CareerGuide() {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CarrierGuideResponse | null>(null);

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addSkill();
    }
  };

  const careerGuidance = async () => {
    if (skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${utils_service}/api/utils/career`, { skills: skills });
      setResponse(data);
      toast.success("Carrer Guidance Generated")
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setCurrentSkill("");
    setResponse(null);
    setOpen(false);
    setSkills([]);
  };

  return (
    <section className="bg-background/60 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            AI Career Guide — Your roadmap to a future-proof career
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose a path, follow curated learning steps, and land the role you want. Each track includes skills, suggested resources, and an easy starter project.
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size={"lg"} className="mt-8 gap-2 h-12 px-8">
                <Sparkles size={18} /> Get Career Guidance <ArrowRight size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {!response ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      <Sparkles className="text-blue-600" /> Tell us about your skills
                    </DialogTitle>
                    <DialogDescription>Add your technical skills to receive personalized career guidance</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="skill">Add Skills</Label>
                      <div className="flex gap-2">
                        <Input
                          id="skill"
                          placeholder="e.g., React, Node.js, AWS"
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          onKeyDown={handleKeyPress}
                          className="h-11"
                        />
                        <Button onClick={addSkill} variant="secondary">Add</Button>
                      </div>
                    </div>
                  </div>

                  {skills.length > 0 && (
                    <div className="space-y-4">
                      <Label>Your Skills ({skills.length})</Label>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((s) => (
                          <div key={s} className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800">
                            <span className="text-sm font-medium">{s}</span>
                            <button 
                              onClick={() => removeSkill(s)} 
                              className="h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={careerGuidance} 
                        disabled={loading || skills.length === 0} 
                        className="w-full h-11 gap-2"
                      >
                        {loading ? (
                          <><Loader size={18} className="animate-spin" /> Analyzing Your Skills...</>
                        ) : (
                          <><Sparkles size={18} /> Generate Career Guidance</>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      <Target className="text-blue-600" /> Your Personalized Career Guide
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    {/* Summary */}
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="text-blue-600 shrink-0 mt-1" size={20} />
                        <div>
                          <h3 className="font-semibold">Career Summary</h3>
                          <p className="text-sm leading-relaxed opacity-90">{response.summary}</p>
                        </div>
                      </div>
                    </div>

                    {/* Job Options */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Briefcase size={20} className="text-blue-600" />
                        Recommended Career Paths
                      </h3>
                      <div className="space-y-3">
                        {response.jobOptions.map((job, index) => (
                          <div className="p-4 rounded-lg border hover:border-blue-500 transition-colors" key={index}>
                            <h4 className="font-semibold text-base mb-2">{job.title}</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium opacity-70">Responsibilities: </span>
                                <span className="opacity-80">{job.responsibilities}</span>
                              </div>
                              <div>
                                <span className="font-medium opacity-70">Why this role: </span>
                                <span className="opacity-80">{job.why}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills to Learn */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" />
                        Skills to Enhance Your Career
                      </h3>
                      <div className="space-y-4">
                        {response.skillsToLearn.map((category, index) => (
                          <div className="space-y-2" key={index}>
                            <h4 className="font-semibold text-sm text-blue-600">{category.category}</h4>
                            <div className="space-y-2">
                              {category.skills.map((skill, sindex) => (
                                <div key={sindex} className="p-3 rounded-lg bg-secondary border text-sm">
                                  <p className="font-medium mb-1">{skill.title}</p>
                                  <p className="text-xs opacity-70 mb-1"><span className="font-medium">Why: </span>{skill.why}</p>
                                  <p className="text-xs opacity-70 mb-1"><span className="font-medium">How: </span>{skill.how}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Learning Approach */}
                    <div className="p-4 rounded-lg border bg-blue-950/5">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <BookOpen size={20} className="text-blue-600" /> {response.learningApproach.title}
                      </h3>
                      <ul className="space-y-2">
                        {response.learningApproach.points.map((point, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5"><Dot /></span>
                            <span className="opacity-90" dangerouslySetInnerHTML={{ __html: point }}></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button onClick={resetDialog} variant={"outline"} className="w-full">
                      Start New Analysis
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}