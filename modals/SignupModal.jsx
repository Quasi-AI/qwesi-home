'use client'
import React, { useState, useEffect } from 'react'
import { X, Eye, EyeOff, ChevronDown, Mail, Phone, Lock, User, Calendar, Loader2 } from 'lucide-react'
import { signupWithCredentials, persistAuth } from '@/lib/auth'
import { useAuthStore } from '@/stores/authStore'
import { countryCodes, detectCountryByIP, formatPhoneNumber } from '@/utils/countryUtils'

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const { setAuth } = useAuthStore()
    const [formData, setFormData] = useState({
        phone: '',
        countryCode: '+233',
        name: '',
        dob: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showCountryDropdown, setShowCountryDropdown] = useState(false)

    // Auto-detect country on component mount
    useEffect(() => {
        const detectCountry = async () => {
            const detectedCode = await detectCountryByIP()
            setFormData(prev => ({ ...prev, countryCode: detectedCode }))
        }
        
        if (isOpen) {
            detectCountry()
        }
    }, [isOpen])

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose()
                setShowCountryDropdown(false)
            }
        }
        
        const handleClickOutside = (e) => {
            if (showCountryDropdown && !e.target.closest('.country-dropdown-container')) {
                setShowCountryDropdown(false)
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.addEventListener('click', handleClickOutside)
            document.body.style.overflow = 'hidden'
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.removeEventListener('click', handleClickOutside)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, showCountryDropdown, onClose])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleCountrySelect = (code) => {
        setFormData(prev => ({ ...prev, countryCode: code }))
        setShowCountryDropdown(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        try {
            // Format phone number with country code
            const fullPhoneNumber = formatPhoneNumber(formData.countryCode, formData.phone)
            
            // Format DOB from YYYY-MM-DD to DD/MM/YYYY
            let formattedDob = formData.dob
            if (formattedDob && formattedDob.includes('-')) {
                const [year, month, day] = formattedDob.split('-')
                formattedDob = `${day}/${month}/${year}`
            }
            
            const result = await signupWithCredentials({
                ...formData,
                phone: fullPhoneNumber,
                dob: formattedDob
            })

            if (result?.success) {
                // Persist auth data to localStorage (already done in signupWithCredentials)
                // Update auth store state
                setAuth(result.user, result.token)

                onClose()
            }
        } catch (err) {
            setError(err?.message || 'Signup failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Enhanced Backdrop with blur */}
            <div 
                className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/60 backdrop-blur-md"
                onClick={() => {
                    onClose()
                    setShowCountryDropdown(false)
                }}
            />

            {/* Modal with enhanced styling */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md mx-auto border border-white/20 overflow-hidden">

                {/* Form Container */}
                <div className="p-4 sm:p-6 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2 animate-in fade-in duration-200">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Full name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C3AEC]/20 focus:border-[#5C3AEC] transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Phone number
                            </label>
                            <div className="flex">
                                <div className="relative country-dropdown-container">
                                    <button
                                        type="button"
                                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                        className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 border-r-0 rounded-l-xl bg-gray-50/50 hover:bg-white transition-all duration-200 min-w-[90px] focus:outline-none focus:ring-2 focus:ring-[#5C3AEC]/20 focus:border-[#5C3AEC]"
                                    >
                                        <span className="text-lg">{selectedCountry?.flag}</span>
                                        <span className="text-sm font-medium">{formData.countryCode}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCountryDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {showCountryDropdown && (
                                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto mt-1 animate-in fade-in zoom-in-95 duration-200">
                                            {countryCodes.map((country) => (
                                                <button
                                                    key={`${country.code}-${country.country}`}
                                                    type="button"
                                                    onClick={() => handleCountrySelect(country.code)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 text-left transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                                                >
                                                    <span className="text-lg">{country.flag}</span>
                                                    <span className="text-sm font-medium">{country.code}</span>
                                                    <span className="text-sm text-gray-600 truncate">{country.country}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="555 000 111"
                                        className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#5C3AEC]/20 focus:border-[#5C3AEC] transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Date of Birth
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C3AEC]/20 focus:border-[#5C3AEC] transition-all duration-200 bg-gray-50/50 hover:bg-white appearance-none cursor-pointer"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email address"
                                    className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C3AEC]/20 focus:border-[#5C3AEC] transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    className="w-full pl-12 pr-12 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C3AEC]/20 focus:border-[#5C3AEC] transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#5C3AEC] text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-[#3d1fc7] focus:outline-none focus:ring-2 focus:ring-[#5C3AEC]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="pt-6 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                className="text-[#5C3AEC] hover:text-[#3d1fc7] hover:underline font-semibold transition-colors duration-200"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupModal
