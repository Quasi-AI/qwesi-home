'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Search, Filter, MapPin, Building, Zap, Clock, ChevronRight,
  ChevronLeft, X, Briefcase, ArrowRight, Heart, User, FileText,
  Upload, Plus, MessageSquare, Send, Globe, Loader2, ExternalLink,
  Building2, Users, DollarSign, Calendar, Target, Award, Star
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { API_ROUTES } from '@/lib/apiRoutes'
import JobCard from '@/components/JobCard'
import LoaderSkeleton from '@/components/SkeletonLoader'
import JobViewModal from '@/modals/JobViewModal'
import ApplicationModal from '@/modals/ApplicationModal'

const JobsPage = () => {
  // State management
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [jobs, setJobs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage] = useState(12)
  const [sortBy, setSortBy] = useState('newest')
  const [savedJobs, setSavedJobs] = useState([])
  const [userApplications, setUserApplications] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    country: '',
    sector: '',
    experience_level: '',
    salary_range: ''
  })

  // Modal states
  const [showJobViewModal, setShowJobViewModal] = useState(false)
  const [showApplicationModalNew, setShowApplicationModalNew] = useState(false)
  const [selectedJobForView, setSelectedJobForView] = useState(null)
  const [selectedJobForApplication, setSelectedJobForApplication] = useState(null)



  // Helper function to extract country from location
  const extractCountryFromLocation = (location) => {
    if (!location) return ''

    const countryPatterns = [
      'Ghana', 'Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Morocco', 'Tunisia',
      'Ethiopia', 'Uganda', 'Tanzania', 'Rwanda', 'Botswana', 'Zambia', 'Zimbabwe',
      'United Kingdom', 'UK', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands',
      'United States', 'USA', 'US', 'Canada', 'Mexico', 'India', 'China', 'Japan'
    ]

    for (const country of countryPatterns) {
      if (location.toLowerCase().includes(country.toLowerCase())) {
        if (country.toLowerCase() === 'uk') return 'United Kingdom'
        if (country.toLowerCase() === 'usa' || country.toLowerCase() === 'us') return 'United States'
        return country
      }
    }

    const parts = location.split(',').map(part => part.trim())
    return parts.length >= 2 ? parts[parts.length - 1] : ''
  }

  // Computed values
  const uniqueLocations = useMemo(() => {
    if (!Array.isArray(jobs)) return []
    const locations = jobs.map(job => job.location).filter(Boolean)
    return [...new Set(locations)].sort()
  }, [jobs])

  const uniqueCountries = useMemo(() => {
    if (!Array.isArray(jobs)) return []
    const countries = jobs.map(job => extractCountryFromLocation(job.location || '')).filter(Boolean)
    return [...new Set(countries)].sort()
  }, [jobs])

  const uniqueSectors = useMemo(() => {
    if (!Array.isArray(jobs)) return []
    const sectors = jobs.map(job => job.sector).filter(Boolean)
    return [...new Set(sectors)].sort()
  }, [jobs])

  const uniqueExperienceLevels = useMemo(() => {
    if (!Array.isArray(jobs)) return []
    const levels = jobs.map(job => job.experience_level).filter(Boolean)
    return [...new Set(levels)].sort((a, b) => {
      const order = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
      return order.indexOf(a) - order.indexOf(b)
    })
  }, [jobs])

  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return []
    let filtered = jobs

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(job =>
        (job.title?.toLowerCase() || '').includes(query) ||
        (job.employer?.toLowerCase() || '').includes(query) ||
        (job.job_description?.toLowerCase() || '').includes(query) ||
        (job.location?.toLowerCase() || '').includes(query) ||
        (job.sector?.toLowerCase() || '').includes(query)
      )
    }

    if (filters.country) {
      filtered = filtered.filter(job => {
        const jobCountry = extractCountryFromLocation(job.location || '')
        return jobCountry === filters.country
      })
    }

    if (filters.location) {
      filtered = filtered.filter(job => job.location === filters.location)
    }
    if (filters.sector) {
      filtered = filtered.filter(job => job.sector === filters.sector)
    }
    if (filters.experience_level) {
      filtered = filtered.filter(job => job.experience_level === filters.experience_level)
    }

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        case 'oldest':
          return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
        case 'title':
          return (a.title || '').localeCompare(b.title || '')
        case 'company':
          return (a.employer || '').localeCompare(b.employer || '')
        default:
          return 0
      }
    })

    return filtered
  }, [jobs, searchQuery, filters, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage))

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * jobsPerPage
    const end = start + jobsPerPage
    return filteredJobs.slice(start, end)
  }, [filteredJobs, currentPage, jobsPerPage])

  // API functions
  const fetchJobs = async () => {
    setLoading(true)
    setError(null)

    try {
      // Build query parameters
      const queryParams = new URLSearchParams()

      if (searchQuery) queryParams.append('search', searchQuery)
      if (filters.location) queryParams.append('location', filters.location)
      if (filters.country) queryParams.append('country', filters.country)
      if (filters.sector) queryParams.append('sector', filters.sector)
      if (filters.experience_level) queryParams.append('experience_level', filters.experience_level)
      if (filters.salary_range) queryParams.append('salary_range', filters.salary_range)
      if (sortBy) queryParams.append('sortBy', sortBy)
      queryParams.append('page', currentPage.toString())
      queryParams.append('limit', jobsPerPage.toString())

      const url = `${API_ROUTES.BASE_URL}getalljobsHome${queryParams.toString() ? '?' + queryParams.toString() : ''}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setJobs(data.data || [])

    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError(err.message || 'Failed to fetch jobs')
      toast.error('Failed to load job opportunities')
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  // Event handlers
  const handleSearch = () => {
    setSearchLoading(true)
    setCurrentPage(1)
    fetchJobs()
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      country: '',
      sector: '',
      experience_level: '',
      salary_range: ''
    })
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    clearFilters()
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

  // Modal handlers
  const handleViewJobDetails = (job) => {
    setSelectedJobForView(job)
    setShowJobViewModal(true)
  }

  const handleApplyToJob = (job) => {
    const authRaw = localStorage.getItem('auth')
    const auth = authRaw ? JSON.parse(authRaw) : null
    if (!auth?.token) {
      // trigger navbar to open login
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:open-login'))
      return
    }
    setSelectedJobForApplication(job)
    setShowApplicationModalNew(true)
  }

  const closeJobViewModal = () => {
    setShowJobViewModal(false)
    setSelectedJobForView(null)
  }

  const closeApplicationModalNew = () => {
    setShowApplicationModalNew(false)
    setSelectedJobForApplication(null)
  }

  // Event listeners for custom events
  useEffect(() => {
    const handleOpenJobApplication = (event) => {
      handleApplyToJob(event.detail)
    }

    window.addEventListener('open-job-application', handleOpenJobApplication)

    return () => {
      window.removeEventListener('open-job-application', handleOpenJobApplication)
    }
  }, [])

  // Effects
  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages))
    }
  }, [filteredJobs.length, totalPages, currentPage])


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#5C3AEB] via-[#5E43D7] to-[#7A59D7] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Discover thousands of career opportunities from top companies worldwide.
              Your next career move starts here.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  type="text"
                  placeholder="Job title, company, or keywords..."
                  className="w-full pl-12 pr-32 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:border-white/50 focus:ring-0 text-lg transition-all duration-200"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                <button
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-[#5C3AEB] px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">{jobs.length}+</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">50+</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">15+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
                  showFilters
                    ? 'bg-[#5C3AEB] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-3 min-h-[44px] text-sm focus:outline-none focus:ring-1 focus:ring-[#5C3AEB] transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Job Title A-Z</option>
                  <option value="company">Company A-Z</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                  <select
                    value={filters.country}
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 min-h-[44px] text-sm focus:outline-none focus:ring-1 focus:ring-[#5C3AEB] transition-colors"
                  >
                    <option value="">All Countries</option>
                    {uniqueCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 min-h-[44px] text-sm focus:outline-none focus:ring-1 focus:ring-[#5C3AEB] transition-colors"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Sector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sector</label>
                  <select
                    value={filters.sector}
                    onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 min-h-[44px] text-sm focus:outline-none focus:ring-1 focus:ring-[#5C3AEB] transition-colors"
                  >
                    <option value="">All Sectors</option>
                    {uniqueSectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                  <select
                    value={filters.experience_level}
                    onChange={(e) => setFilters(prev => ({ ...prev, experience_level: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 min-h-[44px] text-sm focus:outline-none focus:ring-1 focus:ring-[#5C3AEB] transition-colors"
                  >
                    <option value="">All Levels</option>
                    {uniqueExperienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-end gap-2">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-3 min-h-[44px] bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoaderSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-700 mb-2">Failed to Load Jobs</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchJobs}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || Object.values(filters).some(f => f)
                ? 'Try adjusting your search criteria or filters'
                : 'No job listings available at the moment'}
            </p>
            {(searchQuery || Object.values(filters).some(f => f)) && (
              <button
                onClick={clearAllFilters}
                className="px-6 py-2 bg-[#5C3AEB] text-white rounded-lg hover:bg-[#342299] transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && filteredJobs.length > 0 && (
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedJobs.map(job => (
                <div key={job._id} className="group bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#5C3AEB] hover:shadow-lg transition-all duration-300 flex flex-col">
                  <JobCard job={job} onViewDetails={handleViewJobDetails} onApply={handleApplyToJob} />
                </div>
              ))}
            </div>

            {/* Pagination - Mobile Optimized */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mt-6 sm:mt-8">
                <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                  Page {currentPage} of {totalPages}
                </div>

                <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                      const page = currentPage <= 2 ? i + 1 :
                                 currentPage >= totalPages - 1 ? totalPages - 2 + i :
                                 currentPage - 1 + i
                      return page > 0 && page <= totalPages ? (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors min-w-[32px] sm:min-w-[40px] ${
                            page === currentPage
                              ? 'bg-[#5C3AEB] text-white'
                              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ) : null
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Job View Modal */}
      <JobViewModal
        job={selectedJobForView}
        isOpen={showJobViewModal}
        onClose={closeJobViewModal}
      />

      {/* Application Modal */}
      <ApplicationModal
        job={selectedJobForApplication}
        isOpen={showApplicationModalNew}
        onClose={closeApplicationModalNew}
      />
    </div>
  )
}

export default JobsPage
