
'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'

// Mock API key for demo - replace with your actual key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY 

// Simple wrapper component to simulate @googlemaps/react-wrapper
const Wrapper = ({ apiKey, render, children }) => {
  const [status, setStatus] = useState('LOADING')

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setStatus('SUCCESS')
      return
    }

    // Global flag to prevent multiple loads
    if (window.googleMapsLoading) {
      // Script is already being loaded, wait for it
      const checkLoaded = () => {
        if (window.google && window.google.maps) {
          setStatus('SUCCESS')
          delete window.googleMapsLoading
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
      return
    }

    // Set global loading flag
    window.googleMapsLoading = true

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`)
    if (existingScript) {
      // Script exists but not loaded yet, wait
      const checkLoaded = () => {
        if (window.google && window.google.maps) {
          setStatus('SUCCESS')
          delete window.googleMapsLoading
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
      return
    }

    // Create script element
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true

    script.onload = () => {
      setStatus('SUCCESS')
      delete window.googleMapsLoading
    }

    script.onerror = () => {
      setStatus('FAILURE')
      delete window.googleMapsLoading
    }

    document.head.appendChild(script)

    // No cleanup for the script - keep it loaded globally
    return () => {
      // Clear loading flag if needed, but don't remove script
      if (window.googleMapsLoading) {
        delete window.googleMapsLoading
      }
    }
  }, [apiKey])

  return render(status)
}

const Map = ({ center, zoom, onLoad, onClick }) => {
  const ref = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (ref.current && !mapRef.current && window.google && window.google.maps) {
      const map = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })
      mapRef.current = map

      if (onLoad) {
        onLoad(map)
      }

      if (onClick) {
        map.addListener('click', onClick)
      }
    }
  }, [center, zoom, onLoad, onClick])

  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.setCenter(center)
      mapRef.current.setZoom(zoom)
    }
  }, [center, zoom])

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(mapRef.current)
        mapRef.current = null
      }
    }
  }, [])

  return <div ref={ref} style={{ height: '400px', width: '100%' }} />
}

export default function GoogleMapPicker({ onLocationSelect, selectedLocation }) {
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const markerRef = useRef(null)

  const center = selectedLocation && selectedLocation.latitude && selectedLocation.longitude
    ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
    : { lat: 5.6037, lng: -0.1870 } // Default to Accra, Ghana

  // Auto-detect location on component mount if no selected location
  useEffect(() => {
    if (!selectedLocation?.latitude && navigator.geolocation) {
      setLoadingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          })
          setLoadingLocation(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          setLoadingLocation(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    }
  }, [onLocationSelect, selectedLocation])

  const reverseGeocode = useCallback((latLng, callback) => {
    if (window.google && window.google.maps && window.google.maps.Geocoder) {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: latLng }, (results, status) => {
        let address = `${latLng.lat().toFixed(6)}, ${latLng.lng().toFixed(6)}`
        if (status === 'OK' && results[0]) {
          address = results[0].formatted_address
        }
        callback(address)
      })
    } else {
      // Fallback if geocoder not available
      callback(`${latLng.lat().toFixed(6)}, ${latLng.lng().toFixed(6)}`)
    }
  }, [])

  const handleMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance)

    // Set initial marker if location selected
    if (selectedLocation && selectedLocation.latitude && selectedLocation.longitude) {
      const position = { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
      const initialMarker = new window.google.maps.Marker({
        position,
        map: mapInstance,
        title: 'Delivery Location',
        draggable: true
      })
      setMarker(initialMarker)
      markerRef.current = initialMarker
      mapInstance.setCenter(position)

      // Add drag listener
      initialMarker.addListener('dragend', (event) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()

        reverseGeocode(event.latLng, (address) => {
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: address
          })
        })
      })
    }
  }, [selectedLocation, onLocationSelect, reverseGeocode])

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()

    // Update or create marker
    if (markerRef.current) {
      markerRef.current.setPosition(event.latLng)
    } else if (map) {
      const newMarker = new window.google.maps.Marker({
        position: event.latLng,
        map,
        title: 'Delivery Location',
        draggable: true
      })
      markerRef.current = newMarker
      setMarker(newMarker)

      // Add drag listener for new marker
      newMarker.addListener('dragend', (dragEvent) => {
        const dragLat = dragEvent.latLng.lat()
        const dragLng = dragEvent.latLng.lng()

        reverseGeocode(dragEvent.latLng, (address) => {
          onLocationSelect({
            latitude: dragLat,
            longitude: dragLng,
            address: address
          })
        })
      })
    }

    // Reverse geocode to get address
    reverseGeocode(event.latLng, (address) => {
      onLocationSelect({
        latitude: lat,
        longitude: lng,
        address: address
      })

      // Center map on clicked location
      if (map) {
        map.setCenter(event.latLng)
        map.setZoom(17)
      }
    })
  }, [map, onLocationSelect, reverseGeocode])

  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    setLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const latLng = { lat, lng }

        // Update marker position
        if (markerRef.current && map) {
          markerRef.current.setPosition(latLng)
        } else if (map) {
          const newMarker = new window.google.maps.Marker({
            position: latLng,
            map,
            title: 'Delivery Location',
            draggable: true
          })
          markerRef.current = newMarker
          setMarker(newMarker)

          newMarker.addListener('dragend', (dragEvent) => {
            const dragLat = dragEvent.latLng.lat()
            const dragLng = dragEvent.latLng.lng()

            reverseGeocode(dragEvent.latLng, (address) => {
              onLocationSelect({
                latitude: dragLat,
                longitude: dragLng,
                address: address
              })
            })
          })
        }

        // Update location and center map
        if (map) {
          map.setCenter(latLng)
          map.setZoom(17)
        }

        // Reverse geocode current location
        if (window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: latLng }, (results, status) => {
            let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            if (status === 'OK' && results[0]) {
              address = results[0].formatted_address
            }
            onLocationSelect({
              latitude: lat,
              longitude: lng,
              address: address
            })
            setLoadingLocation(false)
          })
        } else {
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          })
          setLoadingLocation(false)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Unable to get your location. Please try again or select manually.')
        setLoadingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [map, onLocationSelect, reverseGeocode])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
        markerRef.current = null
      }
      setMap(null)
      setMarker(null)
    }
  }, [])

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
      <Wrapper 
        apiKey={GOOGLE_MAPS_API_KEY} 
        render={(status) => {
          switch (status) {
            case 'LOADING':
              return (
                <div className="flex items-center justify-center h-96 bg-gray-100 text-gray-500">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading map...
                  </div>
                </div>
              )
            case 'FAILURE':
              return (
                <div className="flex items-center justify-center h-96 bg-gray-100 text-red-500">
                  <div className="text-center">
                    <p className="mb-2">Failed to load map.</p>
                    <p className="text-sm">Please check your internet connection.</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-2 px-4 py-2 bg-[#5c3aec] text-white rounded hover:bg-[#3525b8]"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )
            case 'SUCCESS':
              return (
                <Map
                  center={center}
                  zoom={15}
                  onLoad={handleMapLoad}
                  onClick={handleMapClick}
                />
              )
            default:
              return <div className="h-96 bg-gray-100"></div>
          }
        }} 
      />
      
      <div className="p-3 bg-gray-50">
        <div className="flex justify-center space-x-2 mb-2">
          <button
            onClick={handleGetCurrentLocation}
            disabled={loadingLocation}
            className="px-3 py-1 bg-[#5c3aec] text-white text-xs rounded hover:bg-[#3525b8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {loadingLocation ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Locating...
              </>
            ) : (
              '📍 Use My Location'
            )}
          </button>
          <button
            onClick={() => map && map.setZoom(15)}
            className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 flex items-center gap-1"
            disabled={!map}
          >
            Reset View
          </button>
        </div>
        <p className="text-sm text-gray-600 text-center">
          Click on the map to select your exact delivery location. Drag the marker to adjust position.
        </p>
      </div>
    </div>
  )
}

// Demo usage component
function DemoCheckout() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Location Picker Demo</h2>
      <GoogleMapPicker
        onLocationSelect={setSelectedLocation}
        selectedLocation={selectedLocation}
      />
      {selectedLocation && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Selected Location:</h3>
          <p><strong>Latitude:</strong> {selectedLocation.latitude}</p>
          <p><strong>Longitude:</strong> {selectedLocation.longitude}</p>
          <p><strong>Address:</strong> {selectedLocation.address}</p>
        </div>
      )}
    </div>
  )
}

export { DemoCheckout }