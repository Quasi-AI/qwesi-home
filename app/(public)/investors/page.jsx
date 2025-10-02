'use client'
import React, { useState, useEffect, useMemo } from 'react'
import {
  Search, Filter, MapPin, Building, Globe, Phone,
  ChevronRight, ChevronLeft, X, ArrowRight, Heart, DollarSign,
  Calendar, Mail, Loader2, Briefcase, Award, Star, User,
  ExternalLink, Users, TrendingUp, BarChart3, RefreshCw
} from 'lucide-react'
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useSubscriptionStore } from '@/stores/subscriptionStore'
import SubscriptionModal from '@/modals/SubscriptionModal'

const InvestorsPage = () => {
  const router = useRouter()
  const { isPro } = useSubscriptionStore()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [investors, setInvestors] = useState([])
  const [viewingInvestor, setViewingInvestor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [investorsPerPage] = useState(12)
  const [sortBy, setSortBy] = useState('createdAt')
  const [savedInvestors, setSavedInvestors] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const [filters, setFilters] = useState({
    country: '',
    role: '',
    companyType: ''
  })

  const filteredInvestors = useMemo(() => {
    let result = [...investors]
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(investor =>
        investor.name?.toLowerCase().includes(query) ||
        investor.email?.toLowerCase().includes(query) ||
        investor.companyName?.toLowerCase().includes(query) ||
        investor.investmentDescription?.toLowerCase().includes(query) ||
        investor.investorDetails?.pitch?.toLowerCase().includes(query)
      )
    }
    
    if (filters.country) {
      result = result.filter(i => i.country === filters.country)
    }
    if (filters.role) {
      result = result.filter(i => i.investorDetails?.role?.includes(filters.role))
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        case 'company':
          return (a.companyName || '').localeCompare(b.companyName || '')
        case 'country':
          return (a.country || '').localeCompare(b.country || '')
        case 'createdAt':
        default:
          const dateA = new Date(a.createdAt || '1970-01-01').getTime()
          const dateB = new Date(b.createdAt || '1970-01-01').getTime()
          return dateB - dateA
      }
    })
    
    return result
  }, [investors, searchQuery, filters, sortBy])

  const paginatedInvestors = useMemo(() => {
    let investorsToShow = filteredInvestors
    
    if (!isSubscribed) {
      investorsToShow = filteredInvestors.slice(0, 3)
    }
    
    const start = (currentPage - 1) * investorsPerPage
    const end = start + investorsPerPage
    return investorsToShow.slice(start, end)
  }, [filteredInvestors, currentPage, investorsPerPage, isSubscribed])

  const totalPages = Math.max(1, Math.ceil(filteredInvestors.length / investorsPerPage))

  const uniqueCountries = useMemo(() => {
    return [...new Set(investors.map(i => i.country).filter(Boolean))].sort()
  }, [investors])

  const uniqueRoles = useMemo(() => {
    const roles = investors.flatMap(i => i.investorDetails?.role || [])
    return [...new Set(roles)].sort()
  }, [investors])

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatWebsiteUrl = (website) => {
    if (!website) return '#'
    if (website.startsWith('http://') || website.startsWith('https://')) {
      return website
    }
    return `https://${website}`
  }

  const fetchInvestors = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('https://dark-caldron-448714-u5.appspot.com/getallinvestor?limit=6020')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setInvestors(data.investors || [])
    } catch (err) {
      console.error('Error fetching investors:', err)
      setError('Failed to fetch investors. Please try again later.')
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  const handleSearch = () => {
    setSearchLoading(true)
    setCurrentPage(1)
    fetchInvestors()
  }

  const clearFilters = () => {
    setFilters({
      country: '',
      role: '',
      companyType: ''
    })
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    clearFilters()
  }

  const saveInvestor = (investor) => {
    try {
      const authRaw = localStorage.getItem('auth')
      const auth = authRaw ? JSON.parse(authRaw) : null
      if (!auth?.token) {
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:open-login'))
        return
      }
    } catch {}

    const investorId = investor._id
    if (!investorId) return

    setSavedInvestors(prev => {
      const newSaved = prev.includes(investorId)
        ? prev.filter(id => id !== investorId)
        : [...prev, investorId]

      localStorage.setItem('savedInvestors', JSON.stringify(newSaved))
      return newSaved
    })
  }

  const openInvestorModal = (investor) => {
    setViewingInvestor(investor)
  }

  const closeInvestorModal = () => {
    setViewingInvestor(null)
  }

  const contactInvestor = (investor) => {
    if (!isSubscribed) {
      setShowSubscriptionModal(true)
      return
    }

    try {
      const authRaw = localStorage.getItem('auth')
      const auth = authRaw ? JSON.parse(authRaw) : null
      if (!auth?.token) {
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:open-login'))
        return
      }
    } catch {}

    if (investor.email) {
      window.open(`mailto:${investor.email}?subject=Investment Inquiry&body=Dear ${investor.name || 'Investor'},`, '_blank')
    }
  }

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

  useEffect(() => {
    fetchInvestors()
  }, [])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages))
    }
  }, [filteredInvestors.length, totalPages, currentPage])

  useEffect(() => {
    const saved = localStorage.getItem('savedInvestors')
    if (saved) {
      setSavedInvestors(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    try {
      const authRaw = localStorage.getItem('auth')
      const auth = authRaw ? JSON.parse(authRaw) : null
      const authenticated = !!(auth?.token)
      setIsAuthenticated(authenticated)

      const subscribed = authenticated && (typeof isPro === 'function' ? isPro() : isPro)
      setIsSubscribed(subscribed)
    } catch (error) {
      console.error('Error checking auth/subscription:', error)
      setIsAuthenticated(false)
      setIsSubscribed(false)
    }
  }, [isPro])

  const InvestorCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#5C3AEB] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Connect with Investors
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Discover funding opportunities from verified investors.
              Connect with the right partners for your business growth.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  type="text"
                  placeholder="Search investors, companies, or investment focus..."
                  className="w-full pl-12 pr-32 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
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

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">{investors.length}+</div>
              <div className="text-sm text-gray-600">Active Investors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">{uniqueCountries.length}+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">$50M+</div>
              <div className="text-sm text-gray-600">Total Capital</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                >
                  <option value="createdAt">Newest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="company">Company A-Z</option>
                  <option value="country">Country A-Z</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredInvestors.length} of {investors.length} investors
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                  <select
                    value={filters.country}
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                  >
                    <option value="">All Countries</option>
                    {uniqueCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select
                    value={filters.role}
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                  >
                    <option value="">All Roles</option>
                    {uniqueRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end gap-2 md:col-span-2 lg:col-span-2">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <InvestorCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-700 mb-2">Failed to Load Investors</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchInvestors}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filteredInvestors.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Investors Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || Object.values(filters).some(f => f)
                ? 'Try adjusting your search criteria or filters'
                : 'No investors have been registered yet'}
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

        {!loading && !error && filteredInvestors.length > 0 && (
          <>
            {!isSubscribed && filteredInvestors.length > 3 && (
              <div className="bg-white border-2 rounded-2xl p-6 mb-6" style={{ borderColor: '#5c3aec' }}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: '#5c3aec20' }}>
                    <Star className="w-6 h-6" style={{ color: '#5c3aec' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Unlock All Investors
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You're viewing 3 of {filteredInvestors.length} available investors.
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
              {paginatedInvestors.map(investor => (
                <div
                  key={investor._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {investor.name || 'Unnamed Investor'}
                      </h3>
                      <p className="text-sm font-medium truncate" style={{ color: '#5c3aec' }}>
                        {investor.email}
                      </p>
                    </div>
                    <button
                      onClick={() => saveInvestor(investor)}
                      className={`p-2 rounded-lg transition-colors ${
                        savedInvestors.includes(investor._id || '')
                          ? 'bg-red-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <Heart
                        fill={savedInvestors.includes(investor._id || '') ? '#ef4444' : 'none'}
                        className="w-4 h-4"
                        style={{ color: savedInvestors.includes(investor._id || '') ? '#ef4444' : '#9ca3af' }}
                      />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    {investor.companyName && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{investor.companyName}</span>
                      </div>
                    )}
                    {investor.website && (
                      <div className="flex items-center text-sm">
                        <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                        <a
                          href={formatWebsiteUrl(investor.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate hover:underline transition-colors"
                          style={{ color: '#5c3aec' }}
                        >
                          {investor.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {investor.investmentDescription && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {investor.investmentDescription}
                      </p>
                    </div>
                  )}

                  {investor.investorDetails?.role && investor.investorDetails.role.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {investor.investorDetails.role.slice(0, 2).map((role, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium rounded-lg"
                            style={{
                              backgroundColor: '#5c3aec15',
                              color: '#5c3aec',
                              border: '1px solid #5c3aec30'
                            }}
                          >
                            {role}
                          </span>
                        ))}
                        {investor.investorDetails.role.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                            +{investor.investorDetails.role.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(investor.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openInvestorModal(investor)}
                        className="text-sm font-semibold hover:underline transition-colors"
                        style={{ color: '#5c3aec' }}
                      >
                        View
                      </button>

                      <button
                        onClick={() => contactInvestor(investor)}
                        className="px-3 py-1.5 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-all"
                        style={{ backgroundColor: '#5c3aec' }}
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                              ? 'text-white'
                              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                          style={page === currentPage ? { backgroundColor: '#5c3aec' } : {}}
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
      </div>

      {viewingInvestor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingInvestor.name || 'Unnamed Investor'}</h2>
                  <p className="text-lg font-semibold mt-1" style={{ color: '#5c3aec' }}>{viewingInvestor.email}</p>
                  {viewingInvestor.companyName && (
                    <p className="text-gray-600 mt-1">{viewingInvestor.companyName}</p>
                  )}
                </div>
                <button
                  onClick={closeInvestorModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {viewingInvestor.country && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Country</div>
                        <div className="font-semibold">{viewingInvestor.country}</div>
                      </div>
                    </div>
                  )}
                  {viewingInvestor.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Phone</div>
                        <div className="font-semibold">{viewingInvestor.phone}</div>
                      </div>
                    </div>
                  )}
                  {viewingInvestor.website && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Website</div>
                        <a
                          href={formatWebsiteUrl(viewingInvestor.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold hover:underline transition-colors"
                          style={{ color: '#5c3aec' }}
                        >
                          {viewingInvestor.website}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Member Since</div>
                      <div className="font-semibold">{formatDate(viewingInvestor.createdAt)}</div>
                    </div>
                  </div>
                </div>

                {viewingInvestor.investorDetails?.role && viewingInvestor.investorDetails.role.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Investor Roles</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingInvestor.investorDetails.role.map((role, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm font-medium rounded-lg"
                          style={{
                            backgroundColor: '#5c3aec15',
                            color: '#5c3aec',
                            border: '1px solid #5c3aec30'
                          }}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {viewingInvestor.investorDetails?.pitch && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-gray-700 leading-relaxed">{viewingInvestor.investorDetails.pitch}</p>
                  </div>
                )}

                {viewingInvestor.investmentDescription && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Investment Focus</h3>
                    <p className="text-gray-700 leading-relaxed">{viewingInvestor.investmentDescription}</p>
                  </div>
                )}

                {viewingInvestor.investmentDescription2 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
                    <p className="text-gray-700 leading-relaxed">{viewingInvestor.investmentDescription2}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={closeInvestorModal}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <div className="flex gap-3">
                  {viewingInvestor.website && (
                    <a
                      href={formatWebsiteUrl(viewingInvestor.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-semibold"
                      style={{ backgroundColor: '#5c3aec' }}
                    >
                      Visit Website
                    </a>
                  )}
                  <button
                    onClick={() => {
                      closeInvestorModal()
                      contactInvestor(viewingInvestor)
                    }}
                    className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-semibold"
                    style={{ backgroundColor: '#5c3aec' }}
                  >
                    Contact Investor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSubscriptionModal && (
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}
    </div>
  )
}

export default InvestorsPage