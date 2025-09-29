'use client'
import { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { 
    X, 
    Plus, 
    Edit, 
    Trash2, 
    Percent, 
    DollarSign, 
    Calendar 
} from 'lucide-react'
import { authFetch } from '@/lib/auth'

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

const CouponModal = ({
    isOpen,
    onClose,
    mode = 'create',
    initialData = null,
    storeId,
    onSuccess
}) => {
    const [coupon, setCoupon] = useState({
        code: '',
        description: '',
        discountType: 'percent',
        discountValue: '',
        validFrom: null,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        minOrderTotal: 0,
        usageLimit: null,
        isActive: true
    })
    const [loading, setLoading] = useState(false)
    const modalRef = useRef(null)

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setCoupon({
                    code: initialData.code || '',
                    description: initialData.description || '',
                    discountType: initialData.discountType || 'percent',
                    discountValue: initialData.discountValue || '',
                    validFrom: initialData.validFrom ? new Date(initialData.validFrom) : null,
                    validUntil: initialData.validUntil ? new Date(initialData.validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    minOrderTotal: initialData.minOrderTotal || 0,
                    usageLimit: initialData.usageLimit || null,
                    isActive: initialData.isActive !== undefined ? initialData.isActive : true
                })
            } else {
                setCoupon({
                    code: '',
                    description: '',
                    discountType: 'percent',
                    discountValue: '',
                    validFrom: null,
                    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    minOrderTotal: 0,
                    usageLimit: null,
                    isActive: true
                })
            }
        }
    }, [isOpen, mode, initialData])

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setCoupon({ 
            ...coupon, 
            [name]: type === 'checkbox' ? checked : value 
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const submitData = {
                ...coupon,
                code: coupon.code.toUpperCase(),
                discountValue: parseFloat(coupon.discountValue),
                minOrderTotal: parseFloat(coupon.minOrderTotal) || 0,
                usageLimit: coupon.usageLimit ? parseInt(coupon.usageLimit) : null,
                storeId: storeId,
            }

            let response
            if (mode === 'edit' && initialData?._id) {
                response = await authFetch(`${API_BASE_URL}/coupons/update/${initialData._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(submitData),
                })
                if (response.ok) {
                    toast.success('Coupon updated successfully!')
                    onSuccess?.()
                    onClose()
                } else {
                    const errorData = await response.json()
                    throw new Error(errorData.message || 'Failed to update coupon')
                }
            } else {
                response = await authFetch(`${API_BASE_URL}/coupons`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(submitData),
                })
                if (response.ok) {
                    toast.success('Coupon added successfully!')
                    onSuccess?.()
                    onClose()
                } else {
                    const errorData = await response.json()
                    throw new Error(errorData.message || 'Failed to add coupon')
                }
            }
        } catch (error) {
            console.error(`Error ${mode}ing coupon:`, error)
            toast.error(error.message || `Failed to ${mode} coupon`)
        } finally {
            setLoading(false)
        }
    }

    const handleBackdropClick = (e) => {
        if (e.target === modalRef.current) {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white z-10">
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                        {mode === 'edit' ? (
                            <>
                                <Edit size={20} className="text-blue-600" />
                                Edit Coupon
                            </>
                        ) : (
                            <>
                                <Plus size={20} className="text-blue-600" />
                                Add New Coupon
                            </>
                        )}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Coupon Code *
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter coupon code (e.g., SAVE20)" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-slate-100"
                                name="code" 
                                value={coupon.code} 
                                onChange={handleChange} 
                                required
                                disabled={mode === 'edit'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Discount Type *
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                name="discountType"
                                value={coupon.discountType}
                                onChange={handleChange}
                                required
                            >
                                <option value="percent">Percentage (%)</option>
                                <option value="amount">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Discount Value *
                            </label>
                            <input 
                                type="number" 
                                placeholder={`Enter ${coupon.discountType === 'percent' ? '%' : '$'} value`}
                                min={0}
                                max={coupon.discountType === 'percent' ? 100 : undefined}
                                step={coupon.discountType === 'percent' ? 0.1 : 0.01}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                name="discountValue" 
                                value={coupon.discountValue} 
                                onChange={handleChange} 
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Minimum Order Total ($)
                            </label>
                            <input 
                                type="number" 
                                placeholder="0 for no minimum" 
                                min={0}
                                step={0.01}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                name="minOrderTotal" 
                                value={coupon.minOrderTotal} 
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Usage Limit
                            </label>
                            <input 
                                type="number" 
                                placeholder="Leave empty for unlimited" 
                                min={1}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                name="usageLimit" 
                                value={coupon.usageLimit || ''} 
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Valid From (Optional)
                            </label>
                            <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                name="validFrom" 
                                value={coupon.validFrom ? format(new Date(coupon.validFrom), 'yyyy-MM-dd') : ''} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description *
                            </label>
                            <input 
                                type="text" 
                                placeholder="Brief description of the coupon" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                name="description" 
                                value={coupon.description} 
                                onChange={handleChange} 
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-200">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <input 
                                type="checkbox" 
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                name="isActive" 
                                checked={coupon.isActive}
                                onChange={handleChange}
                            />
                            <span>Active</span>
                        </label>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 ml-auto">
                            <Calendar size={16} className="text-slate-500" />
                            <span className="text-xs text-slate-500">
                                Valid Until: {format(new Date(coupon.validUntil), 'MMM dd, yyyy')}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    {mode === 'edit' ? <Edit size={16} /> : <Plus size={16} />}
                                    {mode === 'edit' ? 'Update' : 'Add'} Coupon
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CouponModal
