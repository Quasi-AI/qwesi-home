'use client'
import { ArrowRight, MessageCircle, Facebook, Linkedin, Star, Users, TrendingUp, Search, Play, Phone, MessageCircleMore, Globe, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import TranslateService from '@/services/TranslateService'
import CategoriesMarquee from './CategoriesMarquee'
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

    const { translate, currentLanguage, isTranslating } = useGoogleTranslate()
    const { country, loading: isDetectingLocation } = useLocationDetection()

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
        console.log('Searching for:', searchQuery, 'in', selectedCountry)
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
            <div className='relative overflow-hidden bg-gradient-to-br from-[#5C3AEB]/5 via-white to-[#5C3AEB]/10'>
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
                                    <TranslatedText>Find Instant</TranslatedText>
                                    <span className='text-[#5C3AEB] block'>
                                        <TranslatedText>Connections to Opportunities</TranslatedText>
                                    </span>
                                </h1>
                                <p className='text-xl text-gray-600 leading-relaxed max-w-lg'>
                                    <TranslatedText>
                                        Connect with real people in your area. From cars to jobs, electronics to services - discover thousands of opportunities.
                                    </TranslatedText>
                                </p>
                            </div>
                            
                            {/* Stats */}
                            <div className='flex flex-wrap gap-8 text-sm'>
                                <div className='flex items-center gap-2'>
                                    <Users className='w-5 h-5 text-[#5C3AEB]' />
                                    <span className='text-gray-600'>
                                        4M+ <TranslatedText>Users</TranslatedText>
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <TrendingUp className='w-5 h-5 text-[#5C3AEB]' />
                                    <span className='text-gray-600'>
                                        50K+ <TranslatedText>Daily Ads</TranslatedText>
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Star className='w-5 h-5 text-[#5C3AEB]' />
                                    <span className='text-gray-600'>
                                        4.8 <TranslatedText>Rating</TranslatedText>
                                    </span>
                                </div>
                            </div>
                            
                            {/* Country Selector */}
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
                            
                            {/* Search Bar */}
                            <div className='relative max-w-lg'>
                                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                                <TranslatedInput
                                    type='text'
                                    placeholder={`What are you looking for in ${selectedCountry}?`}
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
                                    href={`/categories?country=${selectedCountry}`}
                                    className='relative z-20 flex items-center justify-center gap-2 bg-[#5C3AEB] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#342299] transition-all cursor-pointer'
                                >
                                    <TranslatedText>Browse Categories</TranslatedText>
                                    <ArrowRight className='w-5 h-5' />
                                </Link>
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
                                        <TranslatedText>Start Selling in</TranslatedText> {selectedCountry}!
                                    </h3>
                                    <p className='text-white/70'>
                                        <TranslatedText>Join thousands of successful sellers across Africa</TranslatedText>
                                    </p>
                                    
                                    {/* Quick Stats Cards */}
                                    <div className='grid grid-cols-2 gap-4 mt-8'>
                                        <div className='bg-white/10 backdrop-blur rounded-xl p-4'>
                                            <div className='text-2xl font-bold'>89K+</div>
                                            <div className='text-sm opacity-80'>
                                                <TranslatedText>Active Listings</TranslatedText>
                                            </div>
                                        </div>
                                        <div className='bg-white/10 backdrop-blur rounded-xl p-4'>
                                            <div className='text-2xl font-bold'>24/7</div>
                                            <div className='text-sm opacity-80'>
                                                <TranslatedText>Support</TranslatedText>
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
                    
                    {/* Horizontally Scrollable Quick Access Cards */}
                    <div className='mt-16 relative z-20'>
                        <h3 className='text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2'>
                            <TranslatedText>Popular in</TranslatedText> {selectedCountry}
                            <img 
                                src={countries.find(c => c.name === selectedCountry)?.flag}
                                alt={`${selectedCountry} flag`}
                                className='w-6 h-4 object-cover rounded-sm border border-gray-200'
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                }}
                            />
                        </h3>
                        <div className='overflow-x-auto pb-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400'>
                            <div className='flex gap-4 min-w-max'>
                                <Link href={`/shop?category=vehicles&country=${selectedCountry}`} className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        🚗
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>
                                        <TranslatedText>Vehicles</TranslatedText>
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        12K+ <TranslatedText>listings</TranslatedText>
                                    </p>
                                </Link>
                                
                                <Link href={`/shop?category=property&country=${selectedCountry}`} className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        🏠
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>
                                        <TranslatedText>Property</TranslatedText>
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        8K+ <TranslatedText>listings</TranslatedText>
                                    </p>
                                </Link>
                                
                                <Link href={`/shop?category=electronics&country=${selectedCountry}`} className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        📱
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>
                                        <TranslatedText>Electronics</TranslatedText>
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        15K+ <TranslatedText>listings</TranslatedText>
                                    </p>
                                </Link>
                                
                                <Link href={`/talent-pool?country=${selectedCountry}`} className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#00C4A7]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        👥
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>
                                        <TranslatedText>Find Talent</TranslatedText>
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        15K+ <TranslatedText>freelancers</TranslatedText>
                                    </p>
                                </Link>

                                <Link href={`/investors?country=${selectedCountry}`} className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#00C4A7]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        💰
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>
                                        <TranslatedText>Find Investors</TranslatedText>
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        15K+ <TranslatedText>investors</TranslatedText>
                                    </p>
                                </Link>

                                <Link href={`/jobs?country=${selectedCountry}`} className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#FF6B6B]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        🔍
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>
                                        <TranslatedText>Job Seeker</TranslatedText>
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        2.5K+ <TranslatedText>opportunities</TranslatedText>
                                    </p>
                                </Link>

                                <Link href={`/shop?category=services&country=${selectedCountry}`} className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        🔧
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>
                                        <TranslatedText>Services</TranslatedText>
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        9K+ <TranslatedText>providers</TranslatedText>
                                    </p>
                                </Link>

                                <Link href={`/shop?category=furniture&country=${selectedCountry}`} className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        🪑
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>
                                        <TranslatedText>Furniture</TranslatedText>
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        4K+ <TranslatedText>listings</TranslatedText>
                                    </p>
                                </Link>

                                <Link href={`/shop?category=books&country=${selectedCountry}`} className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        📚
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>
                                        <TranslatedText>Books & Education</TranslatedText>
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        3K+ <TranslatedText>listings</TranslatedText>
                                    </p>
                                </Link>

                                <Link href={`/shop?category=sports&country=${selectedCountry}`} className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        ⚽
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>
                                        <TranslatedText>Sports & Fitness</TranslatedText>
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        2K+ <TranslatedText>listings</TranslatedText>
                                    </p>
                                </Link>

                                <Link href={`/shop?category=pets&country=${selectedCountry}`} className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        🐕
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>
                                        <TranslatedText>Pets & Animals</TranslatedText>
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        1.5K+ <TranslatedText>listings</TranslatedText>
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Background Elements - Ensure they're behind content */}
                <div className='absolute top-0 right-0 w-96 h-96 bg-[#5C3AEB]/5 rounded-full blur-3xl -z-10'></div>
                <div className='absolute bottom-0 left-0 w-96 h-96 bg-[#5C3AEB]/5 rounded-full blur-3xl -z-10'></div>
            </div>
            <CategoriesMarquee />
        </div>
    )
}

export default Hero