'use client'
import { ArrowRight, MessageCircle, Facebook, Linkedin, Star, Users, TrendingUp, Search, Play, Phone, MessageCircleMore, Globe, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import TranslateService from '@/services/TranslateService'
import { useLocationDetection } from '@/hooks/useLocationDetection'

// Initialize translation service
const translateService = new TranslateService();

// Translation Hook
const useGoogleTranslate = () => {
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState(new Map());

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    const handleLanguageChange = (event) => {
      const { language } = event.detail;
      setCurrentLanguage(language);
      // Clear cache when language changes to force retranslation
      setTranslationCache(new Map());
    };

    window.addEventListener('language-change', handleLanguageChange);
    return () => window.removeEventListener('language-change', handleLanguageChange);
  }, []);

  const translate = useCallback(async (text, fallback = text) => {
    if (currentLanguage === 'English' || !text?.trim()) {
      return text;
    }

    const cacheKey = `${text}|||${currentLanguage}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    try {
      setIsTranslating(true);
      const translatedText = await translateService.translateText(text, currentLanguage, 'English');

      setTranslationCache(prev => new Map(prev).set(cacheKey, translatedText));
      return translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      return fallback;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  return { currentLanguage, isTranslating, translate };
};

// Translated Text Component
const TranslatedText = ({ children, fallback, className, tag: Tag = 'span', ...props }) => {
  const { translate, currentLanguage } = useGoogleTranslate();
  const [translatedText, setTranslatedText] = useState(children);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translateText = async () => {
      if (typeof children === 'string') {
        setIsLoading(true);
        try {
          const result = await translate(children, fallback || children);
          setTranslatedText(result);
        } catch (error) {
          console.error('Translation error:', error);
          setTranslatedText(fallback || children);
        } finally {
          setIsLoading(false);
        }
      }
    };

    translateText();
  }, [children, currentLanguage, translate, fallback]);

  return (
    <Tag className={`${className} ${isLoading ? 'opacity-70' : ''}`} {...props}>
      {translatedText}
    </Tag>
  );
};

// Translated Input Component for placeholders
const TranslatedInput = ({ placeholder, className, ...props }) => {
  const { translate, currentLanguage } = useGoogleTranslate();
  const [translatedPlaceholder, setTranslatedPlaceholder] = useState(placeholder);

  useEffect(() => {
    const translatePlaceholder = async () => {
      if (placeholder && typeof placeholder === 'string') {
        try {
          const result = await translate(placeholder, placeholder);
          setTranslatedPlaceholder(result);
        } catch (error) {
          console.error('Placeholder translation error:', error);
          setTranslatedPlaceholder(placeholder);
        }
      }
    };

    translatePlaceholder();
  }, [placeholder, currentLanguage, translate]);

  return (
    <input
      className={className}
      placeholder={translatedPlaceholder}
      {...props}
    />
  );
};

const Hero = () => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [selectedCountry, setSelectedCountry] = useState('Ghana')
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef(null)

    const pathname = usePathname()
    const { translate, currentLanguage, isTranslating } = useGoogleTranslate()
    const { country, loading: isDetectingLocation } = useLocationDetection()

    // Dynamic content based on current page
    const getHeroContent = () => {
        if (pathname === '/jobs') {
            return {
                title: 'Find Your Dream Job',
                subtitle: 'Discover thousands of career opportunities from top companies worldwide. Your next career move starts here.',
                searchPlaceholder: 'Job title, company, or keywords...',
                backgroundColor: 'from-[#5C3AEB] via-[#5E43D7] to-[#7A59D7]',
                showStats: true,
                showCountrySelector: false,
                stats: [
                    { value: '500+', label: 'Active Jobs' },
                    { value: '50+', label: 'Companies' },
                    { value: '15+', label: 'Countries' },
                    { value: '24/7', label: 'Support' }
                ]
            }
        } else if (pathname === '/investors') {
            return {
                title: 'Connect with Investors',
                subtitle: 'Discover funding opportunities from verified investors. Connect with the right partners for your business growth.',
                searchPlaceholder: 'Search investors, companies, or investment focus...',
                backgroundColor: 'from-[#5C3AEB] via-[#5E43D7] to-[#7A59D7]',
                showStats: true,
                showCountrySelector: false,
                stats: [
                    { value: '100+', label: 'Active Investors' },
                    { value: '25+', label: 'Countries' },
                    { value: '$50M+', label: 'Total Capital' },
                    { value: '95%', label: 'Success Rate' }
                ]
            }
        } else if (pathname === '/scholarships') {
            return {
                title: 'Scholarship Opportunities',
                subtitle: 'Discover financial support for your educational journey. Find the perfect scholarship to fund your dreams.',
                searchPlaceholder: 'Search scholarships, providers, or fields...',
                backgroundColor: 'from-[#432DD7] via-[#5C3AEB] to-[#7A59D7]',
                showStats: true,
                showCountrySelector: false,
                stats: [
                    { value: '200+', label: 'Active Scholarships' },
                    { value: '25+', label: 'Countries' },
                    { value: '$5M+', label: 'Total Funding' },
                    { value: '50+', label: 'Providers' }
                ]
            }
        } else {
            // Default/home page content for talent pool platform
            return {
                title: 'Discover Top Talent',
                subtitle: 'Connect with skilled professionals and unlock opportunities in jobs, investments, and scholarships.',
                searchPlaceholder: `Search talents, jobs, investors, or scholarships in ${selectedCountry}`,
                backgroundColor: 'from-[#5C3AEB]/5 via-white to-[#5C3AEB]/10',
                showStats: true,
                showCountrySelector: true,
                stats: [
                    { value: '10K+', label: 'Talents' },
                    { value: '500+', label: 'Jobs' },
                    { value: '200+', label: 'Investors' },
                    { value: '300+', label: 'Scholarships' }
                ]
            }
        }
    }

    const heroContent = getHeroContent()

    // Map common country codes to our country names
    const countryCodeMapping = {
        'GH': 'Ghana',
        'NG': 'Nigeria',
        'KE': 'Kenya',
        'ZA': 'South Africa',
        'EG': 'Egypt',
        'MA': 'Morocco',
        'TZ': 'Tanzania',
        'UG': 'Uganda',
        'SN': 'Senegal',
        'CM': 'Cameroon',
        'US': 'United States',
        'DE': 'Germany',
        'GB': 'United Kingdom',
        'UK': 'United Kingdom',
        'FR': 'France'
    }

    // List of available countries with flag URLs
    const countries = [
        { name: 'Ghana', flag: 'https://flagcdn.com/w40/gh.png', code: 'GH' },
        { name: 'Nigeria', flag: 'https://flagcdn.com/w40/ng.png', code: 'NG' },
        { name: 'Kenya', flag: 'https://flagcdn.com/w40/ke.png', code: 'KE' },
        { name: 'South Africa', flag: 'https://flagcdn.com/w40/za.png', code: 'ZA' },
        { name: 'Egypt', flag: 'https://flagcdn.com/w40/eg.png', code: 'EG' },
        { name: 'Morocco', flag: 'https://flagcdn.com/w40/ma.png', code: 'MA' },
        { name: 'Tanzania', flag: 'https://flagcdn.com/w40/tz.png', code: 'TZ' },
        { name: 'Uganda', flag: 'https://flagcdn.com/w40/ug.png', code: 'UG' },
        { name: 'Senegal', flag: 'https://flagcdn.com/w40/sn.png', code: 'SN' },
        { name: 'Cameroon', flag: 'https://flagcdn.com/w40/cm.png', code: 'CM' },
        { name: 'United States', flag: 'https://flagcdn.com/w40/us.png', code: 'US' },
        { name: 'Germany', flag: 'https://flagcdn.com/w40/de.png', code: 'DE' },
        { name: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png', code: 'GB' },
        { name: 'France', flag: 'https://flagcdn.com/w40/fr.png', code: 'FR' }
    ]

    const handleCountrySelect = (country) => {
        setSelectedCountry(country.name)
        setIsCountryDropdownOpen(false)

        // Dispatch country change event for other components to listen
        window.dispatchEvent(new CustomEvent('country-change', {
            detail: { country: country.name }
        }))
    }

    const handleSearch = () => {
        if (!searchQuery.trim()) return

        const query = searchQuery.toLowerCase().trim()

        // Determine where to navigate based on current page and search terms
        if (pathname === '/jobs') {
            // Already on jobs page, navigate with search parameter
            window.location.href = `/jobs?search=${encodeURIComponent(searchQuery)}`
        } else if (pathname === '/investors') {
            // Already on investors page, navigate with search parameter
            window.location.href = `/investors?search=${encodeURIComponent(searchQuery)}`
        } else if (pathname === '/scholarships') {
            // Already on scholarships page, navigate with search parameter
            window.location.href = `/scholarships?search=${encodeURIComponent(searchQuery)}`
        } else {
            // On home page, try to determine the best page based on keywords
            if (query.includes('job') || query.includes('career') || query.includes('employment') || query.includes('work')) {
                window.location.href = `/jobs?search=${encodeURIComponent(searchQuery)}`
            } else if (query.includes('investor') || query.includes('funding') || query.includes('capital') || query.includes('investment')) {
                window.location.href = `/investors?search=${encodeURIComponent(searchQuery)}`
            } else if (query.includes('scholarship') || query.includes('education') || query.includes('study') || query.includes('grant')) {
                window.location.href = `/scholarships?search=${encodeURIComponent(searchQuery)}`
            } else if (query.includes('talent') || query.includes('professional') || query.includes('expert')) {
                window.location.href = `/talent-pool?search=${encodeURIComponent(searchQuery)}`
            } else {
                // Default to jobs page for general searches
                window.location.href = `/jobs?search=${encodeURIComponent(searchQuery)}`
            }
        }
    }

    // Set selected country from detected location
    useEffect(() => {
        if (country && !isDetectingLocation) {
            setSelectedCountry(country)
            console.log('Auto-detected country:', country)
        }
    }, [country, isDetectingLocation])

    // Listen for country change from Footer
    useEffect(() => {
        const handleCountryChange = (event) => {
            setSelectedCountry(event.detail.country)
        }

        window.addEventListener('country-change', handleCountryChange)
        return () => window.removeEventListener('country-change', handleCountryChange)
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCountryDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className='relative z-10'>
            {/* Translation Loading Indicator */}
            {isTranslating && (
                <div className="fixed top-20 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs z-50 animate-pulse">
                    <TranslatedText>Translating...</TranslatedText>
                </div>
            )}

            {/* Modern Hero Section */}
            <div className={`relative overflow-hidden bg-gradient-to-br ${heroContent.backgroundColor}`}>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20'>

                    {/* Main Hero Content */}
                    <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>

                        {/* Left Column - Content */}
                        <div className='space-y-8'>

                            {/* Badge */}
                            <div className='inline-flex items-center gap-2 bg-[#5C3AEB] text-white px-4 py-2 rounded-full text-sm font-medium'>
                                <Star className='w-4 h-4 fill-current' />
                                <TranslatedText>#1 Instant Connection</TranslatedText>
                            </div>

                             {/* Main Heading */}
                            <div className='space-y-4'>
                                <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight'>
                                    <TranslatedText>{heroContent.title.split(' ')[0]}</TranslatedText>
                                    <span className='text-[#5C3AEB] block'>
                                        <TranslatedText>{heroContent.title.split(' ').slice(1).join(' ')}</TranslatedText>
                                    </span>
                                </h1>
                                <p className='text-xl text-gray-600 leading-relaxed max-w-lg'>
                                    <TranslatedText>
                                        {heroContent.subtitle}
                                    </TranslatedText>
                                </p>
                            </div>

                            {/* Stats */}
                            {heroContent.showStats && (
                                <div className='flex flex-wrap gap-8 text-sm'>
                                    {heroContent.stats.map((stat, index) => (
                                        <div key={index} className='flex items-center gap-2'>
                                            <Users className='w-5 h-5 text-[#5C3AEB]' />
                                            <span className='text-gray-600'>
                                                {stat.value} <TranslatedText>{stat.label}</TranslatedText>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Country Selector */}
                            {heroContent.showCountrySelector && (
                                <div className='space-y-3'>
                                    <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                                        <Globe className='w-4 h-4' />
                                        {isDetectingLocation ? (
                                            <TranslatedText>Detecting your location...</TranslatedText>
                                        ) : (
                                            <TranslatedText>Choose your country:</TranslatedText>
                                        )}
                                    </label>
                                    <div className='relative max-w-xs' ref={dropdownRef}>
                                        <button
                                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                            disabled={isDetectingLocation}
                                            className={`w-full flex items-center justify-between gap-3 bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-left hover:border-[#5C3AEB] focus:outline-none focus:border-[#5C3AEB] focus:ring-2 focus:ring-[#5C3AEB]/20 transition-colors ${isDetectingLocation ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            <div className='flex items-center gap-3'>
                                                {isDetectingLocation ? (
                                                    <div className='w-6 h-4 bg-gray-200 rounded-sm animate-pulse'></div>
                                                ) : (
                                                    <img
                                                        src={countries.find(c => c.name === selectedCountry)?.flag}
                                                        alt={`${selectedCountry} flag`}
                                                        className='w-6 h-4 object-cover rounded-sm border border-gray-200'
                                                        onError={(e) => {
                                                            e.target.style.display = 'none'
                                                        }}
                                                    />
                                                )}
                                                <span className='font-medium'>
                                                    {isDetectingLocation ? (
                                                        <TranslatedText>Detecting...</TranslatedText>
                                                    ) : (
                                                        selectedCountry
                                                    )}
                                                </span>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isCountryDropdownOpen && (
                                            <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto'>
                                                {countries.map((country) => (
                                                    <button
                                                        key={country.code}
                                                        onClick={() => handleCountrySelect(country)}
                                                        className='w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors'
                                                    >
                                                        <img
                                                            src={country.flag}
                                                            alt={`${country.name} flag`}
                                                            className='w-6 h-4 object-cover rounded-sm border border-gray-200'
                                                            onError={(e) => {
                                                                e.target.style.display = 'none'
                                                            }}
                                                        />
                                                        <span className='font-medium'>{country.name}</span>
                                                        {country.name === selectedCountry && (
                                                            <Star className='w-4 h-4 text-[#5C3AEB] ml-auto fill-current' />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Search Bar */}
                            <div className='relative max-w-lg'>
                                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                                <TranslatedInput
                                    type='text'
                                    placeholder={heroContent.searchPlaceholder}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className='w-full pl-12 pr-32 py-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-[#5C3AEB] focus:ring-2 focus:ring-[#5C3AEB]/20'
                                />
                                <button
                                    onClick={handleSearch}
                                    className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#5C3AEB] text-white px-6 py-2 rounded-lg hover:bg-[#342299] transition-colors'
                                >
                                    <TranslatedText>Search</TranslatedText>
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <Link
                                    href={`/dashboard?country=${selectedCountry}`}
                                    className='relative z-20 flex items-center justify-center gap-2 bg-white border-2 border-[#5C3AEB] text-[#5C3AEB] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#5C3AEB] hover:text-white transition-all cursor-pointer'
                                >
                                    <Play className='w-5 h-5' />
                                    <TranslatedText>Post Free Ad</TranslatedText>
                                </Link>
                            </div>

                            {/* Instant Connection Section */}
                            <div className='pt-6 border-t border-gray-200'>
                                <p className='text-sm text-gray-600 mb-4'>
                                    <TranslatedText>Get instant help:</TranslatedText>
                                </p>
                                <div className='flex flex-wrap items-center gap-4'>
                                    {/* WhatsApp */}
                                    <a
                                        href="https://api.whatsapp.com/send/?phone=12019790148&text&type=phone_number&app_absent=0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all cursor-pointer"
                                    >
                                        <MessageCircleMore className='w-4 h-4' />
                                        <span>WhatsApp</span>
                                    </a>

                                    {/* Facebook */}
                                    <a
                                        href="https://m.me/61577053655499"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
                                    >
                                        <MessageCircleMore className='w-4 h-4' />
                                        <span>Messenger</span>
                                    </a>

                                    {/* LinkedIn */}
                                    <a
                                        href="https://www.linkedin.com/company/108025422"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-all cursor-pointer"
                                    >
                                        <Linkedin className='w-4 h-4' />
                                        <span>LinkedIn</span>
                                    </a>

                                    {/* Phone Call */}
                                    <a
                                        href="tel:+12019790148"
                                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all cursor-pointer"
                                    >
                                        <Phone className='w-4 h-4' />
                                        <TranslatedText>Call Now</TranslatedText>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Visual Content */}
                        <div className='relative z-10'>

                            {/* Main Hero Image Area */}
                            <div className='relative bg-gradient-to-br from-[#5C3AEB] to-[#342299] rounded-3xl p-8 lg:p-12'>
                                <div className='text-center text-white space-y-6'>
                                    <h3 className='text-2xl lg:text-3xl font-bold'>
                                        <TranslatedText>Discover Talent in</TranslatedText> {selectedCountry}!
                                    </h3>
                                    <p className='text-white/70'>
                                        <TranslatedText>Connecting top talent with opportunities worldwide</TranslatedText>
                                    </p>

                                    {/* Quick Stats Cards */}
                                    <div className='grid grid-cols-2 gap-4 mt-8'>
                                        <div className='bg-white/10 backdrop-blur rounded-xl p-4'>
                                            <div className='text-2xl font-bold'>10K+</div>
                                            <div className='text-sm opacity-80'>
                                                <TranslatedText>Talents</TranslatedText>
                                            </div>
                                        </div>
                                        <div className='bg-white/10 backdrop-blur rounded-xl p-4'>
                                            <div className='text-2xl font-bold'>500+</div>
                                            <div className='text-sm opacity-80'>
                                                <TranslatedText>Jobs</TranslatedText>
                                            </div>
                                        </div>
                                        <div className='bg-white/10 backdrop-blur rounded-xl p-4'>
                                            <div className='text-2xl font-bold'>200+</div>
                                            <div className='text-sm opacity-80'>
                                                <TranslatedText>Investors</TranslatedText>
                                            </div>
                                        </div>
                                        <div className='bg-white/10 backdrop-blur rounded-xl p-4'>
                                            <div className='text-2xl font-bold'>300+</div>
                                            <div className='text-sm opacity-80'>
                                                <TranslatedText>Scholarships</TranslatedText>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Country Badge */}
                                    <div className='bg-white/20 backdrop-blur rounded-full px-4 py-2 inline-flex items-center gap-2'>
                                        <img
                                            src={countries.find(c => c.name === selectedCountry)?.flag}
                                            alt={`${selectedCountry} flag`}
                                            className='w-5 h-3 object-cover rounded-sm'
                                            onError={(e) => {
                                                e.target.style.display = 'none'
                                            }}
                                        />
                                        <span className='text-sm font-medium'>
                                            {selectedCountry}
                                        </span>
                                    </div>

                                    {/* Social Proof */}
                                    <div className='pt-6'>
                                        <p className='text-sm text-white/80 mb-3'>
                                            <TranslatedText>Connect with us:</TranslatedText>
                                        </p>
                                        <div className='flex justify-center space-x-3'>
                                            <a href="#" className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all'>
                                                <MessageCircleMore className='w-4 h-4 text-white' />
                                            </a>
                                            <a href="#" className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all'>
                                                <Facebook className='w-4 h-4 text-white' />
                                            </a>
                                            <a href="#" className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all'>
                                                <Linkedin className='w-4 h-4 text-white' />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className='absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg'>
                                    <MessageCircle className='w-6 h-6 text-[#5C3AEB]' />
                                </div>
                                <div className='absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg'>
                                    <Star className='w-6 h-6 text-yellow-500 fill-current' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Background Elements - Ensure they're behind content */}
                <div className='absolute top-0 right-0 w-96 h-96 bg-[#5C3AEB]/5 rounded-full blur-3xl -z-10'></div>
                <div className='absolute bottom-0 left-0 w-96 h-96 bg-[#5C3AEB]/5 rounded-full blur-3xl -z-10'></div>
            </div>
        </div>
    )
}

export default Hero
