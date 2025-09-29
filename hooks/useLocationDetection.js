// hooks/useLocationDetection.js
import { useState, useEffect } from 'react'

export const useLocationDetection = (options = {}) => {
  const { includePosition = false } = options
  const [location, setLocation] = useState({
    country: null,
    lat: null,
    lng: null,
    loading: false,
    error: null
  })

  useEffect(() => {
    const detectLocation = async () => {
      // Check if we already have cached location
      const cachedLocation = localStorage.getItem('user_location')
      if (cachedLocation) {
        try {
          const parsed = JSON.parse(cachedLocation)
          const cacheTime = new Date(parsed.timestamp)
          const now = new Date()
          // Cache for 24 hours
          if (now - cacheTime < 24 * 60 * 60 * 1000) {
            setLocation({
              country: parsed.country,
              lat: parsed.lat || null,
              lng: parsed.lng || null,
              loading: false,
              error: null
            })
            return
          }
        } catch (e) {
          // Invalid cache, continue with detection
        }
      }

      setLocation(prev => ({ ...prev, loading: true }))

      // Try multiple methods in order of preference
      
      // Method 1: Browser Geolocation API + Reverse Geocoding
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 300000 // 5 minutes
            })
          })

          // Use a free reverse geocoding service
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            )
            const data = await response.json()
            const countryCode = data.countryCode
            const countryName = data.countryName || 'Unknown'
            
            // Map code to name if needed (standardize to name)
            const country = countryName !== 'Unknown' ? countryName : countryCode || 'Unknown'
            
            // Cache the result
            localStorage.setItem('user_location', JSON.stringify({
              country,
              lat: includePosition ? lat : undefined,
              lng: includePosition ? lng : undefined,
              timestamp: new Date().toISOString()
            }))
            
            setLocation({
              country,
              lat: includePosition ? lat : null,
              lng: includePosition ? lng : null,
              loading: false,
              error: null
            })
            return
          } catch (geocodeError) {
            console.warn('Reverse geocoding failed:', geocodeError)
            // Fallback to coordinates for country 'Unknown'
            const country = 'Unknown'
            localStorage.setItem('user_location', JSON.stringify({
              country,
              lat: includePosition ? lat : undefined,
              lng: includePosition ? lng : undefined,
              timestamp: new Date().toISOString()
            }))
            setLocation({
              country,
              lat: includePosition ? lat : null,
              lng: includePosition ? lng : null,
              loading: false,
              error: null
            })
            return
          }
        } catch (geoError) {
          console.warn('Geolocation failed:', geoError)
        }
      }

      // Method 2: CloudFlare trace (works without CORS)
      try {
        const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace')
        const data = await response.text()
        const countryCode = data.match(/loc=(.+)/)?.[1]
        
        if (countryCode && countryCode !== 'XX') {
          // Country code mapping to name for consistency
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
          const country = countryCodeMapping[countryCode] || countryCode
          
          // Cache the result
          localStorage.setItem('user_location', JSON.stringify({
            country,
            timestamp: new Date().toISOString()
          }))
          
          setLocation({
            country,
            loading: false,
            error: null
          })
          return
        }
      } catch (error) {
        console.warn('CloudFlare trace failed:', error)
      }

      // Method 3: Fallback to default (Ghana)
      const defaultCountry = 'Ghana'
      setLocation({
        country: defaultCountry,
        loading: false,
        error: 'Could not detect location, using default'
      })
      
      // Cache the fallback
      localStorage.setItem('user_location', JSON.stringify({
        country: defaultCountry,
        timestamp: new Date().toISOString()
      }))
    }

    detectLocation()
  }, [])

  return location
}

  // Export hook only - remove example components
