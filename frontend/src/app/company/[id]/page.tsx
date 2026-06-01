"use client";

import React, { useEffect, useState } from "react";
import { useAppData } from "@/context/AppContext";
import axios from "axios";
import { job_service } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Company, Job, JobPayload } from "@/type";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Building2, Globe, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const CompanyDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { accessToken, user } = useAppData();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // form state
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [salary, setSalary] = useState<number | string>("");
  const [locationField, setLocationField] = useState<string>("");
  const [roleField, setRoleField] = useState<string>("");
  const [jobType, setJobType] = useState<Job["job_type"]>("Full-time");
  const [workLocation, setWorkLocation] = useState<Job["work_location"]>("On-site");
  const [openings, setOpenings] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);

  const fetchCompany = async () => {
    if (!accessToken || !id) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`${job_service}/api/job/company/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCompany(data);
    } catch (error: any) {
      console.error("Failed to fetch company details", error);
      toast.error(error?.response?.data?.message || "Failed to load company");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id, accessToken]);

  // if the URL has ?create=1 open the create modal
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams?.get('create') === '1') {
      openCreateModal();
    }
  }, [searchParams]);

  const openCreateModal = () => {
    setEditingJob(null);
    setTitle("");
    setDescription("");
    setSalary("");
    setLocationField("");
    setRoleField("");
    setJobType("Full-time");
    setWorkLocation("On-site");
    setOpenings(1);
    setIsActive(true);
    setJobModalOpen(true);
  };

  const openEditModal = (job: any) => {
    setEditingJob(job);
    setTitle(job.title || "");
    setDescription(job.description || "");
    setSalary(String(job.salary || ""));
    setLocationField(job.location || "");
    setRoleField(job.role || "");
    setJobType(job.job_type || "Full-time");
    setWorkLocation(job.work_location || "On-site");
    setOpenings(job.openings || 1);
    setIsActive(job.is_active ?? true);
    setJobModalOpen(true);
  };

  const submitJob = async () => {
    if (!accessToken || !company) return toast.error("Not authenticated or company missing");
      try {
      const payload: JobPayload = {
        title,
        description,
        salary,
        location: locationField,
        role: roleField,
        job_type: jobType,
        work_location: workLocation,
        company_id: company.company_id,
        openings,
        is_active: isActive,
      };

      if (editingJob) {
        const { data } = await axios.post(`${job_service}/api/job/update-job/${editingJob.job_id}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        toast.success(data.message || "Job updated");
      } else {
        const { data } = await axios.post(`${job_service}/api/job/create-job`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        toast.success(data.message || "Job created");
      }
      setJobModalOpen(false);
      fetchCompany();
    } catch (error: any) {
      console.error("Job submit error", error);
      toast.error(error?.response?.data?.message || "Failed to submit job");
    }
  };

  const toggleJobActive = async (job: Job) => {
    if (!accessToken) return toast.error("Not authenticated");
    try {
      setLoading(true);
      const payload: JobPayload = {
        title: job.title,
        description: job.description,
        salary: job.salary,
        location: job.location || "",
        role: job.role,
        job_type: job.job_type,
        work_location: job.work_location,
        company_id: job.company_id,
        openings: job.openings,
        is_active: !job.is_active,
      };

      const { data } = await axios.post(`${job_service}/api/job/update-job/${job.job_id}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast.success(data.message || (job.is_active ? "Job deactivated" : "Job activated"));
      await fetchCompany();
    } catch (error: any) {
      console.error("Toggle job active error", error);
      toast.error(error?.response?.data?.message || "Failed to update job status");
    } finally {
      setLoading(false);
    }
  };

  if (!accessToken) {
    return <div className="p-8 text-center">Please wait... (Authenticating)</div>;
  }

  if (loading) {
    return <div className="p-8 text-center">Loading company details...</div>;
  }

  if (!company) {
    return <div className="p-8 text-center text-red-500">Company not found or access denied.</div>;
  }

  const activeJobs = (company.jobs || []).filter((j: any) => j.is_active);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        &larr; Back
      </Button>

      <Card className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {company.logo ? (
            <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 border relative">
              <Image 
                src={company.logo} 
                alt={company.name} 
                fill 
                className="object-cover" 
              />
            </div>
          ) : (
            <div className="w-24 h-24 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center border">
              <Building2 size={40} className="text-gray-400" />
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
            <div className="flex flex-wrap text-sm text-gray-500 gap-4 mb-4">
              {company.website && (
                <a 
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600 hover:underline"
                >
                  <Globe size={16} />
                  {company.website}
                </a>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {company.description}
            </p>
          </div>
        </div>

        <div className="mt-12">
          {/* <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Briefcase size={20} />
            Jobs at {company.name}
          </h2> */}
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Briefcase size={20} /> Jobs at {company.name}
            </h2>
            {user?.role === "recruiter" && (
              <Button variant="secondary" onClick={openCreateModal}>Create job</Button>
            )}
          </div>

          {activeJobs && activeJobs.length > 0 ? (
            <div className="grid gap-4">
              {activeJobs.map((job: any) => (
                <div key={job.job_id} className="p-4 border rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded capitalize">
                      {job.job_type}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {job.location || 'Not specified'} ({job.work_location})
                    </span>
                    <span>Role: {job.role}</span>
                  </div>
                  <p className="text-sm line-clamp-2 text-gray-600 dark:text-gray-400">
                    {job.description}
                  </p>
                  {user?.role === "recruiter" && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => router.push(`/job/${job.job_id}`)}>View</Button>
                      <Button size="sm" variant="ghost" onClick={() => openEditModal(job)}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => toggleJobActive(job)}>
                        {job.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed rounded-lg text-gray-500">
              No active jobs posted by this company yet.
            </div>
          )}
        </div>
      </Card>
      {/* Job create / edit modal */}
      <Dialog open={jobModalOpen} onOpenChange={(open) => setJobModalOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingJob ? "Edit Job" : "Create Job"}</DialogTitle>
            <DialogDescription>{editingJob ? "Update job details" : "Fill details to create a new job"}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 mt-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Salary</Label>
                <Input value={salary} onChange={(e) => setSalary(e.target.value)} />
              </div>
              <div>
                <Label>Openings</Label>
                <Input type="number" value={String(openings)} onChange={(e) => setOpenings(Number(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Location</Label>
                <Input value={locationField} onChange={(e) => setLocationField(e.target.value)} />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={roleField} onChange={(e) => setRoleField(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Job Type</Label>
                <select className="w-full p-2 border rounded" value={jobType} onChange={(e) => setJobType(e.target.value as Job["job_type"])}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
              <div>
                <Label>Work Location</Label>
                <select className="w-full p-2 border rounded" value={workLocation} onChange={(e) => setWorkLocation(e.target.value as Job["work_location"])}>
                  <option>On-site</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} id="is_active" />
              <label htmlFor="is_active" className="text-sm">Active</label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={submitJob} disabled={loading}>{editingJob ? "Update" : "Create"}</Button>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyDetail;
