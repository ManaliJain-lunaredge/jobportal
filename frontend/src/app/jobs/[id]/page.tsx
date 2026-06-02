"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'

const JobDetailPage = () => {
  const params = useParams() as any
  const id = params?.id
  const [job, setJob] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let mounted = true
    setLoading(true)
    axios
      .get(`/api/job/company/getsinglejob/${id}`)
      .then((res) => {
        if (!mounted) return
        setJob(res.data)
      })
      .catch((err) => {
        console.error('failed to fetch job', err)
        setError(err?.response?.data?.message || err.message || 'Failed to load job')
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <div className="p-8">Loading…</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>
  if (!job) return <div className="p-8">Job not found</div>

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <p className="text-sm text-muted-foreground mb-4">{job.company_name} • {job.location}</p>
        <div className="mb-4">
          <strong>Salary:</strong> {job.salary}
        </div>
        <div className="prose">
          <p>{job.description}</p>
        </div>
      </div>
    </div>
  )
}

export default JobDetailPage
