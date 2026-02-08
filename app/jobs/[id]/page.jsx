'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  MapPin, Building, Clock, Heart, ArrowLeft, DollarSign, Target,
  User, FileText, Upload, MessageSquare, Send, Globe, Loader2,
  Building2, Users, Calendar, Award, Star, Briefcase, Mail, Phone, XCircle, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { API_ROUTES } from '@/lib/apiRoutes'

const JobDetailsPage = () => {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [job, setJob] = useState(null)
  const [savedJobs, setSavedJobs] = useState([])
  const [userApplications, setUserApplications] = useState([])
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (jobId) {
      fetchJobDetails()
    }
  }, [jobId])

  const fetchJobDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_ROUTES.BASE_URL}getjobs/${jobId}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('Job not found')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setJob(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch job details')
      }
    } catch (err) {
      console.error('Error fetching job details:', err)
      setError(err.message || 'Failed to fetch job details')
      toast.error('Failed to load job details')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''

    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) return 'yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
      if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`

      return date.toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const getExperienceColor = (level) => {
    switch (level) {
      case 'Entry Level': return 'bg-green-100 text-green-800'
      case 'Mid Level': return 'bg-blue-100 text-blue-800'
      case 'Senior Level': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const saveJob = (job) => {
    const index = savedJobs.indexOf(job._id)
    if (index > -1) {
      setSavedJobs(prev => prev.filter(id => id !== job._id))
      toast.success('Job removed from saved')
    } else {
      setSavedJobs(prev => [...prev, job._id])
      toast.success('Job saved successfully')
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#5C3AEB] mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Job Not Found</h3>
            <p className="text-gray-600 mb-4">{error || 'The job you are looking for does not exist.'}</p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#5C3AEB] text-white rounded-lg hover:bg-[#342299] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#5C3AEB] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-lg text-[#5C3AEB] font-semibold mb-4">{job.employer}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span>{job.sector}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(job.experience_level)}`}>
                        {job.experience_level}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Posted {formatDate(job.posted || job.created_at)}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-green-600">{job.salary}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => saveJob(job)}
                  className={`p-3 rounded-xl transition-colors ${
                    savedJobs.includes(job._id)
                      ? 'bg-red-50 text-red-500 hover:bg-red-100'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${savedJobs.includes(job._id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Apply Button */}
              <div className="flex gap-4">
                <Link
                  href={`/jobs/${jobId}/apply`}
                  className="flex-1 bg-[#5C3AEB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#342299] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Apply Now
                </Link>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.job_description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.benefits}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About the Company</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{job.employer}</span>
                </div>
                {job.company_website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a
                      href={job.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5C3AEB] hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                {job.company_size && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{job.company_size} employees</span>
                  </div>
                )}
              </div>
            </div>

            {/* Job Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Job Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Type</span>
                  <span className="font-medium">{job.job_type || 'Full-time'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{job.experience_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary</span>
                    <span className="font-medium text-green-600">{job.salary}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            {(job.contact_email || job.contact_phone) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {job.contact_email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <a
                        href={`mailto:${job.contact_email}`}
                        className="text-[#5C3AEB] hover:underline"
                      >
                        {job.contact_email}
                      </a>
                    </div>
                  )}
                  {job.contact_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <a
                        href={`tel:${job.contact_phone}`}
                        className="text-[#5C3AEB] hover:underline"
                      >
                        {job.contact_phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailsPage
