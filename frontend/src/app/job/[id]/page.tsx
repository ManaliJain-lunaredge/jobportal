"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { job_service } from "@/context/AppContext";
import { Job } from "@/type";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { MapPin, Briefcase, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const JobDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`${job_service}/api/job/company/getsinglejob/${id}`);
      setJob(data);
    } catch (err: any) {
      console.error("Failed to fetch job", err);
      toast.error(err?.response?.data?.message || "Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading job...</div>;
  if (!job) return <div className="p-8 text-center text-red-500">Job not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">&larr; Back</Button>
      <Card className="p-6">
        <div className="flex gap-6 items-start">
            <div className="w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100 border relative">
            {job.company_logo ? (
              <Image src={job.company_logo as string} alt={job.company_name as string} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Building2 size={36} className="text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin size={14} /> {job.location || 'Not specified'}</span>
              <span className="flex items-center gap-1"><Briefcase size={14} /> {job.job_type} • {job.work_location}</span>
              <span className="text-sm">{job.company_name}</span>
            </div>

            <div className="mt-4 text-gray-700 whitespace-pre-wrap">{job.description}</div>

            <div className="mt-6 flex items-center gap-4">
              <div className="text-sm text-gray-600">Salary: <strong>{job.salary}</strong></div>
              <div className="text-sm text-gray-600">Openings: <strong>{job.openings}</strong></div>
            </div>

            <div className="mt-6">
              {job.company_website ? (
                <a
                  href={job.company_website.startsWith("http") ? job.company_website : `https://${job.company_website}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button>Visit website</Button>
                </a>
              ) : (
                <Button onClick={() => router.push(`/company/${job.company_id}`)}>View Company</Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobDetail;
