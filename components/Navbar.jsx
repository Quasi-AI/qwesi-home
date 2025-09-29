'use client'
import { Search, ShoppingCart, Menu, X, User, ChevronDown, Settings, Package, LogOut, Plus, Globe, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import TranslateService from '@/services/TranslateService'
import LoginModal from '@/modals/LoginModal'
import SignupModal from '@/modals/SignupModal'
import { readAuth, clearAuth, validateStoredToken } from '@/lib/auth'
import ForgotPasswordModal from '@/modals/ForgotPasswordModal'
import ResetPasswordModal from '@/modals/ResetPasswordModal'

// Initialize translation service
const translateService = new TranslateService();

// Translation Hook
const useTranslation = () => {
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
  const { translate, currentLanguage } = useTranslation();
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

const Navbar = () => {
    const router = useRouter();
    
    const [search, setSearch] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [showSignup, setShowSignup] = useState(false)
    const [userDropdownOpen, setUserDropdownOpen] = useState(false)
    const [showForgot, setShowForgot] = useState(false)
    const [showReset, setShowReset] = useState(false)
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState('English')
    const [isDetectingLanguage, setIsDetectingLanguage] = useState(true)
    const [isClient, setIsClient] = useState(false)

    const languageDropdownRef = useRef(null)
    const cartCount = useSelector(state => state.cart.total)
    
    const [user, setUser] = useState(null)

    // Language configuration
    const languages = [
        { name: 'English', code: 'en', flag: 'https://flagcdn.com/w40/us.png', nativeName: 'English' },
        { name: 'French', code: 'fr', flag: 'https://flagcdn.com/w40/fr.png', nativeName: 'Français' },
        { name: 'Spanish', code: 'es', flag: 'https://flagcdn.com/w40/es.png', nativeName: 'Español' },
        { name: 'German', code: 'de', flag: 'https://flagcdn.com/w40/de.png', nativeName: 'Deutsch' },
        { name: 'Portuguese', code: 'pt', flag: 'https://flagcdn.com/w40/pt.png', nativeName: 'Português' },
        { name: 'Arabic', code: 'ar', flag: 'https://flagcdn.com/w40/sa.png', nativeName: 'العربية' },
        { name: 'Swahili', code: 'sw', flag: 'https://flagcdn.com/w40/ke.png', nativeName: 'Kiswahili' },
        { name: 'Amharic', code: 'am', flag: 'https://flagcdn.com/w40/et.png', nativeName: 'አማርኛ' },
        { name: 'Hausa', code: 'ha', flag: 'https://flagcdn.com/w40/ng.png', nativeName: 'Hausa' },
        { name: 'Yoruba', code: 'yo', flag: 'https://flagcdn.com/w40/ng.png', nativeName: 'Yorùbá' }
    ]

    const browserLanguageMapping = {
        'en': 'English', 'en-US': 'English', 'en-GB': 'English',
        'fr': 'French', 'fr-FR': 'French',
        'es': 'Spanish', 'es-ES': 'Spanish',
        'de': 'German', 'de-DE': 'German',
        'pt': 'Portuguese', 'pt-PT': 'Portuguese', 'pt-BR': 'Portuguese',
        'ar': 'Arabic', 'sw': 'Swahili', 'am': 'Amharic', 'ha': 'Hausa', 'yo': 'Yoruba'
    }

    useEffect(() => {
        const detectLanguage = () => {
            try {
                setIsDetectingLanguage(true)
                const browserLang = navigator.language || navigator.languages?.[0] || 'en'
                const detectedLanguage = browserLanguageMapping[browserLang] || 
                                       browserLanguageMapping[browserLang.split('-')[0]] || 
                                       'English'
                const savedLanguage = localStorage.getItem('preferred-language')
                
                if (savedLanguage && languages.find(lang => lang.name === savedLanguage)) {
                    setSelectedLanguage(savedLanguage)
                } else {
                    setSelectedLanguage(detectedLanguage)
                    localStorage.setItem('preferred-language', detectedLanguage)
                }
            } catch (error) {
                console.log('Could not detect language:', error)
                setSelectedLanguage('English')
            } finally {
                setIsDetectingLanguage(false)
            }
        }

        detectLanguage()
    }, [])

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language.name)
        setLanguageDropdownOpen(false)
        localStorage.setItem('preferred-language', language.name)
        window.dispatchEvent(new CustomEvent('language-change', { 
            detail: { language: language.name, code: language.code } 
        }))
        document.documentElement.lang = language.code
    }

    useEffect(() => {
        const onClick = (e) => {
            try {
                const target = e.target
                if (!target) return
                const anchor = target.closest && target.closest('a[href]')
                if (!anchor) return
                const href = anchor.getAttribute('href')
                if (!href || href.startsWith('#')) return
                if (anchor.target === '_blank' || anchor.hasAttribute('download') || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
                const url = new URL(anchor.href, window.location.href)
                if (url.origin !== window.location.origin) return
                const path = url.pathname
                const isProtected = path.startsWith('/dashboard') || path.startsWith('/store')
                if (!isProtected) return
                const auth = readAuth()
                const loggedIn = !!auth?.token
                if (!loggedIn) {
                    e.preventDefault()
                    e.stopPropagation()
                    window.dispatchEvent(new Event('auth:open-login'))
                }
            } catch {}
        }
        document.addEventListener('click', onClick)
        return () => document.removeEventListener('click', onClick)
    }, [])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const auth = readAuth()
        if (auth?.user) setUser(auth.user)
        if (auth?.user?.expiresAt) {
            const expiresAt = new Date(auth.user.expiresAt)
            if (new Date() >= expiresAt) {
                clearAuth()
                setUser(null)
            }
        }
    }, [])

    useEffect(() => {
        const handler = () => setShowLogin(true)
        window.addEventListener('auth:open-login', handler)
        return () => window.removeEventListener('auth:open-login', handler)
    }, [])

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
                setMobileMenuOpen(false)
            }
            if (userDropdownOpen && !event.target.closest('.user-dropdown-container')) {
                setUserDropdownOpen(false)
            }
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
                setLanguageDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [mobileMenuOpen, userDropdownOpen])

    const handleSearch = (e) => {
        e.preventDefault()
        if (search.trim()) {
            router.push(`/shop?search=${search}`)
            setSearchOpen(false)
            setMobileMenuOpen(false)
        }
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
        setSearchOpen(false)
        setUserDropdownOpen(false)
        setLanguageDropdownOpen(false)
    }

    const toggleSearch = () => {
        setSearchOpen(!searchOpen)
        setMobileMenuOpen(false)
        setUserDropdownOpen(false)
        setLanguageDropdownOpen(false)
    }

    const toggleUserDropdown = () => {
        setUserDropdownOpen(!userDropdownOpen)
        setMobileMenuOpen(false)
        setSearchOpen(false)
        setLanguageDropdownOpen(false)
    }

    const toggleLanguageDropdown = () => {
        setLanguageDropdownOpen(!languageDropdownOpen)
        setMobileMenuOpen(false)
        setSearchOpen(false)
        setUserDropdownOpen(false)
    }

    const handleLoginClick = () => {
        const auth = readAuth()
        if (auth?.token && auth?.user) {
            setUser(auth.user)
            return
        }
        setShowLogin(true)
        setMobileMenuOpen(false)
        setUserDropdownOpen(false)
    }

    const handleSignupClick = () => {
        setShowSignup(true)
        setMobileMenuOpen(false)
        setUserDropdownOpen(false)
    }

    const switchToSignup = () => {
        setShowLogin(false)
        setShowSignup(true)
    }

    const switchToLogin = () => {
        setShowSignup(false)
        setShowLogin(true)
    }

    const handleLogout = () => {
        clearAuth()
        setUser(null)
        setUserDropdownOpen(false)
    }

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/shop', label: 'Shop' },
        { href: '/jobs', label: 'Jobs' },
        { href: '/scholarships', label: 'Scholarships' },
        { href: '/about', label: 'About' }
    ]

    const userMenuItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/profile', label: 'Manage account', icon: Settings },
        { href: '/cart', label: 'Cart', icon: ShoppingCart },
        { href: '/orders', label: 'My Orders', icon: Package },
    ]

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
                scrolled ? 'shadow-lg backdrop-blur-md bg-white/95' : 'shadow-sm'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        
                        {/* Logo */}
                        <Link 
                            href="/" 
                            className="flex-shrink-0 transition-transform hover:scale-105 duration-200"
                        >
                            <Image 
                                width={120}
                                height={40}
                                className='h-8 lg:h-10 w-auto' 
                                src="/logo.png" 
                                alt="Company Logo" 
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-700 hover:text-[#5C3AEB] font-medium transition-colors duration-200 relative group"
                                >
                                    <TranslatedText>{link.label}</TranslatedText>
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#5C3AEB] transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Search Bar */}
                        <div className="hidden xl:block">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="flex items-center w-80 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-full border border-gray-200 focus-within:border-[#5C3AEB] focus-within:ring-2 focus-within:ring-[#5C3AEB]/20">
                                    <Search size={20} className="text-gray-400 ml-4" />
                                    <input 
                                        className="w-full bg-transparent outline-none px-4 py-3 text-sm placeholder-gray-500" 
                                        type="text" 
                                        placeholder="Search products, brands..." 
                                        value={search} 
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => setSearch('')}
                                            className="mr-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            <X size={16} className="text-gray-400" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center space-x-4">
                            {/* Language Selector */}
                            <div className="language-dropdown-container relative" ref={languageDropdownRef}>
                                <button 
                                    onClick={toggleLanguageDropdown}
                                    disabled={isDetectingLanguage}
                                    className={`flex items-center space-x-2 p-2 text-gray-600 hover:text-[#5C3AEB] hover:bg-gray-50 rounded-full transition-all duration-200 ${isDetectingLanguage ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    title={isDetectingLanguage ? 'Detecting language...' : `Language: ${selectedLanguage}`}
                                >
                                    {isDetectingLanguage ? (
                                        <div className='w-5 h-3 bg-gray-200 rounded-sm animate-pulse'></div>
                                    ) : (
                                        <img 
                                            src={languages.find(lang => lang.name === selectedLanguage)?.flag}
                                            alt={`${selectedLanguage} flag`}
                                            className='w-5 h-3 object-cover rounded-sm'
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    )}
                                    <Globe size={16} />
                                    <ChevronDown 
                                        size={14} 
                                        className={`transition-transform duration-200 ${
                                            languageDropdownOpen ? 'rotate-180' : 'rotate-0'
                                        }`} 
                                    />
                                </button>

                                {/* Language Dropdown */}
                                {languageDropdownOpen && !isDetectingLanguage && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-64 overflow-y-auto">
                                        {languages.map((language) => (
                                            <button
                                                key={language.code}
                                                onClick={() => handleLanguageSelect(language)}
                                                className='w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm'
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <img 
                                                        src={language.flag}
                                                        alt={`${language.name} flag`}
                                                        className='w-5 h-3 object-cover rounded-sm'
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                    <div>
                                                        <div className='font-medium text-gray-900'>{language.name}</div>
                                                        <div className='text-xs text-gray-500'>{language.nativeName}</div>
                                                    </div>
                                                </div>
                                                {language.name === selectedLanguage && (
                                                    <div className='w-2 h-2 bg-[#5C3AEB] rounded-full'></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Search Toggle for medium screens */}
                            <button 
                                onClick={toggleSearch}
                                className="xl:hidden p-2 text-gray-600 hover:text-[#5C3AEB] hover:bg-gray-50 rounded-full transition-all duration-200"
                            >
                                <Search size={20} />
                            </button>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="relative flex items-center space-x-2 text-gray-700 hover:text-[#5C3AEB] transition-colors duration-200 p-2 hover:bg-gray-50 rounded-full"
                            >
                                <ShoppingCart size={20} />
                                <TranslatedText className="hidden xl:inline font-medium">Cart</TranslatedText>
                                {isClient && cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#5C3AEB] text-white text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center animate-pulse">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Profile Dropdown or Login Button */}
                            {user ? (
                                <div className="user-dropdown-container relative">
                                    <button 
                                        onClick={toggleUserDropdown}
                                        className="flex items-center space-x-3 p-2 text-gray-700 hover:text-[#5C3AEB] hover:bg-gray-50 rounded-full transition-all duration-200"
                                    >
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                            {user.avatar && user.avatar.trim() ? (
                                                <Image
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium text-gray-600">
                                                    {user.name?.charAt(0) || 'U'}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronDown 
                                            size={16} 
                                            className={`transition-transform duration-200 ${
                                                userDropdownOpen ? 'rotate-180' : 'rotate-0'
                                            }`} 
                                        />
                                    </button>

                                    {/* User Dropdown Menu */}
                                    {userDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                                        {user.avatar && user.avatar.trim() ? (
                                                            <Image
                                                                src={user.avatar}
                                                                alt={user.name}
                                                                width={40}
                                                                height={40}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-lg font-medium text-gray-600">
                                                                {user.name?.charAt(0) || 'U'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            {userMenuItems.map((item) => {
                                                const IconComponent = item.icon
                                                return (
                                                    <Link 
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setUserDropdownOpen(false)}
                                                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                    >
                                                        <IconComponent size={16} className="text-gray-500" />
                                                        <TranslatedText>{item.label}</TranslatedText>
                                                    </Link>
                                                )
                                            })}

                                            {/* Sign Out */}
                                            <button 
                                                onClick={handleLogout}
                                                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <LogOut size={16} className="text-gray-500" />
                                                <TranslatedText>Sign out</TranslatedText>
                                            </button>

                                            <hr className="my-2 border-gray-100" />

                                            {/* Add Account */}
                                            <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                                <Plus size={16} className="text-gray-500" />
                                                <TranslatedText>Add account</TranslatedText>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button 
                                    onClick={handleLoginClick}
                                    className="bg-[#5C3AEB] hover:bg-[#3525b8] text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center space-x-2"
                                >
                                    <User size={18} />
                                    <TranslatedText>Login</TranslatedText>
                                </button>
                            )}
                        </div>

                        {/* Mobile Actions */}
                        <div className="lg:hidden flex items-center space-x-2">
                            {/* Mobile Language Selector */}
                            <div className="relative" ref={languageDropdownRef}>
                                <button 
                                    onClick={toggleLanguageDropdown}
                                    disabled={isDetectingLanguage}
                                    className={`p-2 rounded-full transition-all duration-200 ${
                                        languageDropdownOpen 
                                            ? 'bg-[#5C3AEB] text-white shadow-lg' 
                                            : 'text-gray-600 hover:text-[#5C3AEB] hover:bg-gray-50'
                                    } ${isDetectingLanguage ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    <Globe size={20} />
                                </button>

                                {/* Mobile Language Dropdown */}
                                {languageDropdownOpen && !isDetectingLanguage && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-48 overflow-y-auto">
                                        {languages.map((language) => (
                                            <button
                                                key={language.code}
                                                onClick={() => handleLanguageSelect(language)}
                                                className='w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm'
                                            >
                                                <img 
                                                    src={language.flag}
                                                    alt={`${language.name} flag`}
                                                    className='w-4 h-3 object-cover rounded-sm'
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                                <span className='font-medium'>{language.name}</span>
                                                {language.name === selectedLanguage && (
                                                    <div className='w-2 h-2 bg-[#5C3AEB] rounded-full ml-auto'></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Search */}
                            <button 
                                onClick={toggleSearch}
                                className={`p-2 rounded-full transition-all duration-200 ${
                                    searchOpen 
                                        ? 'bg-[#5C3AEB] text-white shadow-lg' 
                                        : 'text-gray-600 hover:text-[#5C3AEB] hover:bg-gray-50'
                                }`}
                            >
                                <Search size={20} />
                            </button>

                            {/* Mobile Cart */}
                            <Link
                                href="/cart"
                                className="relative p-2 text-gray-600 hover:text-[#5C3AEB] hover:bg-gray-50 rounded-full transition-all duration-200"
                            >
                                <ShoppingCart size={20} />
                                {isClient && cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#5C3AEB] text-white text-xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Button */}
                            <button 
                                onClick={toggleMobileMenu}
                                className={`mobile-menu-container p-2 rounded-full transition-all duration-200 ${
                                    mobileMenuOpen 
                                        ? 'bg-[#5C3AEB] text-white shadow-lg' 
                                        : 'text-gray-600 hover:text-[#5C3AEB] hover:bg-gray-50'
                                }`}
                            >
                                <div className="relative">
                                    <Menu 
                                        size={24} 
                                        className={`transition-all duration-300 ${
                                            mobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                                        }`} 
                                    />
                                    <X 
                                        size={24} 
                                        className={`absolute inset-0 transition-all duration-300 ${
                                            mobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                                        }`}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {searchOpen && (
                    <div className="lg:hidden border-t border-gray-200 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="flex items-center bg-gray-50 rounded-lg sm:rounded-full border border-gray-200 focus-within:border-[#5C3AEB] focus-within:ring-2 focus-within:ring-[#5C3AEB]/20 overflow-hidden">
                                    <Search size={18} className="text-gray-400 ml-3 sm:ml-4 flex-shrink-0" />
                                    <input 
                                        className="w-full bg-transparent outline-none px-3 sm:px-4 py-2.5 sm:py-3 text-sm placeholder-gray-500 min-w-0" 
                                        type="text" 
                                        placeholder="Search products..." 
                                        value={search} 
                                        onChange={(e) => setSearch(e.target.value)}
                                        autoFocus
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => setSearch('')}
                                            className="mr-2 sm:mr-3 p-1 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
                                        >
                                            <X size={14} className="text-gray-400" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                <div className={`lg:hidden border-t border-gray-200 bg-white mobile-menu-container transition-all duration-300 overflow-hidden ${
                    mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
                        
                        {/* Mobile Language Selector */}
                        {mobileMenuOpen && (
                            <div className="pb-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <TranslatedText className="text-sm font-medium text-gray-700">Language</TranslatedText>
                                    <div className="flex items-center space-x-2">
                                        {!isDetectingLanguage && (
                                            <img 
                                                src={languages.find(lang => lang.name === selectedLanguage)?.flag}
                                                alt={`${selectedLanguage} flag`}
                                                className='w-5 h-3 object-cover rounded-sm'
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        )}
                                        <span className="text-sm text-gray-600">
                                            {isDetectingLanguage ? 'Detecting...' : selectedLanguage}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* User Info Section for Mobile (when logged in) */}
                        {user && mobileMenuOpen && (
                            <div className="pb-4 border-b border-gray-100">
                                <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {user.avatar && user.avatar.trim() ? (
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-lg sm:text-xl font-medium text-gray-600">
                                                {user.name?.charAt(0) || 'U'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{user.name}</p>
                                        <p className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* User Menu Items for Mobile (when logged in) */}
                        {user && mobileMenuOpen && (
                            <div className="space-y-1 pb-4 border-b border-gray-100">
                                {userMenuItems.map((item) => {
                                    const IconComponent = item.icon
                                    return (
                                        <Link 
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center space-x-3 text-gray-700 hover:text-[#5C3AEB] py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <IconComponent size={18} className="flex-shrink-0" />
                                            <TranslatedText className="text-sm sm:text-base font-medium">{item.label}</TranslatedText>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}

                        {/* Navigation Links */}
                        <div className="space-y-1">
                            {navLinks.map((link, index) => (
                                <Link 
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block text-base sm:text-lg font-medium text-gray-700 hover:text-[#5C3AEB] hover:bg-gray-50 transition-all duration-200 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transform ${
                                        mobileMenuOpen 
                                            ? 'translate-x-0 opacity-100' 
                                            : 'translate-x-4 opacity-0'
                                    }`}
                                    style={{ 
                                        transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms'
                                    }}
                                >
                                    <TranslatedText>{link.label}</TranslatedText>
                                </Link>
                            ))}
                        </div>

                        <hr className="border-gray-200" />

                        {/* Mobile Actions */}
                        <div className={`space-y-3 sm:space-y-4 transform transition-all duration-300 ${
                            mobileMenuOpen 
                                ? 'translate-y-0 opacity-100' 
                                : 'translate-y-4 opacity-0'
                        }`} style={{ transitionDelay: mobileMenuOpen ? '200ms' : '0ms' }}>
                            
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-red-50 transition-colors border border-red-300"
                                >
                                    <LogOut size={18} />
                                    <TranslatedText>Sign out</TranslatedText>
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleLoginClick}
                                        className="w-full bg-[#5C3AEB] hover:bg-[#3525b8] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-full font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
                                    >
                                        <User size={16} />
                                        <TranslatedText>Login</TranslatedText>
                                    </button>
                                    
                                    <div className="text-center text-xs sm:text-sm text-gray-500">
                                        <TranslatedText>New customer?</TranslatedText>
                                        {' '}
                                        <button 
                                            onClick={handleSignupClick}
                                            className="text-[#5C3AEB] hover:underline font-medium"
                                        >
                                            <TranslatedText>Create an account</TranslatedText>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content from hiding behind fixed navbar */}
            <div className="h-16 lg:h-20"></div>

            {/* Login Modal */}
            <LoginModal 
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToSignup={switchToSignup}
                onLoggedIn={(result) => { setUser(result.user || null) }}
                onForgotPassword={() => { setShowLogin(false); setShowForgot(true) }}
            />

            <ForgotPasswordModal
                isOpen={showForgot}
                onClose={() => setShowForgot(false)}
                onSwitchToReset={() => { setShowForgot(false); setShowReset(true) }}
            />
            <ResetPasswordModal
                isOpen={showReset}
                onClose={() => setShowReset(false)}
            />

            {/* Signup Modal */}
            <SignupModal 
                isOpen={showSignup}
                onClose={() => setShowSignup(false)}
                onSwitchToLogin={switchToLogin}
            />
        </>
    )
}

export default Navbar