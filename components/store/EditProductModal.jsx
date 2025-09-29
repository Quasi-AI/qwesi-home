'use client'
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { toast } from "react-hot-toast"
import { X, Upload } from "lucide-react"
import { authFetch } from '@/lib/auth'
import { useAuthStore } from '@/stores/authStore'
import { uploadMultipleImages } from '@/lib/storage'

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function EditProductModal({ isOpen, onClose, productId, onProductUpdated, selectedStoreId = null }) {
    const router = useRouter()
    const { user } = useAuthStore()
    const [stores, setStores] = useState([])
    const [selectedStore, setSelectedStore] = useState(selectedStoreId || '')
    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        price: 0,
        sku: "",
        stock: 0,
        currency: "USD",
        country: "Ghana",
        attributes: {}
    })
    const [loading, setLoading] = useState(false)
    const [fetchingProduct, setFetchingProduct] = useState(false)

    const fetchStores = async () => {
        try {
            const response = await authFetch(`${API_BASE_URL}/stores/user/${user?.id}`)
            if (response.ok) {
                const data = await response.json()
                const userStores = data.data || data
                setStores(userStores)
                if (userStores.length > 0 && !selectedStore) {
                    setSelectedStore(userStores[0]._id)
                }
            } else {
                throw new Error('Failed to fetch stores')
            }
        } catch (error) {
            console.error('Error fetching stores:', error)
            toast.error('Failed to fetch stores')
            router.push('/')
        }
    }

    const fetchProduct = async () => {
        if (!productId || !user?.id) return

        try {
            setFetchingProduct(true)

            // Find the product across all user's stores
            let foundProduct = null
            let productStoreId = null

            for (const store of stores) {
                try {
                    const productsResponse = await authFetch(`${API_BASE_URL}/stores/${store._id}/products`)
                    const productsResult = await productsResponse.json()
                    const products = productsResult.data || productsResult

                    const prod = products.find(p => p._id === productId)
                    if (prod) {
                        foundProduct = prod
                        productStoreId = store._id
                        break
                    }
                } catch (error) {
                    // Continue to next store
                }
            }

            if (!foundProduct) {
                toast.error('Product not found')
                onClose()
                return
            }

            setSelectedStore(productStoreId)

            // Set form data
            setProductInfo({
                name: foundProduct.name || "",
                description: foundProduct.description || "",
                price: foundProduct.price || 0,
                sku: foundProduct.sku || "",
                stock: foundProduct.stock || 0,
                currency: foundProduct.currency || "USD",
                country: foundProduct.country || "Ghana",
                attributes: foundProduct.attributes || {}
            })

            // Set existing images
            if (foundProduct.images && foundProduct.images.length > 0) {
                const imageUrls = {}
                foundProduct.images.forEach((url, index) => {
                    if (index < 4) {
                        imageUrls[index + 1] = url
                    }
                })
                setImages(imageUrls)
            }

        } catch (error) {
            console.error('Error fetching product:', error)
            toast.error('Failed to load product')
            onClose()
        } finally {
            setFetchingProduct(false)
        }
    }

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const uploadImages = async () => {
        const existingUrls = []
        const newFiles = []

        Object.values(images).forEach(img => {
            if (typeof img === 'string') {
                existingUrls.push(img)
            } else if (img) {
                newFiles.push(img)
            }
        })

        let newUrls = []
        if (newFiles.length > 0) {
            try {
                newUrls = await uploadMultipleImages(newFiles)
            } catch (error) {
                console.error('Error uploading images:', error)
                toast.error('Failed to upload images')
                throw error
            }
        }

        return [...existingUrls, ...newUrls]
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (!productId) return

        setLoading(true)

        try {
            // Upload images first (in a real app, you'd upload to cloud storage)
            const imageUrls = await uploadImages()

            const updatedProductData = {
                ...productInfo,
                price: parseFloat(productInfo.price),
                stock: parseInt(productInfo.stock),
                images: imageUrls,
            }

            const response = await authFetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProductData),
            })

            if (response.ok) {
                const updatedProduct = await response.json()

                toast.success('Product updated successfully!')
                onProductUpdated && onProductUpdated(updatedProduct)
                onClose()
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to update product')
            }
        } catch (error) {
            console.error('Error updating product:', error)
            toast.error(error.message || 'Failed to update product')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchStores()
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen && stores.length > 0 && productId) {
            fetchProduct()
        }
    }, [isOpen, stores, productId])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800">Edit Product</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {fetchingProduct ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-slate-600">Loading product...</p>
                    </div>
                ) : (
                    <form onSubmit={onSubmitHandler} className="p-6 space-y-6">
                        {/* Store Selection */}
                        {stores.length > 1 && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Store *
                                </label>
                                <select
                                    value={selectedStore}
                                    onChange={(e) => setSelectedStore(e.target.value)}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    required
                                >
                                    <option value="">Select a store</option>
                                    {stores.map((store) => (
                                        <option key={store._id} value={store._id}>
                                            {store.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Product Images */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                Product Images
                            </label>
                            <div className="flex gap-3">
                                {Object.keys(images).map((key) => (
                                    <label key={key} htmlFor={`edit-images${key}`} className="cursor-pointer">
                                        <div className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center hover:border-blue-400 transition-colors bg-slate-50">
                                            {images[key] ? (
                                                <img
                                                    src={typeof images[key] === 'string' ? images[key] : URL.createObjectURL(images[key])}
                                                    alt=""
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <Upload size={20} className="text-slate-400" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept='image/*'
                                            id={`edit-images${key}`}
                                            onChange={e => setImages({ ...images, [key]: e.target.files[0] })}
                                            hidden
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                onChange={onChangeHandler}
                                value={productInfo.name}
                                placeholder="Enter product name"
                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                onChange={onChangeHandler}
                                value={productInfo.description}
                                placeholder="Enter product description"
                                rows={4}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                required
                            />
                        </div>

                        {/* SKU */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                SKU (Optional)
                            </label>
                            <input
                                type="text"
                                name="sku"
                                onChange={onChangeHandler}
                                value={productInfo.sku}
                                placeholder="Enter product SKU"
                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        {/* Price and Stock */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Price ($) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    onChange={onChangeHandler}
                                    value={productInfo.price}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    onChange={onChangeHandler}
                                    value={productInfo.stock}
                                    placeholder="0"
                                    min="0"
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Currency */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Currency
                            </label>
                            <select
                                name="currency"
                                onChange={onChangeHandler}
                                value={productInfo.currency}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="CAD">CAD (C$)</option>
                            </select>
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Country *
                            </label>
                        <select
                            name="country"
                            onChange={onChangeHandler}
                            value={productInfo.country}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        >
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Germany">Germany</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Kenya">Kenya</option>
                            <option value="South Africa">South Africa</option>
                            <option value="Egypt">Egypt</option>
                            <option value="Morocco">Morocco</option>
                        </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-slate-100 text-slate-700 py-3 px-4 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Updating Product...' : 'Update Product'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
