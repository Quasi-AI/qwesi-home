'use client'
import React, { useState, useEffect } from 'react'
import { X, Eye, EyeOff, ChevronDown, Mail, Phone, Lock, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { loginWithCredentials, persistAuth } from '@/lib/auth'
import { countryCodes, detectCountryByIP, formatPhoneNumber } from '@/utils/countryUtils'

const LoginModal = ({ isOpen, onClose, onSwitchToSignup, onLoggedIn, onForgotPassword }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loginMethod, setLoginMethod] = useState('email')
    const [phone, setPhone] = useState('')
    const [countryCode, setCountryCode] = useState('+233')
    const [showCountryDropdown, setShowCountryDropdown] = useState(false)
    const { setAuth } = useAuthStore()

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

    // Auto-detect country for phone login
    useEffect(() => {
        if (isOpen && loginMethod === 'phone') {
            const detectCountry = async () => {
                const detectedCode = await detectCountryByIP()
                setCountryCode(detectedCode)
            }
            detectCountry()
        }
    }, [isOpen, loginMethod])

    const handleCountrySelect = (code) => {
        setCountryCode(code)
        setShowCountryDropdown(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        try {
            let identifier
            if (loginMethod === 'phone') {
                identifier = formatPhoneNumber(countryCode, phone)
            } else {
                identifier = email
            }
            const result = await loginWithCredentials(identifier, password)
            if (result?.success) {
                // Persist auth data to localStorage
                persistAuth({ user: result.user, token: result.token })

                // Update auth store state
                setAuth(result.user, result.token)

                onLoggedIn(result)
                onClose()
            }
        } catch (err) {
            setError(err?.message || 'Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    const selectedCountry = countryCodes.find(c => c.code === countryCode)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Enhanced Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-md"
                onClick={() => { 
                    onClose(); 
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

                    {/* Login Method Toggle */}
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        <button
                            type="button"
                            onClick={() => setLoginMethod('email')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                loginMethod === 'email' 
                                    ? 'bg-white text-indigo-600 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <Mail className="w-4 h-4" />
                            Email
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMethod('phone')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                loginMethod === 'phone' 
                                    ? 'bg-white text-indigo-600 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <Phone className="w-4 h-4" />
                            Phone
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Email or Phone Input */}
                        {loginMethod === 'email' ? (
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C3AEC]/20 focus:border-[#5C3AEC] transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                        required
                                    />
                                </div>
                            </div>
                        ) : (
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
                                            <span className="text-sm font-medium">{countryCode}</span>
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
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="555 000 111"
                                            className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#5C3AEC]/20 focus:border-[#5C3AEC] transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
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

                        {/* Forgot Password */}
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={onForgotPassword}
                                className="text-sm text-[#5C3AEC] hover:text-[#3d1fc7] hover:underline transition-colors duration-200 font-medium"
                            >
                                Forgot password?
                            </button>
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
                                    Signing In...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="pt-6 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={onSwitchToSignup}
                                className="text-[#5C3AEC] hover:text-[#3d1fc7] hover:underline font-semibold transition-colors duration-200"
                            >
                                Create one now
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginModal
