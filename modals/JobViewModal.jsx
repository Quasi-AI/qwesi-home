'use client'
import React from 'react'
import { X, MapPin, Building, Target, DollarSign, Star, Clock } from 'lucide-react'

const JobViewModal = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              <p className="text-lg text-[#5C3AEB] font-semibold mt-1">{job.employer}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid gap-6">
            {/* Job Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Location</div>
                  <div className="font-semibold">{job.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Sector</div>
                  <div className="font-semibold">{job.sector}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Experience</div>
                  <div className="font-semibold">{job.experience_level}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Salary</div>
                  <div className="font-semibold text-green-600">{job.salary}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Posted</div>
                  <div className="font-semibold">{formatDate(job.posted || job.created_at)}</div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Job Description</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">{job.job_description}</p>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#5C3AEB] flex-shrink-0" />
                  {job.experience_length || 'Relevant experience'} in related field
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#5C3AEB] flex-shrink-0" />
                  Strong communication and teamwork skills
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#5C3AEB] flex-shrink-0" />
                  Relevant certifications or degrees preferred
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose()
                // Trigger application modal - this will be handled by parent
                window.dispatchEvent(new CustomEvent('open-job-application', { detail: job }))
              }}
              className="px-6 py-2 bg-[#5C3AEB] text-white rounded-lg hover:bg-[#342299] transition-colors font-semibold"
            >
              Apply for this Position
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobViewModal
