"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

type Job = {
  job_id: number
  title: string
  description: string
  salary: string
  location: string
  job_type: string
  role: string
  work_location: string
  company_name?: string
  company_logo?: string
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    axios
      .get('/api/job/company/active-jobs')
      .then((res) => {
        if (!mounted) return
        setJobs(res.data || [])
      })
      .catch((err) => {
        console.error('failed to fetch jobs', err)
        setError(err?.response?.data?.message || err.message || 'Failed to load jobs')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Jobs</h1>

        {loading && <p>Loading jobs…</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 gap-4">
          {jobs.map((j) => (
            <div key={j.job_id} className="border rounded-lg p-4 shadow-sm flex items-start gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{j.title}</h2>
                <p className="text-sm text-muted-foreground">{j.company_name} • {j.location}</p>
                <p className="mt-2 text-sm">{j.description?.slice(0, 200)}{j.description && j.description.length > 200 ? '…' : ''}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-sm">{j.salary}</div>
                <Link href={`/jobs/${j.job_id}`} className="px-3 py-1 rounded bg-black text-white text-sm">View</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default JobsPage
