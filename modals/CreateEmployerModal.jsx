"use client"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useAuthStore } from '@/stores/authStore'

const CreateEmployerModal = ({ onClose, onSubmit }) => {
  const authStore = useAuthStore()
  
  const [formData, setFormData] = useState({
    user_id: authStore.user?.id || '',
    id: null,
    title: '',
    email: '',
    employer: '',
    location: '',
    salary: '',
    jobType: '',
    experience_level: '',
    skills: '',
    job_description: '',
    deadline: '',
    status: 'active'
  })
  const [loading, setLoading] = useState(false)

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const submitData = {
        ...formData,
        user_id: authStore.user?.id || formData.user_id
      }
      const result = await onSubmit(submitData)
      if (result.success) {
        onClose()
      }
    } catch (error) {
      console.error('Create job error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="relative bg-white rounded-lg max-w-3xl w-full my-8 shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-lg z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Create New Job</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              type="button"
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
          {/* Hidden fields */}
          <input type="hidden" name="user_id" value={formData.user_id} />
          <input type="hidden" name="id" value={formData.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-[#5C3AEB] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company/Employer *</label>
              <input
                type="text"
                value={formData.employer}
                onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-[#5C3AEB] outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-[#5C3AEB] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-[#5C3AEB] outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Salary *</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-[#5C3AEB] outline-none"
                placeholder="e.g., $50,000 - $70,000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Type *</label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-[#5C3AEB] outline-none"
                required
              >
                <option value="">Select Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Experience Level *</label>
              <select
                value={formData.experience_level}
                onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-[#5C3AEB] outline-none"
                required
              >
                <option value="">Select Experience Level</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Application Deadline *</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-[#5C3AEB] outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Required Skills *</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-[#5C3AEB] outline-none"
              placeholder="e.g., JavaScript, React, Node.js (comma separated)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Description *</label>
            <textarea
              value={formData.job_description}
              onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5C3AEB] focus:border-[#5C3AEB] outline-none resize-none"
              placeholder="Describe the job responsibilities, requirements, and benefits..."
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sticky bottom-0 bg-white pb-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300 w-full sm:w-auto"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-[#5C3AEB] hover:bg-[#4c2dd4] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEmployerModal