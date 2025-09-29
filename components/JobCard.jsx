'use client'
import React from 'react'
import { MapPin, Building, Clock, Heart, ArrowRight, DollarSign, Target } from 'lucide-react'


const JobCard = ({ job, onViewDetails, onApply }) => {
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

  const handleViewDetails = (e) => {
    e.preventDefault()
    if (onViewDetails) {
      onViewDetails(job)
    } else {
      // Navigate to jobs page with job details
      window.location.href = `/jobs?job=${job._id}`
    }
  }

  const handleApply = (e) => {
    e.preventDefault()
    if (onApply) {
      onApply(job)
    } else {
      // Navigate to jobs page for application
      window.location.href = `/jobs?job=${job._id}&apply=true`
    }
  }

  return (
    <div className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Job Header */}
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#5C3AEB] transition-colors line-clamp-2 leading-tight">
            {job.title}
          </h3>
          <p className="text-base text-[#5C3AEB] font-semibold truncate">{job.employer}</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-4 flex-grow">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Building className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{job.sector}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Target className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(job.experience_level)}`}>
            {job.experience_level}
          </span>
        </div>
        
        {job.salary && (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="font-semibold text-green-600 truncate">{job.salary}</span>
          </div>
        )}
      </div>

      {/* Job Description Preview */}
      <div className="mb-4 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {job.job_description}
        </p>
      </div>

      {/* Posted Date */}
      <div className="flex items-center text-xs text-gray-500 mb-4">
        <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
        <span className="truncate">Posted {formatDate(job.posted || job.created_at)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-auto">
        <button
          onClick={handleViewDetails}
          className="text-sm font-semibold text-[#5C3AEB] hover:text-[#342299] transition-colors flex items-center gap-1"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        <button
          onClick={handleApply}
          className="px-4 py-2 bg-[#5C3AEB] text-white text-sm font-semibold rounded-lg hover:bg-[#342299] transition-colors"
        >
          Apply Now
        </button>
      </div>
    </div>
  )
}

export default JobCard