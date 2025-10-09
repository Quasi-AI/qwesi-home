                                     import { useState, useEffect, useRef } from 'react';
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton"
import PersonalActivityChart from "@/components/PersonalActivityChart"
import {
    MessageSquare,
    Users,
    Award,
    TrendingUp,
    Target,
    Phone,
    Calendar,
    Star,
    Gift,
    Flame,
    Trophy,
    Clock,
    Briefcase,
    MapPin,
    Globe,
    Mail,
    User,
    Zap,
    CheckCircle,
    X
} from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import PageHeader from '@/components/dashboard/PageHeader'
import Image from 'next/image'
import { useAuthStore } from '@/stores/authStore'
import { authFetch } from '@/lib/auth'

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function QwesiPersonalDashboard() {
    const { user, initAuth } = useAuthStore()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const getUserIdentifier = () => {
        if (user?.id) return { param: 'id', value: user.id }
        if (user?.phone) return { param: 'phone', value: user.phone }
                                                           const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
        return null
    }
    const userIdentifier = useMemo(() => getUserIdentifier(), [user])
    const [dashboardData, setDashboardData] = useState({
        profile: {
            name: '',
            userType: '',
            phone: '',
            email: '',
            profileImage: '',
            country: '',
            website: '',
            profileCompleteness: 0,
            createdAt: null
        },
        flags: {},
        activity: {
            conversationCount: 0,
            pitchCount: 0,
            lastConversationAt: null,
            lastPitchAt: null,
            last30DaysConversations: []
        },
        usage: {
            dailyMessages: 0,
            dailyCallMinutes: 0,
            dailyfacebookMessages: 0
        },
        referrals: {
            referralCode: '',
            referredCount: 0,
            stats: {
                totalReferrals: 0,
                successfulReferrals: 0,
                totalPointsEarned: 0
            },
            dynamic: {
                recentReferred: []
            }
        },
        points: {
            total: 0,
            available: 0,
            redeemed: 0,
            recentHistory: []
        }
    })

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    useEffect(() => {
        const fetchPersonalDashboard = async () => {
            try {
                setError(null)
                if (!userIdentifier) {
                    throw new Error('No user identifier available')
                }
                const response = await authFetch(`${API_BASE_URL}/dashboard/qwesi/personal?${userIdentifier.param}=${userIdentifier.value}`)

                if (response.ok) {
                    const result = await response.json()
                    if (result.success) {
                        setDashboardData(result.data)
                    } else {
                        throw new Error(result.message || 'Failed to fetch dashboard data')
                    }
                } else {
                    throw new Error(`Failed to fetch dashboard data: ${response.status}`)
                }

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
                setError(error.message)
                setDashboardData({
                    profile: {
                        name: user?.name || 'User',
                        userType: user?.userType || 'user',
                        phone: user?.phone || '',
                        email: user?.email || '',
                        profileImage: '',
                        country: '',
                        website: '',
                        profileCompleteness: 0,
                        createdAt: user?.createdAt || null
                    },
                    flags: {},
                    activity: {
                        conversationCount: 0,
                        pitchCount: 0,
                        lastConversationAt: null,
                        lastPitchAt: null,
                        last30DaysConversations: []
                    },
                    usage: {
                        dailyMessages: 0,
                        dailyCallMinutes: 0,
                        dailyfacebookMessages: 0
                    },
                    referrals: {
                        referralCode: '',
                        referredCount: 0,
                        stats: {
                            totalReferrals: 0,
                            successfulReferrals: 0,
                            totalPointsEarned: 0
                        },
                        dynamic: {
                            recentReferred: []
                        }
                    },
                    points: {
                        total: 0,
                        available: 0,
                        redeemed: 0,
                        recentHistory: []
                    }
                })
            } finally {
                setLoading(false)
            }
        }

        if (user && userIdentifier) {
            fetchPersonalDashboard()
        } else {
            setLoading(false)
            setDashboardData({
                profile: {
                    name: user?.name || 'User',
                    userType: user?.userType || 'user',
                    phone: user?.phone || '',
                    email: user?.email || '',
                    profileImage: '',
                    country: '',
                    website: '',
                    profileCompleteness: 0,
                    createdAt: user?.createdAt || null
                },
                flags: {},
                activity: {
                    conversationCount: 0,
                    pitchCount: 0,
                    lastConversationAt: null,
                    lastPitchAt: null,
                    last30DaysConversations: []
                },
                usage: {
                    dailyMessages: 0,
                    dailyCallMinutes: 0,
                    dailyfacebookMessages: 0
                },
                referrals: {
                    referralCode: '',
                    referredCount: 0,
                    stats: {
                        totalReferrals: 0,
                        successfulReferrals: 0,
                        totalPointsEarned: 0
                    },
                    dynamic: {
                        recentReferred: []
                    }
                },
                points: {
                    total: 0,
                    available: 0,
                    redeemed: 0,
                    recentHistory: []
                }
            })
        }
    }, [user])

    if (loading) return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1 w-full">
                        <div className="h-6 sm:h-8 bg-gray-200 rounded-lg w-full max-w-xs mb-2 animate-pulse"></div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24 animate-pulse"></div>
                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 animate-pulse"></div>
                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-8">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="h-3 bg-gray-200 rounded w-16 sm:w-20 mb-2 animate-pulse"></div>
                                <div className="h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16 mb-1 animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded w-20 sm:w-24 animate-pulse"></div>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-3 sm:p-6 flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-red-200 max-w-md w-full mx-3">
                    <div className="text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
                        <p className="text-sm text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                            style={{ backgroundColor: '#5c3aec' }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const getUserTypeIcon = (userType) => {
        switch (userType) {
            case 'seeker': return Target
            case 'employer': return Briefcase
            case 'investor': return TrendingUp
            default: return Users
        }
    }

    const getUserTypeColor = (userType) => {
        switch (userType) {
            case 'seeker': return '#00C4A7'
            case 'employer': return '#FF6B6B'
            case 'investor': return '#8B5CF6'
            default: return '#5c3aec'
        }
    }

    const calculateStreak = () => {
        const conversations = dashboardData.activity.last30DaysConversations || []
        if (conversations.length === 0) return 0

        const sortedDates = conversations.sort((a, b) => new Date(b.date) - new Date(a.date))
        let streak = 0
        let currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)

        for (const conv of sortedDates) {
            const convDate = new Date(conv.date)
            convDate.setHours(0, 0, 0, 0)
            
            const daysDiff = Math.floor((currentDate - convDate) / (1000 * 60 * 60 * 24))
            
            if (daysDiff === streak) {
                streak++
                currentDate = convDate
            } else {
                break
            }
        }

        return streak
    }

    const currentStreak = calculateStreak()

    const dashboardCardsData = [
        {
            title: 'Conversations',
            value: dashboardData.activity.conversationCount || 0,
            subtitle: `Last: ${dashboardData.activity.lastConversationAt ? new Date(dashboardData.activity.lastConversationAt).toLocaleDateString() : 'Never'}`,
            icon: MessageSquare,
            color: '#5c3aec'
        },
        {
            title: 'Current Streak',
            value: currentStreak || 0,
            subtitle: `${currentStreak || 0} days`,
            icon: Flame,
            color: '#FF6B6B'
        },
        {
            title: 'Total Points',
            value: dashboardData.points.total || 0,
            subtitle: `${dashboardData.points.available || 0} available`,
            icon: Award,
            color: '#FFD700'
        },
        {
            title: 'Referrals',
            value: dashboardData.referrals.dynamic.referredCount || 0,
            subtitle: `${dashboardData.referrals.stats.totalPointsEarned || 0} pts earned`,
            icon: Users,
            color: getUserTypeColor(dashboardData.profile.userType)
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
            {/* Header */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <div className="relative flex-shrink-0">
                        {dashboardData.profile.profileImage ? (
                            <Image 
                                src={dashboardData.profile.profileImage} 
                                alt={dashboardData.profile.name}
                                width={80}
                                height={80}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-lg"
                            />
                        ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#5c3aec' }}>
                                <User className="w-8 h-8 sm:w-10 sm:h-10" />
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: getUserTypeColor(dashboardData.profile.userType) }}>
                            {(() => {
                                const IconComponent = getUserTypeIcon(dashboardData.profile.userType)
                                return <IconComponent className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            })()}
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
                            Welcome, {user?.name || 'User'}!
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                            <span className="capitalize font-medium">
                                {dashboardData.profile.userType} Account
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">
                                Member since {dashboardData.profile.createdAt ? new Date(dashboardData.profile.createdAt).toLocaleDateString() : 'Unknown'}
                            </span>
                            {dashboardData.referrals.referralCode && (
                                <>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="text-xs">Code: <strong>{dashboardData.referrals.referralCode}</strong></span>
                                </>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${dashboardData.profile.profileCompleteness}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                {dashboardData.profile.profileCompleteness}%
                            </span>
                        </div>
                    </div>

                    {/* Contact Info - Desktop only */}
                    <div className="hidden lg:flex flex-col gap-2 text-sm">
                        {dashboardData.profile.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{dashboardData.profile.phone}</span>
                            </div>
                        )}
                        {dashboardData.profile.email && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span>{dashboardData.profile.email}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-8">
                {dashboardCardsData.map((card, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 sm:mb-2 truncate">
                                    {card.title}
                                </p>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                                    {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{card.subtitle}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 sm:ml-4 text-white" style={{ backgroundColor: card.color }}>
                                <card.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#5c3aec' }} />
                        <span className="truncate">Activity (30 Days)</span>
                    </h3>
                    {dashboardData.activity.last30DaysConversations.length > 0 ? (
                        <div className="overflow-x-auto">
                            <PersonalActivityChart data={dashboardData.activity.last30DaysConversations} />
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No activity yet</p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                        Today's Usage
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                                <span className="font-medium text-gray-900 text-sm sm:text-base truncate">Messages</span>
                            </div>
                            <span className="text-base sm:text-lg font-bold text-blue-600 ml-2">
                                {dashboardData.usage.dailyMessages}
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                                <span className="font-medium text-gray-900 text-sm sm:text-base truncate">Call Minutes</span>
                            </div>
                            <span className="text-base sm:text-lg font-bold text-green-600 ml-2">
                                {dashboardData.usage.dailyCallMinutes}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                                <span className="font-medium text-gray-900 text-sm sm:text-base truncate">FB Messages</span>
                            </div>
                            <span className="text-base sm:text-lg font-bold text-purple-600 ml-2">
                                {dashboardData.usage.dailyfacebookMessages}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Points History */}
            {dashboardData.points.recentHistory.length > 0 && (
                <div className="mt-4 sm:mt-6 lg:mt-8 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                        Recent Points
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                        {dashboardData.points.recentHistory.slice(0, 5).map((point, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        point.type === 'earned' ? 'bg-green-100' :
                                        point.type === 'redeemed' ? 'bg-red-100' :
                                        point.type === 'referral' ? 'bg-blue-100' :
                                        'bg-yellow-100'
                                    }`}>
                                        {point.type === 'earned' && <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />}
                                        {point.type === 'redeemed' && <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />}
                                        {point.type === 'referral' && <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />}
                                        {point.type === 'bonus' && <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-gray-900 capitalize text-sm sm:text-base truncate">{point.type}</p>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">{point.description}</p>
                                        <p className="text-xs text-gray-500">
                                            {point.timestamp ? new Date(point.timestamp).toLocaleDateString() : 'Unknown'}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-base sm:text-lg font-bold ml-2 flex-shrink-0 ${
                                    point.amount > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {point.amount > 0 ? '+' : ''}{point.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Referred Users */}
            {dashboardData.referrals.dynamic.recentReferred.length > 0 && (
                <div className="mt-4 sm:mt-6 lg:mt-8 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />
                        <span className="truncate">Your Referrals ({dashboardData.referrals.dynamic.referredCount})</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {dashboardData.referrals.dynamic.recentReferred.slice(0, 6).map((user, index) => (
                            <div key={index} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{user.name || 'Anonymous'}</p>
                                <p className="text-xs sm:text-sm text-gray-600 capitalize truncate">{user.userType}</p>
                                <p className="text-xs text-gray-500">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}