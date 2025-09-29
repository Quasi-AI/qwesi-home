'use client'
import { useState, useEffect, useRef } from 'react'
import { X, Package, User, MapPin, Phone, Mail, Calendar, DollarSign, CheckCircle, Clock, XCircle, Truck } from 'lucide-react'
import { authFetch } from '@/lib/auth'

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyA7_dAYr-UmBgppmaEf9Jt5xaUQehskT78'

// Simple Map Display Component
const MapDisplay = ({ latitude, longitude }) => {
    const mapRef = useRef(null)
    const markerRef = useRef(null)

    useEffect(() => {
        if (!latitude || !longitude || !window.google || !window.google.maps) return

        const center = { lat: latitude, lng: longitude }

        if (!mapRef.current) {
            const map = new window.google.maps.Map(document.getElementById('order-map'), {
                center,
                zoom: 15,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: true,
            })
            mapRef.current = map

            const marker = new window.google.maps.Marker({
                position: center,
                map,
                title: 'Delivery Location',
            })
            markerRef.current = marker
        } else {
            mapRef.current.setCenter(center)
            if (markerRef.current) {
                markerRef.current.setPosition(center)
            }
        }
    }, [latitude, longitude])

    // Load Google Maps script
    useEffect(() => {
        if (window.google && window.google.maps) return

        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
        script.async = true
        script.defer = true
        document.head.appendChild(script)

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script)
            }
        }
    }, [])

    return (
        <div id="order-map" style={{ height: '300px', width: '100%' }} className="rounded-lg border border-gray-200"></div>
    )
}

export default function OrderViewModal({ isOpen, onClose, order }) {
    const [orderDetails, setOrderDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    useEffect(() => {
        if (order && isOpen) {
            fetchOrderDetails()
        }
    }, [order, isOpen])

    const fetchOrderDetails = async () => {
        if (!order) return

        setLoading(true)
        try {
            // If order already has full details, use them
            if (order.items && order.contact) {
                setOrderDetails(order)
                return
            }

            // Otherwise fetch full order details
            const response = await authFetch(`${API_BASE_URL}/orders/${order._id}`)
            if (response.ok) {
                const data = await response.json()
                setOrderDetails(data)
            } else {
                console.error('Failed to fetch order details')
                setOrderDetails(order) // Use basic order data as fallback
            }
        } catch (error) {
            console.error('Error fetching order details:', error)
            setOrderDetails(order) // Use basic order data as fallback
        } finally {
            setLoading(false)
        }
    }

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-600" />
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-600" />
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-600" />
            case 'shipped':
            case 'delivered':
                return <Truck className="w-5 h-5 text-blue-600" />
            default:
                return <Clock className="w-5 h-5 text-gray-600" />
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            case 'shipped':
            case 'delivered':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (!isOpen || !order) return null

    const displayOrder = orderDetails || order

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Order Details
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Order #{displayOrder._id?.slice(-8) || 'N/A'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">Loading order details...</span>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Order Status and Basic Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(displayOrder.status)}
                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(displayOrder.status)}`}>
                                                {displayOrder.status || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Order Date</p>
                                            <p className="font-medium">
                                                {displayOrder.createdAt ? new Date(displayOrder.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <DollarSign className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Total Amount</p>
                                            <p className="font-medium text-lg">
                                                {currency}{displayOrder.total?.toFixed(2) || '0.00'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            {displayOrder.contact && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Customer Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Name</p>
                                            <p className="font-medium">{displayOrder.contact.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </p>
                                            <p className="font-medium">{displayOrder.contact.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <Phone className="w-4 h-4" />
                                                Phone
                                            </p>
                                            <p className="font-medium">{displayOrder.contact.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                Address
                                            </p>
                                            <div className="font-medium">
                                                <p>{displayOrder.contact.address || 'N/A'}</p>
                                                {displayOrder.contact.city && (
                                                    <p>{displayOrder.contact.city}, {displayOrder.contact.state} {displayOrder.contact.zipCode}</p>
                                                )}
                                                {displayOrder.contact.country && (
                                                    <p>{displayOrder.contact.country}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Order Items */}
                            {displayOrder.items && displayOrder.items.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        Order Items ({displayOrder.items.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {displayOrder.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Product ID: {item.productId}</p>
                                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {/* You might want to show individual item prices here if available */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Delivery Location */}
                            {displayOrder.metadata?.deliveryLocation && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Delivery Location
                                    </h3>
                                    <div className="space-y-3">
                                        <MapDisplay
                                            latitude={displayOrder.metadata.deliveryLocation.latitude}
                                            longitude={displayOrder.metadata.deliveryLocation.longitude}
                                        />
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-600">Coordinates</p>
                                            <p className="font-mono text-sm">
                                                {displayOrder.metadata.deliveryLocation.latitude?.toFixed(6)},
                                                {displayOrder.metadata.deliveryLocation.longitude?.toFixed(6)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Order Notes */}
                            {displayOrder.metadata?.notes && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h3>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-gray-700">{displayOrder.metadata.notes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Store Information */}
                            {displayOrder.storeName && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
                                    <p className="text-gray-700">{displayOrder.storeName}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
