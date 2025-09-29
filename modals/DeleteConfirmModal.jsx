"use client"
import { AlertTriangle } from "lucide-react"
import { useEffect } from "react"

const DeleteConfirmModal = ({ employer, onConfirm, onClose, loading }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!employer) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="relative bg-white rounded-lg max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Job</h3>
              <p className="text-sm text-slate-600">This action cannot be undone</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5C3AEB]/10 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-[#5C3AEB] font-semibold text-lg">
                  {employer.title?.charAt(0) || employer.employer?.charAt(0) || 'J'}
                </span>
              </div>
              <div className="min-w-0">
                <div className="font-medium text-slate-900 truncate">
                  {employer.title || 'Job Position'}
                </div>
                <div className="text-sm text-slate-600 truncate">
                  {employer.employer || 'Company Name'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-red-800 mb-2">Warning</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• This job posting will be permanently removed</li>
              <li>• All application data will be deleted</li>
              <li>• Applicants will no longer see this listing</li>
              <li>• This action cannot be reversed</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </div>
              ) : (
                'Delete Job'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal