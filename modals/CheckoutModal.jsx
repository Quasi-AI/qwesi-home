'use client'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '@/lib/features/cart/cartSlice'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'
import GoogleMapPicker from '@/components/GoogleMapPicker'

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function CheckoutModal({ isOpen, onClose, cartItems, totalPrice, currency, products }) {
    const dispatch = useDispatch()
    const { user } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        notes: '',
        latitude: null,
        longitude: null
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleLocationSelect = (locationData) => {

        setFormData(prev => ({
            ...prev,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            address: locationData.address || prev.address
        }))
        toast.success('Location selected successfully!')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            toast.error('Please fill in all required fields')
            return
        }

        if (!formData.latitude || !formData.longitude) {
            toast.error('Please select your location on the map')
            return
        }

        setLoading(true)

        try {
            // Group items by storeId
            const storeGroups = {}
            Object.entries(cartItems).forEach(([productId, quantity]) => {
                // Find product to get storeId
                const product = products.find(p => p.id === productId)
                const storeId = product?.storeId || 'default-store'
                if (!storeGroups[storeId]) {
                    storeGroups[storeId] = []
                }
                storeGroups[storeId].push({ productId, quantity })
            })

            // Create orders for each store
            const orderPromises = Object.entries(storeGroups).map(async ([storeId, items]) => {
                const orderData = {
                    storeId,
                    userId: user?.id,
                    items: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity
                    })),
                    currency,
                    contact: {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode,
                        country: formData.country
                    },
                    metadata: {
                        notes: formData.notes,
                        deliveryLocation: {
                            latitude: formData.latitude,
                            longitude: formData.longitude
                        }
                    }
                }

                const response = await fetch(`${API_BASE_URL}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                })

                if (!response.ok) {
                    const errorData = await response.text()
                    throw new Error(`Failed to create order: ${errorData}`)
                }

                return response.json()
            })

            const results = await Promise.all(orderPromises)

            // Clear cart on success
            dispatch(clearCart())

            toast.success('Order placed successfully!')
            onClose()

            // Redirect to orders page
            window.location.href = '/orders'

        } catch (error) {
            console.error('Checkout error:', error)
            toast.error(`Failed to place order: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                        <div className="bg-gray-50 p-4 rounded">
                            <div className="flex justify-between items-center">
                                <span>Total Items: {Object.keys(cartItems).length}</span>
                                <span className="font-bold text-lg">{currency}{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address *
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Street address"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    State/Province
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ZIP/Postal Code
                                </label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                />
                            </div>
                        </div>

                        {/* Location Map Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Your Exact Location *
                            </label>

                            <GoogleMapPicker
                                onLocationSelect={handleLocationSelect}
                                selectedLocation={{
                                    latitude: formData.latitude,
                                    longitude: formData.longitude,
                                    address: formData.address
                                }}
                            />

                            <p className="text-xs text-gray-500 mt-2">
                                Click on the map to set your exact delivery location. This helps us deliver your order accurately.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Order Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5c3aec]"
                                placeholder="Any special instructions..."
                            />
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-[#5c3aec] text-white rounded-md hover:bg-[#3525b8] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : `Place Order - ${currency}${totalPrice.toFixed(2)}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
