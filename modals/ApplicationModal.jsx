'use client'
import React, { useState, useRef } from 'react'
import { X, User, FileText, Zap, MessageSquare, Send, Upload, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { API_ROUTES } from '@/lib/apiRoutes'

const ApplicationModal = ({ job, isOpen, onClose, onSubmitSuccess }) => {
  const [applicationLoading, setApplicationLoading] = useState(false)
  const [applicationErrors, setApplicationErrors] = useState({})
  const [resumeFile, setResumeFile] = useState(null)
  const [newSkill, setNewSkill] = useState('')
  const fileInputRef = useRef(null)

  const [applicationForm, setApplicationForm] = useState({
    jobId: job?._id || '',
    applicantDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      portfolio: ''
    },
    coverLetter: '',
    skills: [],
    experience: {
      years: 0,
      description: ''
    }
  })

  if (!isOpen || !job) return null

  const handleFileUpload = (event) => {
    const target = event.target
    const file = target.files?.[0]
    
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, DOC, or DOCX file')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      
      setResumeFile(file)
      setApplicationErrors(prev => ({ ...prev, resume: '' }))
      toast.success('Resume uploaded successfully')
    }
  }

  const removeFile = () => {
    setResumeFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !applicationForm.skills.includes(newSkill.trim())) {
      setApplicationForm(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (index) => {
    setApplicationForm(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const validateApplicationForm = (formData, resumeFile) => {
    const errors = {}
    
    if (!applicationForm.applicantDetails.firstName?.trim()) {
      errors.firstName = 'First name is required'
    }

    if (!applicationForm.applicantDetails.lastName?.trim()) {
      errors.lastName = 'Last name is required'
    }

    if (!applicationForm.applicantDetails.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(applicationForm.applicantDetails.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!applicationForm.applicantDetails.phone?.trim()) {
      errors.phone = 'Phone number is required'
    }

    if (!resumeFile) {
      errors.resume = 'Resume is required'
    } else {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(resumeFile.type)) {
        errors.resume = 'Please upload a PDF, DOC, or DOCX file'
      }

      if (resumeFile.size > 5 * 1024 * 1024) {
        errors.resume = 'File size must be less than 5MB'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  const submitApplication = async (e) => {
    e.preventDefault()
    
    const validation = validateApplicationForm(null, resumeFile)
    
    if (!validation.isValid) {
      setApplicationErrors(validation.errors)
      toast.error('Please correct the errors in the form')
      return
    }

    setApplicationLoading(true)
    setApplicationErrors({})

    try {
      const authRaw = localStorage.getItem('auth')
      const auth = authRaw ? JSON.parse(authRaw) : null
      const token = auth?.token

      const applicationData = new FormData()
      applicationData.append('jobId', job._id)
      applicationData.append('applicantDetails', JSON.stringify(applicationForm.applicantDetails))
      applicationData.append('coverLetter', applicationForm.coverLetter || '')
      applicationData.append('skills', JSON.stringify(applicationForm.skills))
      applicationData.append('experience', JSON.stringify(applicationForm.experience))
      
      if (resumeFile) {
        applicationData.append('resume', resumeFile)
      }
      
      const response = await fetch(`${API_ROUTES.BASE_URL}/applications/submit`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: applicationData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        toast.success('Application submitted successfully!')
        onClose()
        if (onSubmitSuccess) onSubmitSuccess()
        resetApplicationForm()
      } else {
        throw new Error(result.message || 'Failed to submit application')
      }
      
    } catch (error) {
      console.error('Application error:', error)
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setApplicationLoading(false)
    }
  }

  const resetApplicationForm = () => {
    setApplicationForm({
      jobId: job?._id || '',
      applicantDetails: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        linkedin: '',
        portfolio: ''
      },
      coverLetter: '',
      skills: [],
      experience: {
        years: 0,
        description: ''
      }
    })
    setResumeFile(null)
    setNewSkill('')
    setApplicationErrors({})
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    resetApplicationForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Apply for Position</h2>
              <p className="text-[#5C3AEB] font-semibold">{job.title} at {job.employer}</p>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={submitApplication} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-lg font-semibold">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">First Name *</label>
                  <input
                    type="text"
                    value={applicationForm.applicantDetails.firstName}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      applicantDetails: { ...prev.applicantDetails, firstName: e.target.value }
                    }))}
                    className={`w-full border rounded-lg px-3 py-3 min-h-[44px] focus:outline-none focus:ring-1 focus:ring-[#5C3AEB] transition-colors ${
                      applicationErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {applicationErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{applicationErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={applicationForm.applicantDetails.lastName}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      applicantDetails: { ...prev.applicantDetails, lastName: e.target.value }
                    }))}
                    className={`w-full border rounded-lg px-3 py-3 min-h-[44px] focus:outline-none focus:ring-1 focus:ring-[#5C3AEB] transition-colors ${
                      applicationErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {applicationErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{applicationErrors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={applicationForm.applicantDetails.email}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      applicantDetails: { ...prev.applicantDetails, email: e.target.value }
                    }))}
                    className={`w-full border rounded-lg px-3 py-3 min-h-[44px] focus:outline-none focus:ring-1 focus:ring-[#5C3AEB] transition-colors ${
                      applicationErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                  {applicationErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{applicationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={applicationForm.applicantDetails.phone}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      applicantDetails: { ...prev.applicantDetails, phone: e.target.value }
                    }))}
                    className={`w-full border rounded-lg px-3 py-3 min-h-[44px] focus:outline-none focus:ring-1 focus:ring-[#5C3AEB] transition-colors ${
                      applicationErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {applicationErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{applicationErrors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Upload Section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="w-5 h-5 text-blue-600" />
                Resume/CV
              </h4>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Upload Resume *</label>
                
                {!resumeFile ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#5C3AEB] transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload resume</p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-[#5C3AEB]" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{resumeFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden" 
                />
                
                {applicationErrors.resume && (
                  <p className="text-red-500 text-xs mt-1">{applicationErrors.resume}</p>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-lg font-semibold">
                <Zap className="w-5 h-5 text-blue-600" />
                Skills
              </h4>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Add Skills</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-3 min-h-[44px] focus:outline-none focus:ring-1 focus:ring-[#5C3AEB] transition-colors"
                    placeholder="Enter a skill"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-3 min-h-[44px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {applicationForm.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {applicationForm.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter Section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-lg font-semibold">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Cover Letter
              </h4>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Cover Letter (Optional)</label>
                <textarea
                  value={applicationForm.coverLetter}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                  rows={6}
                  maxLength={5000}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-[#5C3AEB] transition-colors resize-vertical"
                  placeholder="Write a personalized cover letter for this position..."
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {applicationForm.coverLetter.length}/5000 characters
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={applicationLoading}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={applicationLoading}
              className="flex-1 px-4 py-2 bg-[#5C3AEB] text-white rounded-lg hover:bg-[#342299] disabled:opacity-50 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              {applicationLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApplicationModal
