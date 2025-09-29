// translateService.js - Enhanced LibreTranslate integration
class TranslateService {
  constructor(apiUrls = ['']) {
    this.apiUrls = apiUrls;
    this.currentApiIndex = 0;
    this.cache = new Map();
    this.rateLimitDelay = 100; // milliseconds between requests
    this.cacheTTL = 60 * 60 * 1000; // 1 hour cache expiration
    this.maxRetries = 3;
  }

  // Comprehensive language code mapping
  getLanguageCode(languageName) {
    const mapping = {
      // Major languages
      'English': 'en',
      'French': 'fr',
      'Spanish': 'es',
      'German': 'de',
      'Portuguese': 'pt',
      'Italian': 'it',
      'Russian': 'ru',
      'Chinese': 'zh',
      'Japanese': 'ja',
      'Korean': 'ko',
      'Hindi': 'hi',
      'Arabic': 'ar',
      'Turkish': 'tr',
      'Dutch': 'nl',
      'Polish': 'pl',
      'Swedish': 'sv',
      'Norwegian': 'no',
      'Danish': 'da',
      'Finnish': 'fi',
      'Greek': 'el',
      'Czech': 'cs',
      'Hungarian': 'hu',
      'Romanian': 'ro',
      'Bulgarian': 'bg',
      'Croatian': 'hr',
      'Serbian': 'sr',
      'Slovak': 'sk',
      'Slovenian': 'sl',
      'Estonian': 'et',
      'Latvian': 'lv',
      'Lithuanian': 'lt',
      'Ukrainian': 'uk',
      'Belarusian': 'be',
      
      // African languages
      'Swahili': 'sw',
      'Amharic': 'am',
      'Hausa': 'ha',
      'Yoruba': 'yo',
      'Zulu': 'zu',
      'Xhosa': 'xh',
      'Afrikaans': 'af',
      'Somali': 'so',
      'Oromo': 'om',
      'Tigrinya': 'ti',
      'Malagasy': 'mg',
      
      // Asian languages
      'Thai': 'th',
      'Vietnamese': 'vi',
      'Indonesian': 'id',
      'Malay': 'ms',
      'Filipino': 'tl',
      'Bengali': 'bn',
      'Gujarati': 'gu',
      'Punjabi': 'pa',
      'Tamil': 'ta',
      'Telugu': 'te',
      'Kannada': 'kn',
      'Malayalam': 'ml',
      'Marathi': 'mr',
      'Nepali': 'ne',
      'Sinhala': 'si',
      'Burmese': 'my',
      'Khmer': 'km',
      'Lao': 'lo',
      
      // Middle Eastern languages
      'Persian': 'fa',
      'Hebrew': 'he',
      'Urdu': 'ur',
      
      // Others
      'Esperanto': 'eo',
      'Latin': 'la'
    };
    
    return mapping[languageName] || languageName.toLowerCase();
  }

  // Cache key generator with TTL
  getCacheKey(text, sourceLang, targetLang) {
    return `${sourceLang}>${targetLang}:${text}`;
  }

  // Check if cache entry is valid
  isCacheValid(cacheEntry) {
    return cacheEntry && (Date.now() - cacheEntry.timestamp) < this.cacheTTL;
  }

  // Get cached translation if valid
  getCachedTranslation(text, sourceLang, targetLang) {
    const cacheKey = this.getCacheKey(text, sourceLang, targetLang);
    const cached = this.cache.get(cacheKey);
    
    if (this.isCacheValid(cached)) {
      return cached.text;
    } else if (cached) {
      // Remove expired cache entry
      this.cache.delete(cacheKey);
    }
    
    return null;
  }

  // Cache translation with timestamp
  cacheTranslation(text, sourceLang, targetLang, translatedText) {
    const cacheKey = this.getCacheKey(text, sourceLang, targetLang);
    this.cache.set(cacheKey, {
      text: translatedText,
      timestamp: Date.now()
    });
  }

  // Get current API URL
  getCurrentApiUrl() {
    return this.apiUrls[this.currentApiIndex];
  }

  // Switch to next API endpoint
  switchToNextApi() {
    this.currentApiIndex = (this.currentApiIndex + 1) % this.apiUrls.length;
  }

  // Detect language (if supported by the API)
  async detectLanguage(text) {
    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text })
      });

      if (response.ok) {
        const data = await response.json();
        return data[0]?.language || 'auto';
      }
    } catch (error) {
      console.warn('Language detection failed, using auto:', error);
    }

    return 'auto';
  }

  // Make translation request with retry logic
  async makeTranslationRequest(text, sourceLang, targetLang, retryCount = 0) {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.translatedText) {
        throw new Error('No translated text in response');
      }

      return data.translatedText;
      
    } catch (error) {
      console.error('Translation failed:', error);
      
      // Try next API endpoint if available and retries left
      if (retryCount < this.maxRetries - 1) {
        // Since we have only one endpoint, just retry with delay
        await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay * (retryCount + 1)));
        
        return this.makeTranslationRequest(text, sourceLang, targetLang, retryCount + 1);
      }
      
      throw error;
    }
  }

  // Translate single text
  async translateText(text, targetLanguage = 'en', sourceLanguage = 'auto') {
    // Input validation
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return text;
    }

    const sourceLang = sourceLanguage === 'auto' ? 'auto' : this.getLanguageCode(sourceLanguage);
    const targetLang = this.getLanguageCode(targetLanguage);

    // No translation needed if source and target are the same
    if (sourceLang === targetLang && sourceLang !== 'auto') {
      return text;
    }

    // Check cache first
    const cached = this.getCachedTranslation(text, sourceLang, targetLang);
    if (cached) {
      return cached;
    }

    // Auto-detect source language if needed
    let finalSourceLang = sourceLang;
    if (sourceLang === 'auto') {
      finalSourceLang = await this.detectLanguage(text);
      
      // Check if detected language is same as target
      if (finalSourceLang === targetLang) {
        return text;
      }
    }

    try {
      const translatedText = await this.makeTranslationRequest(text, finalSourceLang, targetLang);
      
      // Cache the result
      this.cacheTranslation(text, finalSourceLang, targetLang, translatedText);
      
      return translatedText;
      
    } catch (error) {
      console.error('Translation failed for all endpoints:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  // Translate multiple texts with rate limiting
  async translateBatch(texts, targetLanguage = 'en', sourceLanguage = 'auto') {
    if (!Array.isArray(texts) || texts.length === 0) {
      return texts;
    }

    const sourceLang = sourceLanguage === 'auto' ? 'auto' : this.getLanguageCode(sourceLanguage);
    const targetLang = this.getLanguageCode(targetLanguage);

    const results = new Array(texts.length);
    const toTranslate = [];
    const indices = [];

    // Check cache and prepare texts to translate
    texts.forEach((text, index) => {
      if (!text || typeof text !== 'string' || text.trim() === '') {
        results[index] = text;
        return;
      }

      if (sourceLang === targetLang && sourceLang !== 'auto') {
        results[index] = text;
        return;
      }

      const cached = this.getCachedTranslation(text, sourceLang, targetLang);
      if (cached) {
        results[index] = cached;
      } else {
        toTranslate.push(text);
        indices.push(index);
      }
    });

    if (toTranslate.length === 0) {
      return results;
    }

    try {
      // Process translations with rate limiting
      for (let i = 0; i < toTranslate.length; i++) {
        const text = toTranslate[i];
        const originalIndex = indices[i];

        // Auto-detect language for each text if needed
        let finalSourceLang = sourceLang;
        if (sourceLang === 'auto') {
          finalSourceLang = await this.detectLanguage(text);
          
          if (finalSourceLang === targetLang) {
            results[originalIndex] = text;
            continue;
          }
        }

        const translatedText = await this.makeTranslationRequest(text, finalSourceLang, targetLang);
        results[originalIndex] = translatedText;

        // Cache the result
        this.cacheTranslation(text, finalSourceLang, targetLang, translatedText);

        // Rate limiting delay (except for last request)
        if (i < toTranslate.length - 1) {
          await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
        }
      }

      return results;
      
    } catch (error) {
      console.error('Batch translation error:', error);
      throw error;
    }
  }

  // Get supported languages from current API
  async getSupportedLanguages() {
    const apiUrl = this.getCurrentApiUrl();
    
    try {
      const response = await fetch(`${apiUrl}/languages`);
      
      if (response.ok) {
        const languages = await response.json();
        return languages;
      }
    } catch (error) {
      console.error('Failed to get supported languages:', error);
    }
    
    // Return default languages if API call fails
    return Object.keys(this.getLanguageCode(''));
  }

  // Configuration methods
  setRateLimitDelay(delay) {
    this.rateLimitDelay = Math.max(0, delay);
  }

  setCacheTTL(ttl) {
    this.cacheTTL = Math.max(0, ttl);
  }

  setMaxRetries(retries) {
    this.maxRetries = Math.max(1, retries);
  }

  addApiEndpoint(url) {
    if (!this.apiUrls.includes(url)) {
      this.apiUrls.push(url);
    }
  }

  removeApiEndpoint(url) {
    const index = this.apiUrls.indexOf(url);
    if (index > -1 && this.apiUrls.length > 1) {
      this.apiUrls.splice(index, 1);
      if (this.currentApiIndex >= this.apiUrls.length) {
        this.currentApiIndex = 0;
      }
    }
  }

  // Cache management
  clearCache() {
    this.cache.clear();
  }

  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if ((now - value.timestamp) >= this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }

  getCacheSize() {
    return this.cache.size;
  }

  getCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, value] of this.cache.entries()) {
      if ((now - value.timestamp) < this.cacheTTL) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
      hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses) || 0
    };
  }

  // Health check
  async healthCheck() {
    const results = [];
    
    for (const apiUrl of this.apiUrls) {
      try {
        const response = await fetch(`${apiUrl}/languages`, {
          method: 'GET',
          timeout: 5000
        });
        
        results.push({
          url: apiUrl,
          status: response.ok ? 'healthy' : 'unhealthy',
          responseTime: response.headers.get('x-response-time') || 'unknown'
        });
      } catch (error) {
        results.push({
          url: apiUrl,
          status: 'error',
          error: error.message
        });
      }
    }
    
    return results;
  }

  // Usage statistics
  resetStats() {
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.apiCalls = 0;
    this.errors = 0;
  }

  getStats() {
    return {
      cacheHits: this.cacheHits || 0,
      cacheMisses: this.cacheMisses || 0,
      apiCalls: this.apiCalls || 0,
      errors: this.errors || 0,
      currentApi: this.getCurrentApiUrl(),
      cacheSize: this.getCacheSize()
    };
  }
}

export default TranslateService;