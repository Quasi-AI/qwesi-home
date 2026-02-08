'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  MapPin, Building, Clock, Heart, ArrowLeft, DollarSign, Target,
  User, FileText, Upload, MessageSquare, Send, Globe, Loader2,
  Building2, Users, Calendar, Award, Star, Briefcase, Mail, Phone,
  XCircle, CheckCircle, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { API_ROUTES } from '@/lib/apiRoutes'
import LoginModal from '@/modals/LoginModal'
import SignupModal from '@/modals/SignupModal'
import { readAuth } from '@/lib/auth'

const JobApplicationPage = () => {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = params.id

  // Modal states
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [pendingSubmit, setPendingSubmit] = useState(false)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [job, setJob] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    coverLetter: '',
    experience: '',
    portfolio: '',
    linkedin: '',
    github: '',
    expectedSalary: '',
    availability: 'immediate'
  })
  const [resume, setResume] = useState(null)
  const [errors, setErrors] = useState({})

  // Check auth status and set up event listeners
  useEffect(() => {
    const checkAuth = () => {
      const auth = readAuth()
      if (auth?.token) {
        // User is logged in, ready to submit
        if (pendingSubmit) {
          setPendingSubmit(false)
          // Trigger form submission
          const submitButton = document.querySelector('button[type="submit"]')
          if (submitButton) {
            submitButton.click()
          }
        }
      }
    }

    // Listen for auth events
    const handleAuthLogin = () => {
      console.log('Auth login event received')
      checkAuth()
    }

    window.addEventListener('auth:login-success', handleAuthLogin)
    window.addEventListener('auth:open-login', () => setShowLogin(true))
    
    // Check auth on mount
    checkAuth()

    return () => {
      window.removeEventListener('auth:login-success', handleAuthLogin)
      window.removeEventListener('auth:open-login', () => setShowLogin(true))
    }
  }, [pendingSubmit])

  useEffect(() => {
    if (jobId) {
      fetchJobDetails()
    }
  }, [jobId])

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`${API_ROUTES.BASE_URL}getjobs/${jobId}`)

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Job not found')
          router.push('/jobs')
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
      toast.error('Failed to load job details')
      router.push('/jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          resume: 'File size must be less than 5MB'
        }))
        return
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          resume: 'Please upload a PDF or Word document'
        }))
        return
      }

      setResume(file)
      setErrors(prev => ({
        ...prev,
        resume: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!resume) newErrors.resume = 'Resume is required'
    if (!formData.coverLetter.trim()) newErrors.coverLetter = 'Cover letter is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submit triggered')

    if (!validateForm()) {
      console.log('Form validation failed')
      toast.error('Please fill in all required fields')
      return
    }
    console.log('Form validation passed')

    // Check authentication
    const authRaw = localStorage.getItem('auth')
    const auth = authRaw ? JSON.parse(authRaw) : null
    console.log('Auth data:', auth)
    
    if (!auth?.token) {
      console.log('No auth token found, setting pending submit and opening login')
      setPendingSubmit(true)
      setShowLogin(true)
      return
    }
    console.log('Auth token found, proceeding with submission')

    setSubmitting(true)

    try {
      console.log('Starting API call...')
      const formDataToSend = new FormData()

      // Add form data
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key])
      })

      // Add job ID
      formDataToSend.append('jobId', jobId)

      // Add resume file
      if (resume) {
        formDataToSend.append('resume', resume)
      }

      console.log('FormData prepared, making API call to:', `${API_ROUTES.BASE_URL}applications/submit`)

      // Send the application to the API - using the correct endpoint from ApplicationModal
      const response = await fetch(`${API_ROUTES.BASE_URL}applications/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        },
        body: formDataToSend
      })

      console.log('API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('API result:', result)

      if (result.success) {
        toast.success('Application submitted successfully!')
        router.push('/dashboard')
      } else {
        throw new Error(result.message || 'Failed to submit application')
      }

    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error(error.message || 'Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#5C3AEB] mx-auto mb-4" />
          <p className="text-gray-600">Loading application form...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md mx-4">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Job Not Found</h3>
            <p className="text-gray-600 mb-4">The job you're trying to apply for doesn't exist.</p>
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
            href={`/jobs/${jobId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#5C3AEB] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Job Details
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Apply for {job.title}
              </h1>
              <p className="text-gray-600">{job.employer} • {job.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-transparent ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-transparent ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-transparent ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Resume & Documents
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume/CV * (PDF or Word document, max 5MB)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#5C3AEB] transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-[#5C3AEB] hover:text-[#342299] focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="resume-upload"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                </div>
              </div>
              {resume && (
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{resume.name}</span>
                </div>
              )}
              {errors.resume && (
                <p className="mt-1 text-sm text-red-600">{errors.resume}</p>
              )}
            </div>
          </div>

          {/* Cover Letter */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Cover Letter
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why are you interested in this position? *
              </label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-transparent ${
                  errors.coverLetter ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Tell us about yourself, your experience, and why you're interested in this role..."
              />
              {errors.coverLetter && (
                <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Additional Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-transparent"
                >
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Salary
                </label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-transparent"
                  placeholder="e.g., $50,000 - $70,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-transparent"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-transparent"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-transparent"
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-transparent"
                >
                  <option value="immediate">Immediately</option>
                  <option value="2-weeks">In 2 weeks</option>
                  <option value="1-month">In 1 month</option>
                  <option value="3-months">In 3 months</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                By submitting this application, you agree to our terms and conditions.
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#5C3AEB] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#342299] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLogin}
        onClose={() => {
          setShowLogin(false)
          setPendingSubmit(false)
        }}
        onSwitchToSignup={() => {
          setShowLogin(false)
          setShowSignup(true)
        }}
        onLoggedIn={() => {
          // Dispatch custom event for other components
          window.dispatchEvent(new Event('auth:login-success'))
          // Auto-submit after successful login
          if (pendingSubmit) {
            setPendingSubmit(false)
            const submitButton = document.querySelector('button[type="submit"]')
            if (submitButton) {
              submitButton.click()
            }
          }
        }}
      />

      {/* Signup Modal */}
      <SignupModal 
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false)
          setShowLogin(true)
        }}
      />
    </div>
  )
}

export default JobApplicationPage
