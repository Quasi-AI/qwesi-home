'use client'
import React, { useState, useEffect, useMemo, Suspense } from 'react'
import {
  Search, Filter, MapPin, GraduationCap, BookOpen, Clock,
  ChevronRight, ChevronLeft, X, ArrowRight, Heart, DollarSign,
  Calendar, Globe, Loader2, Briefcase, Award, Star
} from 'lucide-react'
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from 'react-toastify'
import { useSubscriptionStore } from '@/stores/subscriptionStore'
import SubscriptionModal from '@/modals/SubscriptionModal'

// Separate component that uses useSearchParams
const ScholarshipsWithParams = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  // State management
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [scholarships, setScholarships] = useState([])
  const [viewingScholarship, setViewingScholarship] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [scholarshipsPerPage] = useState(12)
  const [sortBy, setSortBy] = useState('deadline')
  const [savedScholarships, setSavedScholarships] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  // Subscription store
  const { isPro } = useSubscriptionStore()

  // Check authentication and subscription status
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    country: '',
    studyLevel: '',
    fieldOfStudy: '',
    status: ''
  })

  // Computed values
  const filteredScholarships = useMemo(() => {
    let result = [...scholarships]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(scholarship =>
        scholarship.title?.toLowerCase().includes(query) ||
        scholarship.provider?.toLowerCase().includes(query) ||
        scholarship.description?.toLowerCase().includes(query) ||
        scholarship.country?.toLowerCase().includes(query) ||
        scholarship.fieldOfStudy?.toLowerCase().includes(query)
      )
    }

    // Apply other filters
    if (filters.country) {
      result = result.filter(s => s.country === filters.country)
    }
    if (filters.studyLevel) {
      result = result.filter(s => s.studyLevel === filters.studyLevel)
    }
    if (filters.fieldOfStudy) {
      result = result.filter(s => s.fieldOfStudy === filters.fieldOfStudy)
    }
    if (filters.status) {
      result = result.filter(s => {
        const status = getApplicationStatus(s.deadline || '')
        switch (filters.status) {
          case 'open': return status === 'Open'
          case 'closing-soon': return status === 'Closing Soon'
          case 'closed': return status === 'Closed'
          default: return true
        }
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          const dateA = new Date(a.deadline || '9999-12-31').getTime()
          const dateB = new Date(b.deadline || '9999-12-31').getTime()
          return dateA - dateB
        case 'amount':
          return (b.amount || 0) - (a.amount || 0)
        case 'newest':
          const createdA = new Date(a.created_at || a.createdAt || '1970-01-01').getTime()
          const createdB = new Date(b.created_at || b.createdAt || '1970-01-01').getTime()
          return createdB - createdA
        case 'title':
          return (a.title || '').localeCompare(b.title || '')
        default:
          return 0
      }
    })

    return result
  }, [scholarships, searchQuery, filters, sortBy])

  const paginatedScholarships = useMemo(() => {
    let scholarshipsToShow = filteredScholarships

    // For authenticated but non-subscribed users, limit to first 3 scholarships
    if (!isSubscribed) {
      scholarshipsToShow = filteredScholarships.slice(0, 3)
    }

    const start = (currentPage - 1) * scholarshipsPerPage
    const end = start + scholarshipsPerPage
    return scholarshipsToShow.slice(start, end)
  }, [filteredScholarships, currentPage, scholarshipsPerPage, isAuthenticated, isSubscribed])

  const totalPages = Math.max(1, Math.ceil(filteredScholarships.length / scholarshipsPerPage))

  const uniqueCountries = useMemo(() => {
    return [...new Set(scholarships.map(s => s.country).filter(Boolean))].sort()
  }, [scholarships])

  const uniqueStudyLevels = useMemo(() => {
    return [...new Set(scholarships.map(s => s.studyLevel).filter(Boolean))].sort()
  }, [scholarships])

  const uniqueFields = useMemo(() => {
    return [...new Set(scholarships.map(s => s.fieldOfStudy).filter(Boolean))].sort()
  }, [scholarships])

  // Utility functions
  const formatAmount = (amount, currency = 'USD') => {
    if (!amount || amount === 0) return 'Amount not specified'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDeadline = (deadline) => {
    if (!deadline) return 'No deadline specified'
    const date = new Date(deadline)
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false
    const deadlineDate = new Date(deadline)
    const now = new Date()
    return deadlineDate < now
  }

  const getDeadlineClass = (deadline) => {
    if (!deadline) return ''
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntil < 0) return 'text-red-600'
    if (daysUntil <= 30) return 'text-orange-600'
    return 'text-gray-600'
  }

  const getApplicationStatus = (deadline) => {
    if (!deadline) return 'Open'
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntil < 0) return 'Closed'
    if (daysUntil <= 30) return 'Closing Soon'
    return 'Open'
  }

  const getStatusTagClass = (deadline) => {
    const status = getApplicationStatus(deadline)
    switch (status) {
      case 'Closed': return 'bg-red-100 text-red-700'
      case 'Closing Soon': return 'bg-orange-100 text-orange-700'
      default: return 'bg-green-100 text-green-700'
    }
  }

  // API functions
  const fetchScholarships = async () => {
    setLoading(true)
    setError(null)

    try {
      const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com';
      const country = filters.country || 'Canada';
      const response = await fetch(`${API_BASE_URL}/scholarship/country/${country}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setScholarships(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch scholarships');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch scholarships');
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }

  // Event handlers
  const handleSearch = () => {
    setSearchLoading(true)
    setCurrentPage(1)
    fetchScholarships()
  }

  const clearFilters = () => {
    setFilters({
      country: '',
      studyLevel: '',
      fieldOfStudy: '',
      status: ''
    })
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    clearFilters()
  }

  const saveScholarship = (scholarship) => {
    const scholarshipId = scholarship.id
    if (!scholarshipId) return

    setSavedScholarships(prev => {
      const newSaved = prev.includes(scholarshipId)
        ? prev.filter(id => id !== scholarshipId)
        : [...prev, scholarshipId]

      localStorage.setItem('savedScholarships', JSON.stringify(newSaved))
      return newSaved
    })
  }

  const openScholarshipModal = (scholarship) => {
    setViewingScholarship(scholarship)
  }

  const closeScholarshipModal = () => {
    setViewingScholarship(null)
  }

  const applyToScholarship = (scholarship) => {
    // Require login
    try {
      const authRaw = localStorage.getItem('auth')
      const auth = authRaw ? JSON.parse(authRaw) : null
      if (!auth?.token) {
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:open-login'))
        return
      }
    } catch {}

    if (isDeadlinePassed(scholarship.deadline || '')) {
      toast.error('Application deadline has passed')
      return
    }

    if (scholarship.website) {
      window.open(scholarship.website, '_blank')
    } else if (scholarship.contactEmail) {
      window.open(`mailto:${scholarship.contactEmail}?subject=Scholarship Application Inquiry - ${scholarship.title}`, '_blank')
    } else {
      toast.error('Contact the provider for application details')
    }
  }

  // Pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  // Check authentication and subscription status
  useEffect(() => {
    try {
      const authRaw = localStorage.getItem('auth')
      const auth = authRaw ? JSON.parse(authRaw) : null
      const authenticated = !!(auth?.token)
      setIsAuthenticated(authenticated)

      // Check subscription status
      const subscribed = authenticated && (typeof isPro === 'function' ? isPro() : isPro)
      setIsSubscribed(subscribed)
    } catch (error) {
      console.error('Error checking auth/subscription:', error)
      setIsAuthenticated(false)
      setIsSubscribed(false)
    }
  }, [isPro])

  // Effects
  useEffect(() => {
    fetchScholarships()
  }, [filters.country])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages))
    }
  }, [filteredScholarships.length, totalPages, currentPage])

  // Skeleton Loader
  const ScholarshipCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-4 bg-gray-200 rounded w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-4 bg-gray-200 rounded w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-4 bg-gray-200 rounded w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-28"></div>
        </div>
      </div>
      <div className="h-12 bg-gray-200 rounded mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-8"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#432DD7] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Scholarship Opportunities
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Discover financial support for your educational journey.
              Find the perfect scholarship to fund your dreams.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  type="text"
                  placeholder="Search scholarships, providers, or fields..."
                  className="w-full pl-12 pr-32 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                <button
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-[#432DD7] px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
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
              <div className="text-2xl font-bold text-[#432DD7]">{scholarships.length}+</div>
              <div className="text-sm text-gray-600">Active Scholarships</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#432DD7]">25+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#432DD7]">$5M+</div>
              <div className="text-sm text-gray-600">Total Funding</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#432DD7]">50+</div>
              <div className="text-sm text-gray-600">Providers</div>
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
                    ? 'bg-[#432DD7] text-white'
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
                  className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]"
                >
                  <option value="deadline">Deadline (Soon First)</option>
                  <option value="amount">Award Amount (High to Low)</option>
                  <option value="newest">Newest First</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredScholarships.length} of {scholarships.length} scholarships
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]"
                  >
                    <option value="">All Countries</option>
                    {uniqueCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Study Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Study Level</label>
                  <select
                    value={filters.studyLevel}
                    onChange={(e) => setFilters(prev => ({ ...prev, studyLevel: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]"
                  >
                    <option value="">All Levels</option>
                    {uniqueStudyLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Field of Study */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Field of Study</label>
                  <select
                    value={filters.fieldOfStudy}
                    onChange={(e) => setFilters(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]"
                  >
                    <option value="">All Fields</option>
                    {uniqueFields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]"
                  >
                    <option value="">All Scholarships</option>
                    <option value="open">Open for Applications</option>
                    <option value="closing-soon">Closing Soon</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-end gap-2">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
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
              <ScholarshipCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-700 mb-2">Failed to Load Scholarships</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchScholarships}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredScholarships.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Scholarships Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || Object.values(filters).some(f => f)
                ? 'Try adjusting your search criteria or filters'
                : 'No scholarship listings available at the moment'}
            </p>
            {(searchQuery || Object.values(filters).some(f => f)) && (
              <button
                onClick={clearAllFilters}
                className="px-6 py-2 bg-[#432DD7] text-white rounded-lg hover:bg-[#3525b8] transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Scholarships Grid */}
        {!loading && !error && filteredScholarships.length > 0 && (
          <>
            {/* Subscription Prompt for Limited Access */}
            { !isSubscribed && filteredScholarships.length > 3 && (
              <div className="bg-white border-2 rounded-2xl p-6 mb-6" style={{ borderColor: '#5c3aec' }}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: '#5c3aec20' }}>
                    <Star className="w-6 h-6" style={{ color: '#5c3aec' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Unlock All Scholarships
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You're viewing 3 of {filteredScholarships.length} available scholarships.
                    Upgrade to Pro for unlimited access.
                  </p>
                  <button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-all font-semibold"
                    style={{ backgroundColor: '#5c3aec' }}
                  >
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedScholarships.map(scholarship => (
                <div key={scholarship.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#432DD7] hover:shadow-lg transition-all duration-300">

                  {/* Scholarship Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                        {scholarship.title}
                      </h3>
                      <p className="text-[#432DD7] font-semibold truncate">{scholarship.provider}</p>
                    </div>
                    <button
                      onClick={() => saveScholarship(scholarship)}
                      className={`p-2 rounded-lg transition-colors ${
                        savedScholarships.includes(scholarship.id || '')
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                      }`}
                    >
                      <Heart
                        fill={savedScholarships.includes(scholarship.id || '') ? 'currentColor' : 'none'}
                        className="w-4 h-4"
                      />
                    </button>
                  </div>

                  {/* Scholarship Details */}
                  <div className="space-y-3 mb-4">
                    {scholarship.country && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{scholarship.country}</span>
                      </div>
                    )}
                    {scholarship.studyLevel && (
                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{scholarship.studyLevel}</span>
                      </div>
                    )}
                    {scholarship.fieldOfStudy && (
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{scholarship.fieldOfStudy}</span>
                      </div>
                    )}
                    {scholarship.deadline && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className={getDeadlineClass(scholarship.deadline)}>
                          Deadline: {formatDeadline(scholarship.deadline)}
                        </span>
                      </div>
                    )}
                    {scholarship.amount && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="font-semibold text-green-600">
                          {formatAmount(scholarship.amount, scholarship.currency)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Scholarship Description Preview */}
                  {scholarship.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {scholarship.description}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {scholarship.type && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-[#432DD7] text-xs font-medium rounded-full">
                        {scholarship.type}
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusTagClass(scholarship.deadline || '')}`}>
                      {getApplicationStatus(scholarship.deadline || '')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => openScholarshipModal(scholarship)}
                      className="text-sm font-semibold text-[#432DD7] hover:text-[#3525b8] transition-colors flex items-center gap-1"
                    >
                      View Details
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => applyToScholarship(scholarship)}
                      disabled={isDeadlinePassed(scholarship.deadline || '')}
                      className="px-4 py-2 bg-[#432DD7] text-white text-sm font-semibold rounded-lg hover:bg-[#3525b8] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isDeadlinePassed(scholarship.deadline || '') ? 'Expired' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage <= 3 ? i + 1 :
                                 currentPage >= totalPages - 2 ? totalPages - 4 + i :
                                 currentPage - 2 + i
                      return page > 0 && page <= totalPages ? (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            page === currentPage
                              ? 'bg-[#432DD7] text-white'
                              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ) : null
                    })}
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
      </div>

      {/* Scholarship Details Modal */}
      {viewingScholarship && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingScholarship.title}</h2>
                  <p className="text-lg text-[#432DD7] font-semibold mt-1">{viewingScholarship.provider}</p>
                </div>
                <button
                  onClick={closeScholarshipModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid gap-6">
                {/* Scholarship Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  {viewingScholarship.amount && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Award Amount</div>
                        <div className="font-semibold text-green-600">
                          {formatAmount(viewingScholarship.amount, viewingScholarship.currency)}
                        </div>
                      </div>
                    </div>
                  )}
                  {viewingScholarship.country && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Country</div>
                        <div className="font-semibold">{viewingScholarship.country}</div>
                      </div>
                    </div>
                  )}
                  {viewingScholarship.studyLevel && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Study Level</div>
                        <div className="font-semibold">{viewingScholarship.studyLevel}</div>
                      </div>
                    </div>
                  )}
                  {viewingScholarship.fieldOfStudy && (
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Field of Study</div>
                        <div className="font-semibold">{viewingScholarship.fieldOfStudy}</div>
                      </div>
                    </div>
                  )}
                  {viewingScholarship.deadline && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Application Deadline</div>
                        <div className={`font-semibold ${getDeadlineClass(viewingScholarship.deadline)}`}>
                          {formatDeadline(viewingScholarship.deadline)}
                        </div>
                      </div>
                    </div>
                  )}
                  {viewingScholarship.duration && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Duration</div>
                        <div className="font-semibold">{viewingScholarship.duration}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {viewingScholarship.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">{viewingScholarship.description}</p>
                    </div>
                  </div>
                )}

                {/* Eligibility */}
                {viewingScholarship.eligibility && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Eligibility Criteria</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">{viewingScholarship.eligibility}</p>
                    </div>
                  </div>
                )}

                {/* How to Apply */}
                {viewingScholarship.howToApply && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">How to Apply</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">{viewingScholarship.howToApply}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={closeScholarshipModal}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => applyToScholarship(viewingScholarship)}
                  disabled={isDeadlinePassed(viewingScholarship.deadline || '')}
                  className="px-6 py-2 bg-[#432DD7] text-white rounded-lg hover:bg-[#3525b8] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {isDeadlinePassed(viewingScholarship.deadline || '') ? 'Application Closed' : 'Apply Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Loading fallback component
const ScholarshipsLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#432DD7] mx-auto mb-4" />
      <p className="text-gray-600">Loading scholarships...</p>
    </div>
  </div>
)

// Main component with Suspense boundary
const ScholarshipsContent = () => {
  return (
    <Suspense fallback={<ScholarshipsLoading />}>
      <ScholarshipsWithParams />
    </Suspense>
  )
}

export default ScholarshipsContent
