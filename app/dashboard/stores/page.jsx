'use client'
import DashboardCardSkeleton from "@/components/dashboard/DashboardCardSkeleton"
import ProductSkeleton from "@/components/ProductSkeleton"
import AddProductModal from "@/components/store/AddProductModal"
import EditProductModal from "@/components/store/EditProductModal"
import CouponModal from "@/components/store/CouponModal"
import Link from 'next/link'
import StoreDetailModal from "@/components/store/StoreDetailModal"
import OrderViewModal from "@/modals/OrderViewModal"
import { useEffect, useState, useRef } from "react"
import toast from "react-hot-toast"
import {
    Plus,
    Search,
    Edit3,
    Eye,
    Trash2,
    Package,
    ShoppingCart,
    TrendingUp,
    MapPin,
    Calendar,
    Store,
    X,
    ImageIcon,
    Upload,
    Globe,
    Phone,
    Mail,
    Clock,
    Users,
    Tag,
    EditIcon,
    TrashIcon,
    PlusIcon,
    Percent,
    DollarSign,
    CheckCircle,
    XCircle,
    TagsIcon,
    CircleDollarSignIcon,
    StarIcon
} from "lucide-react"
import Image from "next/image"
import { useAuthStore } from '@/stores/authStore'
import { authFetch } from '@/lib/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from "date-fns"

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function UserStores() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const { user, initAuth } = useAuthStore()
    const searchParams = useSearchParams()
    const tab = searchParams.get('tab') || 'stores'

    const [activeTab, setActiveTab] = useState(tab)
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedStore, setSelectedStore] = useState(null)
    const [products, setProducts] = useState([])
    const [coupons, setCoupons] = useState([])
    const [orders, setOrders] = useState([])
    const [selectedStoreFilter, setSelectedStoreFilter] = useState('all')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditProductModal, setShowEditProductModal] = useState(false)
    const [editingProductId, setEditingProductId] = useState(null)
    const [showCreateCouponModal, setShowCreateCouponModal] = useState(false)
    const [showEditCouponModal, setShowEditCouponModal] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState(null)
    const [selectedCouponStoreFilter, setSelectedCouponStoreFilter] = useState('all')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedStoreDetail, setSelectedStoreDetail] = useState(null)
    const getUserIdentifier = () => {
        if (user?.id) return { param: 'id', value: user.id }
        if (user?.uid) return { param: 'id', value: user.uid }
        if (user?.phone) return { param: 'phone', value: user.phone }
        if (user?.email) return { param: 'email', value: user.email }
        return null
    }
    const userIdentifier = getUserIdentifier()
    const userId = user?.id || user?._id || user?.userId || user?.uid || ''

    const fetchUserStores = async () => {
        // Check if user is authenticated
        if (!userIdentifier) {
            setStores([])
            setLoading(false)
            return
        }

        const { param, value } = userIdentifier;

        try {
            const response = await authFetch(`${API_BASE_URL}/stores/user/${value}`)
            if (response.ok) {
                const data = await response.json()

                // Ensure data is an array before mapping
                const storesData = data.data || data;
                if (!Array.isArray(storesData)) {
                    console.warn('API returned non-array data:', data)
                    setStores([])
                    return
                }

                // Fetch product count for each store
                const storesWithStats = await Promise.all(
                    storesData.map(async (store) => {
                        try {
                            const productsResponse = await authFetch(`${API_BASE_URL}/stores/${store._id}/products`)
                            const productsData = productsResponse.ok ? await productsResponse.json() : []
                            const products = Array.isArray(productsData) ? productsData : productsData.data || []

                            const ordersResponse = await authFetch(`${API_BASE_URL}/orders?storeId=${store._id}`)
                            const ordersData = ordersResponse.ok ? await ordersResponse.json() : []
                            const orders = Array.isArray(ordersData) ? ordersData : ordersData.data || []

                            return {
                                ...store,
                                productCount: products.length,
                                orderCount: orders.length,
                                totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0)
                            }
                        } catch (error) {
                            console.error('Error fetching stats for store:', store._id, error)
                            return {
                                ...store,
                                productCount: 0,
                                orderCount: 0,
                                totalRevenue: 0
                            }
                        }
                    })
                )
                setStores(storesWithStats)
            } else {
                const errorText = await response.text()
                console.error('API error response:', response.status, errorText)
                throw new Error(`Failed to fetch stores: ${response.status}`)
            }
        } catch (error) {
            console.error('Error fetching stores:', error)
            toast.error('Failed to fetch your stores')
            setStores([]) // Set empty array on error
        } finally {
            setLoading(false)
        }
    }

    const createStore = async (storeData) => {
        try {
            const response = await authFetch(`${API_BASE_URL}/stores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...storeData,
                    ownerId: userId
                }),
            })

            if (response.ok) {
                const newStore = await response.json()
                setStores([...stores, { ...newStore, productCount: 0, orderCount: 0, totalRevenue: 0 }])
                setShowCreateModal(false)
                toast.success('Store created successfully!')
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to create store')
            }
        } catch (error) {
            console.error('Error creating store:', error)
            toast.error(error.message || 'Failed to create store')
        }
    }

    const updateStore = async (storeId, storeData) => {
        try {
            const response = await authFetch(`${API_BASE_URL}/stores/${storeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(storeData),
            })

            if (response.ok) {
                const updatedStore = await response.json()
                setStores(stores.map(store =>
                    store._id === storeId ? { ...updatedStore, ...store } : store
                ))
                setShowEditModal(false)
                toast.success('Store updated successfully!')
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to update store')
            }
        } catch (error) {
            console.error('Error updating store:', error)
            toast.error(error.message || 'Failed to update store')
        }
    }

    const deleteStore = async (storeId) => {
        if (!confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
            return
        }

        try {
            const response = await authFetch(`${API_BASE_URL}/stores/${storeId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setStores(stores.filter(store => store._id !== storeId))
                toast.success('Store deleted successfully!')
            } else {
                throw new Error('Failed to delete store')
            }
        } catch (error) {
            console.error('Error deleting store:', error)
            toast.error('Failed to delete store')
        }
    }

    const toggleStoreStatus = async (storeId) => {
        const store = stores.find(s => s._id === storeId)
        if (!store) return

        try {
            const response = await authFetch(`${API_BASE_URL}/stores/${storeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isActive: !store.isActive
                }),
            })

            if (response.ok) {
                const updatedStore = await response.json()
                setStores(stores.map(s =>
                    s._id === storeId ? { ...s, isActive: updatedStore.isActive } : s
                ))
                toast.success(`Store ${updatedStore.isActive ? 'activated' : 'deactivated'} successfully!`)
            } else {
                throw new Error('Failed to update store status')
            }
        } catch (error) {
            console.error('Error updating store status:', error)
            toast.error('Failed to update store status')
        }
    }

    const addProduct = async (productData) => {
        try {
            const response = await authFetch(`${API_BASE_URL}/stores/${productData.storeId}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            })

            if (response.ok) {
                const newProduct = await response.json()
                const store = stores.find(s => s._id === productData.storeId)
                const productWithStoreInfo = { ...newProduct, storeName: store?.name, storeId: productData.storeId }
                setProducts([...products, productWithStoreInfo])
                setShowAddModal(false)
                toast.success('Product added successfully!')
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to add product')
            }
        } catch (error) {
            console.error('Error adding product:', error)
            toast.error(error.message || 'Failed to add product')
        }
    }

    const updateProduct = async (productId, productData) => {
        try {
            const response = await authFetch(`${API_BASE_URL}/stores/${productData.storeId}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            })

            if (response.ok) {
                const updatedProduct = await response.json()
                const store = stores.find(s => s._id === productData.storeId)
                const productWithStoreInfo = { ...updatedProduct, storeName: store?.name, storeId: productData.storeId }
                setProducts(products.map(p =>
                    p._id === productId ? productWithStoreInfo : p
                ))
                setShowEditProductModal(false)
                setEditingProductId(null)
                toast.success('Product updated successfully!')
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to update product')
            }
        } catch (error) {
            console.error('Error updating product:', error)
            toast.error(error.message || 'Failed to update product')
        }
    }

    const deleteProduct = async (productId) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Delete Product</p>
                <p className="text-sm text-slate-600">Are you sure you want to delete this product? This action cannot be undone.</p>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id)
                            try {
                                const product = products.find(p => p._id === productId)
                                if (!product) return

                                const response = await authFetch(`${API_BASE_URL}/products/${productId}`, {
                                    method: 'DELETE',
                                })

                                if (response.ok) {
                                    setProducts(products.filter(p => p._id !== productId))
                                    toast.success('Product deleted successfully!')
                                } else {
                                    throw new Error('Failed to delete product')
                                }
                            } catch (error) {
                                console.error('Error deleting product:', error)
                                toast.error('Failed to delete product')
                            }
                        }}
                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
        })
    }

    const createCoupon = async (couponData) => {
        try {
            const response = await authFetch(`${API_BASE_URL}/stores/${couponData.storeId}/coupons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(couponData),
            })

            if (response.ok) {
                const newCoupon = await response.json()
                const store = stores.find(s => s._id === couponData.storeId)
                const couponWithStoreInfo = { ...newCoupon, storeName: store?.name }
                setCoupons([...coupons, couponWithStoreInfo])
                setShowCreateCouponModal(false)
                toast.success('Coupon created successfully!')
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to create coupon')
            }
        } catch (error) {
            console.error('Error creating coupon:', error)
            toast.error(error.message || 'Failed to create coupon')
        }
    }

    const updateCoupon = async (couponId, couponData) => {
        try {
            const coupon = coupons.find(c => c._id === couponId)
            if (!coupon) return

            const response = await authFetch(`${API_BASE_URL}/stores/${coupon.storeId}/coupons/${couponId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(couponData),
            })

            if (response.ok) {
                const updatedCoupon = await response.json()
                const store = stores.find(s => s._id === coupon.storeId)
                const couponWithStoreInfo = { ...updatedCoupon, storeName: store?.name }
                setCoupons(coupons.map(c =>
                    c._id === couponId ? couponWithStoreInfo : c
                ))
                setShowEditCouponModal(false)
                setEditingCoupon(null)
                toast.success('Coupon updated successfully!')
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to update coupon')
            }
        } catch (error) {
            console.error('Error updating coupon:', error)
            toast.error(error.message || 'Failed to update coupon')
        }
    }

    const deleteCoupon = async (couponId) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Delete Coupon</p>
                <p className="text-sm text-slate-600">Are you sure you want to delete this coupon? This action cannot be undone.</p>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id)
                            try {
                                const coupon = coupons.find(c => c._id === couponId)
                                if (!coupon) return

                                const response = await authFetch(`${API_BASE_URL}/stores/${coupon.storeId}/coupons/${couponId}`, {
                                    method: 'DELETE',
                                })

                                if (response.ok) {
                                    setCoupons(coupons.filter(c => c._id !== couponId))
                                    toast.success('Coupon deleted successfully!')
                                } else {
                                    throw new Error('Failed to delete coupon')
                                }
                            } catch (error) {
                                console.error('Error deleting coupon:', error)
                                toast.error('Failed to delete coupon')
                            }
                        }}
                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
        })
    }

    const fetchProducts = async () => {
        try {
            const allProducts = []
            for (const store of stores) {
                const response = await authFetch(`${API_BASE_URL}/stores/${store._id}/products`)
                if (response.ok) {
                    const productsData = await response.json()
                    const products = Array.isArray(productsData) ? productsData : productsData.data || []
                    allProducts.push(...products.map(product => ({ ...product, storeName: store.name, storeId: store._id })))
                }
            }
            setProducts(allProducts)
        } catch (error) {
            console.error('Error fetching products:', error)
            toast.error('Failed to fetch products')
        }
    }

    const fetchCoupons = async () => {
        try {
            setLoading(true)
            for (const store of stores) {
                const response = await authFetch(`${API_BASE_URL}/coupons?storeId=${store._id}`)
                if (response.ok) {
                    const data = await response.json()
                    const couponsData = data.data || data
                    setCoupons(Array.isArray(couponsData) ? couponsData : [])
                } else {
                    throw new Error('Failed to fetch coupons')
                }
            }
        } catch (error) {
            console.error('Error fetching coupons:', error)
            toast.error('Failed to fetch coupons')
        } finally {
            setLoading(false)
        }
    }

    const fetchOrders = async () => {
        try {
            const allOrders = []
            for (const store of stores) {
                const response = await authFetch(`${API_BASE_URL}/orders?storeId=${store._id}`)
                if (response.ok) {
                    const ordersData = await response.json()
                    const orders = Array.isArray(ordersData) ? ordersData : ordersData.data || []
                    allOrders.push(...orders.map(order => ({ ...order, storeName: store.name })))
                }
            }
            setOrders(allOrders)
        } catch (error) {
            console.error('Error fetching orders:', error)
            toast.error('Failed to fetch orders')
        }
    }

    const filteredStores = stores.filter(store =>
        (store.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (store.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    const getTotalStats = () => {
        return {
            totalStores: stores.length,
            totalProducts: stores.reduce((sum, store) => sum + store.productCount, 0),
            totalOrders: stores.reduce((sum, store) => sum + store.orderCount, 0),
            totalRevenue: stores.reduce((sum, store) => sum + store.totalRevenue, 0),
            activeStores: stores.filter(store => store.isActive).length
        }
    }

    useEffect(() => {
        initAuth()
    }, [])

    useEffect(() => {
        fetchUserStores()
    }, [userId])

    // Fetch products when products tab is active
    useEffect(() => {
        if (activeTab === 'products' && stores.length > 0) {
            fetchProducts()
        }
    }, [activeTab, stores])

    // Fetch coupons when coupons tab is active
    useEffect(() => {
        if (activeTab === 'coupons' && stores.length > 0) {
            fetchCoupons()
        }
    }, [activeTab, stores])

    // Fetch orders when orders tab is active
    useEffect(() => {
        if (activeTab === 'orders' && stores.length > 0) {
            fetchOrders()
        }
    }, [activeTab, stores])

    const handleModalSuccess = () => {
        setShowCreateCouponModal(false)
        setShowEditCouponModal(false)
        setEditingCoupon(null)
        fetchCoupons()
    }

    const stats = getTotalStats()

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Header Skeleton */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="h-8 w-48 bg-slate-200 rounded-lg mb-2 animate-pulse"></div>
                        <div className="h-5 w-64 bg-slate-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="h-10 w-40 bg-slate-200 rounded-lg animate-pulse"></div>
                </div>

                {/* Tabs Skeleton */}
                <div className="bg-white border border-slate-200 rounded-lg p-1">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="px-4 py-2.5 rounded-md">
                                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                                <div>
                                    <div className="h-4 w-20 bg-slate-200 rounded mb-1"></div>
                                    <div className="h-6 w-12 bg-slate-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search Skeleton */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
                    <div className="h-10 w-full bg-slate-200 rounded-lg"></div>
                </div>

                {/* Store Filter Skeleton (for products/coupons) */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
                    <div className="h-10 w-48 bg-slate-200 rounded-lg"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 animate-pulse">
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-5 w-32 bg-slate-200 rounded"></div>
                                            <div className="h-4 w-24 bg-slate-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="w-9 h-5 bg-slate-200 rounded-full"></div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 p-3 bg-slate-50 rounded-lg">
                                    <div className="text-center space-y-1">
                                        <div className="h-5 w-8 bg-slate-200 rounded mx-auto"></div>
                                        <div className="h-3 w-12 bg-slate-200 rounded mx-auto"></div>
                                    </div>
                                    <div className="text-center space-y-1">
                                        <div className="h-5 w-8 bg-slate-200 rounded mx-auto"></div>
                                        <div className="h-3 w-12 bg-slate-200 rounded mx-auto"></div>
                                    </div>
                                    <div className="text-center space-y-1">
                                        <div className="h-5 w-8 bg-slate-200 rounded mx-auto"></div>
                                        <div className="h-3 w-12 bg-slate-200 rounded mx-auto"></div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-slate-200 rounded"></div>
                                    <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                                    <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <div className="flex-1 h-8 bg-slate-200 rounded"></div>
                                    <div className="flex-1 h-8 bg-slate-200 rounded"></div>
                                    <div className="flex-1 h-8 bg-slate-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                        My <span className="text-blue-600">Stores</span>
                    </h1>
                    <p className="text-slate-600 mt-1">Manage your stores and track their performance</p>
                </div>
                {activeTab === 'stores' && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        <Plus size={18} />
                        <span>Create New Store</span>
                    </button>
                )}
                {activeTab === 'products' && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        <Plus size={18} />
                        <span>Add Product</span>
                    </button>
                )}
                {activeTab === 'coupons' && (
                    <button
                        onClick={() => setShowCreateCouponModal(true)}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        <Plus size={18} />
                        <span>Create Coupon</span>
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="bg-white border border-slate-200 rounded-lg p-1">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
                    <button
                        onClick={() => setActiveTab('stores')}
                        className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'stores'
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Store size={16} />
                            <span>Stores</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'products'
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Package size={16} />
                            <span>Products</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('coupons')}
                        className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'coupons'
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Tag size={16} />
                            <span>Coupons</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'orders'
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <ShoppingCart size={16} />
                            <span>Orders</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Store size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Stores</p>
                            <p className="text-xl font-bold text-slate-800">{stats.totalStores}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Package size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Products</p>
                            <p className="text-xl font-bold text-slate-800">{stats.totalProducts}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <ShoppingCart size={20} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Orders</p>
                            <p className="text-xl font-bold text-slate-800">{stats.totalOrders}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <TrendingUp size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Revenue</p>
                            <p className="text-xl font-bold text-slate-800">${stats.totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Eye size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Active</p>
                            <p className="text-xl font-bold text-slate-800">{stats.activeStores}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder={activeTab === 'stores' ? "Search your stores..." : "Search your products..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Store Filter for Products */}
            {activeTab === 'products' && stores.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Store</label>
                    <select
                        value={selectedStoreFilter}
                        onChange={(e) => setSelectedStoreFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Stores</option>
                        {stores.map(store => (
                            <option key={store._id} value={store._id}>{store.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Store Filter for Coupons */}
            {activeTab === 'coupons' && stores.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Store</label>
                    <select
                        value={selectedCouponStoreFilter}
                        onChange={(e) => setSelectedCouponStoreFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Stores</option>
                        {stores.map(store => (
                            <option key={store._id} value={store._id}>{store.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'stores' && (
                <>
                    {/* Stores Grid */}
                    {filteredStores.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredStores.map((store) => (
                                <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <div className="p-6">
                                        {/* Store Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden">
                                                    {store.logo ? (
                                                        <Image
                                                            src={store.logo}
                                                            alt={store.name}
                                                            width={48}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Store size={24} className="text-slate-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-800 truncate">{store.name}</h3>
                                                    <p className="text-sm text-slate-500 truncate">{store.description}</p>
                                                </div>
                                            </div>

                                            {/* Status Toggle */}
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    onChange={() => toggleStoreStatus(store._id)}
                                                    checked={store.isActive}
                                                />
                                                <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
                                                <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                            </label>
                                        </div>

                                        {/* Store Stats */}
                                        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-slate-800">{store.productCount}</p>
                                                <p className="text-xs text-slate-600">Products</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-slate-800">{store.orderCount}</p>
                                                <p className="text-xs text-slate-600">Orders</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-slate-800">${store.totalRevenue.toFixed(0)}</p>
                                                <p className="text-xs text-slate-600">Revenue</p>
                                            </div>
                                        </div>

                                        {/* Store Details */}
                                        <div className="space-y-2 mb-4">
                                            {store.address && (
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <MapPin size={12} className="text-blue-600 flex-shrink-0" />
                                                    <span className="truncate">{store.address}</span>
                                                </div>
                                            )}
                                            {store.metadata?.country && (
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <Globe size={12} className="text-blue-600 flex-shrink-0" />
                                                    <span className="truncate">{store.metadata.country}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Calendar size={12} className="text-blue-600 flex-shrink-0" />
                                                <span>Created {new Date(store.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    console.log('View Details clicked for store:', store)
                                                    setSelectedStoreDetail(store)
                                                    setShowDetailModal(true)
                                                    console.log('Modal state set:', { showDetailModal: true, selectedStoreDetail: store })
                                                }}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                <Eye size={12} />
                                                View Details
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setSelectedStore(store)
                                                    setShowEditModal(true)
                                                }}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                <Edit3 size={12} />
                                                Edit
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    deleteStore(store._id)
                                                }}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                <Trash2 size={12} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                            <Store size={48} className="mx-auto text-slate-400 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                {searchTerm ? 'No stores found' : 'No stores yet'}
                            </h3>
                            <p className="text-slate-600 mb-6">
                                {searchTerm
                                    ? "Try adjusting your search criteria"
                                    : "Create your first store to start selling"
                                }
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    <Plus size={16} />
                                    Create Your First Store
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'products' && (
                <>
                    {/* Products Grid */}
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products
                                .filter(product => selectedStoreFilter === 'all' || product.storeId === selectedStoreFilter)
                                .map((product) => (
                                    <div key={product._id} className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                        <div className="p-6">
                                            {/* Product Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden">
                                                        {product.images?.[0] ? (
                                                            <Image
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                width={48}
                                                                height={48}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Package size={24} className="text-slate-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-slate-800 truncate">{product.name}</h3>
                                                        <p className="text-sm text-slate-500 truncate">{product.storeName}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Product Details */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <DollarSign size={14} className="text-green-600" />
                                                    <span>{currency}{product.price}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Package size={14} className="text-blue-600" />
                                                    <span>{product.stock} in stock</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingProductId(product._id)
                                                        setShowEditProductModal(true)
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                                                >
                                                    <Edit3 size={12} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product._id)}
                                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
                                                >
                                                    <Trash2 size={12} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                            <Package size={48} className="mx-auto text-slate-400 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No products yet</h3>
                            <p className="text-slate-600 mb-6">Add your first product to start selling</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <Plus size={16} />
                                Add Product
                            </button>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'coupons' && (
                <>
                    {/* Coupons Grid */}
                    {coupons
                        .filter(coupon => selectedCouponStoreFilter === 'all' || coupon.storeId === selectedCouponStoreFilter)
                        .length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {coupons
                                .filter(coupon => selectedCouponStoreFilter === 'all' || coupon.storeId === selectedCouponStoreFilter)
                                .map((coupon) => (
                                <div key={coupon._id} className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="p-6">
                                        {/* Coupon Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                                                    <Tag size={24} className="text-slate-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-800 truncate">{coupon.code}</h3>
                                                    <p className="text-sm text-slate-500 truncate">{coupon.storeName}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Coupon Details */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Percent size={14} className="text-green-600" />
                                                <span>{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `${currency}${coupon.discountValue}`}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Calendar size={14} className="text-blue-600" />
                                                <span>Expires {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingCoupon(coupon)
                                                    setShowEditCouponModal(true)
                                                }}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                <Edit3 size={12} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteCoupon(coupon._id)}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                <Trash2 size={12} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                            <Tag size={48} className="mx-auto text-slate-400 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No coupons yet</h3>
                            <p className="text-slate-600 mb-6">Create coupons to attract customers</p>
                            <button
                                onClick={() => setShowCreateCouponModal(true)}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <Plus size={16} />
                                Create Coupon
                            </button>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'orders' && (
                <>
                    {/* Orders Grid */}
                    {orders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="p-6">
                                        {/* Order Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                                                    <ShoppingCart size={24} className="text-slate-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-800 truncate">Order #{order._id.slice(-8)}</h3>
                                                    <p className="text-sm text-slate-500 truncate">{order.storeName}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Details */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <DollarSign size={14} className="text-green-600" />
                                                <span>{currency}{order.total}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Calendar size={14} className="text-blue-600" />
                                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <CheckCircle size={14} className={`text-${order.status === 'completed' ? 'green' : order.status === 'pending' ? 'yellow' : 'red'}-600`} />
                                                <span className="capitalize">{order.status}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order)
                                                    setIsOrderModalOpen(true)
                                                }}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                <Eye size={12} />
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                            <ShoppingCart size={48} className="mx-auto text-slate-400 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No orders yet</h3>
                            <p className="text-slate-600 mb-6">Orders from your stores will appear here</p>
                        </div>
                    )}
                </>
            )}

            {/* Create Store Modal */}
            {showCreateModal && (
                <CreateStoreModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={createStore}
                />
            )}

            {/* Edit Store Modal */}
            {showEditModal && selectedStore && (
                <EditStoreModal
                    store={selectedStore}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={(storeData) => updateStore(selectedStore._id, storeData)}
                />
            )}

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onProductAdded={(newProduct) => {
                    const store = stores.find(s => s._id === newProduct.storeId)
                    const productWithStoreInfo = { ...newProduct, storeName: store?.name, storeId: newProduct.storeId }
                    setProducts([...products, productWithStoreInfo])
                    setShowAddModal(false)
                    toast.success('Product added successfully!')
                }}
            />

            {/* Edit Product Modal */}
            <EditProductModal
                isOpen={showEditProductModal}
                onClose={() => {
                    setShowEditProductModal(false)
                    setEditingProductId(null)
                }}
                productId={editingProductId}
                onProductUpdated={() => fetchProducts()}
            />

            {/* Create Coupon Modal */}
            {showCreateCouponModal && (
                <CouponModal
                    isOpen={showCreateCouponModal}
                    onClose={() => setShowCreateCouponModal(false)}
                    mode="create"
                    storeId={stores.length > 0 ? stores[0]._id : null}
                    onSuccess={handleModalSuccess}
                />
            )}

            {/* Edit Coupon Modal */}
            {showEditCouponModal && editingCoupon && (
                <CouponModal
                    isOpen={showEditCouponModal}
                    onClose={() => {
                        setShowEditCouponModal(false)
                        setEditingCoupon(null)
                    }}
                    mode="edit"
                    initialData={editingCoupon}
                    storeId={editingCoupon.storeId}
                    onSuccess={handleModalSuccess}
                />
            )}

            {/* Store Detail Modal */}
            {showDetailModal && selectedStoreDetail && (
                <StoreDetailModal
                    store={selectedStoreDetail}
                    isOpen={showDetailModal}
                    onClose={() => {
                        setShowDetailModal(false)
                        setSelectedStoreDetail(null)
                    }}
                />
            )}

            {/* Order View Modal */}
            {isOrderModalOpen && selectedOrder && (
                <OrderViewModal
                    isOpen={isOrderModalOpen}
                    onClose={() => setIsOrderModalOpen(false)}
                    order={selectedOrder}
                />
            )}
        </div>
    )
}

// Create Store Modal Component
const CreateStoreModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        contact: '',
        logo: '',
        metadata: {
            country: '',
            city: '',
            website: '',
            email: '',
            businessType: '',
            category: '',
            businessHours: {
                monday: '',
                tuesday: '',
                wednesday: '',
                thursday: '',
                friday: '',
                saturday: '',
                sunday: ''
            },
            socialMedia: {
                facebook: '',
                instagram: '',
                twitter: '',
                linkedin: ''
            },
            employeeCount: '',
            yearEstablished: '',
            taxId: '',
            businessLicense: '',
            paymentMethods: []
        }
    })
    const [loading, setLoading] = useState(false)
    const [logoPreview, setLogoPreview] = useState('')
    const fileInputRef = useRef(null)

    const businessTypes = [
        'Sole Proprietorship',
        'Partnership',
        'Corporation',
        'LLC',
        'Non-Profit',
        'Other'
    ]

    const categories = [
        'Electronics',
        'Fashion & Clothing',
        'Home & Garden',
        'Health & Beauty',
        'Sports & Recreation',
        'Automotive',
        'Books & Media',
        'Food & Beverages',
        'Services',
        'Other'
    ]

    const countries = [
        'Ghana', 'Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Morocco',
        'United States', 'United Kingdom', 'Canada', 'Germany', 'France'
    ]

    const paymentMethods = [
        'Cash', 'Credit Card', 'Debit Card', 'Mobile Money', 'Bank Transfer', 'PayPal', 'Stripe'
    ]

    const handleLogoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Logo file size should be less than 5MB')
                return
            }

            const reader = new FileReader()
            reader.onload = () => {
                const base64 = reader.result
                setLogoPreview(base64)
                setFormData(prev => ({ ...prev, logo: base64 }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleMetadataChange = (field, value, subField = null) => {
        setFormData(prev => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                [field]: subField
                    ? { ...prev.metadata[field], [subField]: value }
                    : value
            }
        }))
    }

    const handlePaymentMethodToggle = (method) => {
        const currentMethods = formData.metadata.paymentMethods || []
        const updatedMethods = currentMethods.includes(method)
            ? currentMethods.filter(m => m !== method)
            : [...currentMethods, method]

        handleMetadataChange('paymentMethods', updatedMethods)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onSubmit(formData)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Create New Store</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X size={20} className="text-slate-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Basic Information</h3>

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Store Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                                        {logoPreview ? (
                                            <Image
                                                src={logoPreview}
                                                alt="Logo preview"
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon size={24} className="text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors"
                                        >
                                            <Upload size={16} />
                                            Upload Logo
                                        </button>
                                        <p className="text-xs text-slate-500 mt-1">Max 5MB, JPG/PNG</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Store Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="Enter store name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="Brief description of your store"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
                                    <select
                                        value={formData.metadata.country}
                                        onChange={(e) => handleMetadataChange('country', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                    >
                                        <option value="">Select country</option>
                                        {countries.map(country => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={formData.metadata.city}
                                        onChange={(e) => handleMetadataChange('city', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="e.g. Accra, Lagos, Nairobi"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                    placeholder="Full business address"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                        placeholder="e.g. +1234567890"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.metadata.email}
                                        onChange={(e) => handleMetadataChange('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="business@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                                <input
                                    type="url"
                                    value={formData.metadata.website}
                                    onChange={(e) => handleMetadataChange('website', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                    placeholder="https://yourstore.com"
                                />
                            </div>
                        </div>

                        {/* Business Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Business Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Employee Count</label>
                                    <select
                                        value={formData.metadata.employeeCount}
                                        onChange={(e) => handleMetadataChange('employeeCount', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                    >
                                        <option value="">Select range</option>
                                        <option value="1">Just me</option>
                                        <option value="2-10">2-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="200+">200+ employees</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Year Established</label>
                                    <input
                                        type="number"
                                        value={formData.metadata.yearEstablished}
                                        onChange={(e) => handleMetadataChange('yearEstablished', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        placeholder={new Date().getFullYear()}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID</label>
                                    <input
                                        type="text"
                                        value={formData.metadata.taxId}
                                        onChange={(e) => handleMetadataChange('taxId', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="Business tax identification"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Business License</label>
                                <input
                                    type="text"
                                    value={formData.metadata.businessLicense}
                                    onChange={(e) => handleMetadataChange('businessLicense', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                    placeholder="Business license number"
                                />
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Payment Methods</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {paymentMethods.map(method => (
                                    <label key={method} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.metadata.paymentMethods?.includes(method)}
                                            onChange={() => handlePaymentMethodToggle(method)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            disabled={loading}
                                        />
                                        <span className="text-sm text-slate-700">{method}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Social Media</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Facebook</label>
                                    <input
                                        type="url"
                                        value={formData.metadata.socialMedia.facebook}
                                        onChange={(e) => handleMetadataChange('socialMedia', e.target.value, 'facebook')}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="https://facebook.com/yourstore"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Instagram</label>
                                    <input
                                        type="url"
                                        value={formData.metadata.socialMedia.instagram}
                                        onChange={(e) => handleMetadataChange('socialMedia', e.target.value, 'instagram')}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="https://instagram.com/yourstore"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Twitter</label>
                                    <input
                                        type="url"
                                        value={formData.metadata.socialMedia.twitter}
                                        onChange={(e) => handleMetadataChange('socialMedia', e.target.value, 'twitter')}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="https://twitter.com/yourstore"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
                                    <input
                                        type="url"
                                        value={formData.metadata.socialMedia.linkedin}
                                        onChange={(e) => handleMetadataChange('socialMedia', e.target.value, 'linkedin')}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="https://linkedin.com/company/yourstore"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Business Hours</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                    <div key={day} className="flex items-center space-x-4">
                                        <label className="w-20 text-sm font-medium text-slate-700 capitalize">
                                            {day}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.metadata.businessHours[day]}
                                            onChange={(e) => handleMetadataChange('businessHours', e.target.value, day)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            disabled={loading}
                                            placeholder="e.g. 9:00 AM - 6:00 PM or Closed"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Store'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Edit Store Modal Component
const EditStoreModal = ({ store, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: store?.name || '',
        description: store?.description || '',
        address: store?.address || '',
        contact: store?.contact || '',
        logo: store?.logo || '',
        metadata: {
            country: store?.metadata?.country || '',
            city: store?.metadata?.city || '',
            website: store?.metadata?.website || '',
            email: store?.metadata?.email || '',
            businessType: store?.metadata?.businessType || '',
            category: store?.metadata?.category || '',
            businessHours: store?.metadata?.businessHours || {
                monday: '',
                tuesday: '',
                wednesday: '',
                thursday: '',
                friday: '',
                saturday: '',
                sunday: ''
            },
            socialMedia: store?.metadata?.socialMedia || {
                facebook: '',
                instagram: '',
                twitter: '',
                linkedin: ''
            },
            employeeCount: store?.metadata?.employeeCount || '',
            yearEstablished: store?.metadata?.yearEstablished || '',
            taxId: store?.metadata?.taxId || '',
            businessLicense: store?.metadata?.businessLicense || '',
            paymentMethods: store?.metadata?.paymentMethods || []
        }
    })
    const [loading, setLoading] = useState(false)
    const [logoPreview, setLogoPreview] = useState(store?.logo || '')
    const fileInputRef = useRef(null)

    const businessTypes = [
        'Sole Proprietorship',
        'Partnership',
        'Corporation',
        'LLC',
        'Non-Profit',
        'Other'
    ]

    const categories = [
        'Electronics',
        'Fashion & Clothing',
        'Home & Garden',
        'Health & Beauty',
        'Sports & Recreation',
        'Automotive',
        'Books & Media',
        'Food & Beverages',
        'Services',
        'Other'
    ]

    const countries = [
        'Ghana', 'Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Morocco',
        'United States', 'United Kingdom', 'Canada', 'Germany', 'France'
    ]

    const paymentMethods = [
        'Cash', 'Credit Card', 'Debit Card', 'Mobile Money', 'Bank Transfer', 'PayPal', 'Stripe'
    ]

    const handleLogoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Logo file size should be less than 5MB')
                return
            }

            const reader = new FileReader()
            reader.onload = () => {
                const base64 = reader.result
                setLogoPreview(base64)
                setFormData(prev => ({ ...prev, logo: base64 }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleMetadataChange = (field, value, subField = null) => {
        setFormData(prev => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                [field]: subField
                    ? { ...prev.metadata[field], [subField]: value }
                    : value
            }
        }))
    }

    const handlePaymentMethodToggle = (method) => {
        const currentMethods = formData.metadata.paymentMethods || []
        const updatedMethods = currentMethods.includes(method)
            ? currentMethods.filter(m => m !== method)
            : [...currentMethods, method]

        handleMetadataChange('paymentMethods', updatedMethods)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onSubmit(formData)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Edit Store</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X size={20} className="text-slate-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Basic Information</h3>

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Store Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                                        {logoPreview ? (
                                            <Image
                                                src={logoPreview}
                                                alt="Logo preview"
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon size={24} className="text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors"
                                        >
                                            <Upload size={16} />
                                            Upload Logo
                                        </button>
                                        <p className="text-xs text-slate-500 mt-1">Max 5MB, JPG/PNG</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Store Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="Enter store name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="Brief description of your store"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
                                    <select
                                        value={formData.metadata.country}
                                        onChange={(e) => handleMetadataChange('country', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                    >
                                        <option value="">Select country</option>
                                        {countries.map(country => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={formData.metadata.city}
                                        onChange={(e) => handleMetadataChange('city', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="e.g. Accra, Lagos, Nairobi"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                    placeholder="Full business address"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                        placeholder="e.g. +1234567890"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.metadata.email}
                                        onChange={(e) => handleMetadataChange('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="business@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                                <input
                                    type="url"
                                    value={formData.metadata.website}
                                    onChange={(e) => handleMetadataChange('website', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                    placeholder="https://yourstore.com"
                                />
                            </div>
                        </div>

                        {/* Business Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Business Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Employee Count</label>
                                    <select
                                        value={formData.metadata.employeeCount}
                                        onChange={(e) => handleMetadataChange('employeeCount', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                    >
                                        <option value="">Select range</option>
                                        <option value="1">Just me</option>
                                        <option value="2-10">2-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="200+">200+ employees</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Year Established</label>
                                    <input
                                        type="number"
                                        value={formData.metadata.yearEstablished}
                                        onChange={(e) => handleMetadataChange('yearEstablished', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        placeholder={new Date().getFullYear()}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID</label>
                                    <input
                                        type="text"
                                        value={formData.metadata.taxId}
                                        onChange={(e) => handleMetadataChange('taxId', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="Business tax identification"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
                                    <select
                                        value={formData.metadata.businessType}
                                        onChange={(e) => handleMetadataChange('businessType', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                    >
                                        <option value="">Select business type</option>
                                        {businessTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select
                                        value={formData.metadata.category}
                                        onChange={(e) => handleMetadataChange('category', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Business License</label>
                                <input
                                    type="text"
                                    value={formData.metadata.businessLicense}
                                    onChange={(e) => handleMetadataChange('businessLicense', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                    placeholder="Business license number"
                                />
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Payment Methods</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {paymentMethods.map(method => (
                                    <label key={method} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.metadata.paymentMethods?.includes(method)}
                                            onChange={() => handlePaymentMethodToggle(method)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            disabled={loading}
                                        />
                                        <span className="text-sm text-slate-700">{method}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Social Media</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Facebook</label>
                                    <input
                                        type="url"
                                        value={formData.metadata.socialMedia.facebook}
                                        onChange={(e) => handleMetadataChange('socialMedia', e.target.value, 'facebook')}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="https://facebook.com/yourstore"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Instagram</label>
                                    <input
                                        type="url"
                                        value={formData.metadata.socialMedia.instagram}
                                        onChange={(e) => handleMetadataChange('socialMedia', e.target.value, 'instagram')}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="https://instagram.com/yourstore"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Twitter</label>
                                    <input
                                        type="url"
                                        value={formData.metadata.socialMedia.twitter}
                                        onChange={(e) => handleMetadataChange('socialMedia', e.target.value, 'twitter')}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="https://twitter.com/yourstore"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
                                    <input
                                        type="url"
                                        value={formData.metadata.socialMedia.linkedin}
                                        onChange={(e) => handleMetadataChange('socialMedia', e.target.value, 'linkedin')}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                        placeholder="https://linkedin.com/company/yourstore"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Business Hours</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                    <div key={day} className="flex items-center space-x-4">
                                        <label className="w-20 text-sm font-medium text-slate-700 capitalize">
                                            {day}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.metadata.businessHours[day]}
                                            onChange={(e) => handleMetadataChange('businessHours', e.target.value, day)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            disabled={loading}
                                            placeholder="e.g. 9:00 AM - 6:00 PM or Closed"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Store'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
