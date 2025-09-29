'use client'
import { StarIcon, HeartIcon, MessageCircleIcon, PhoneIcon, MapPin, ShoppingCartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

const ProductCard = ({ product, disabled }) => {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [storeInfo, setStoreInfo] = useState(null)
    const [loadingStore, setLoadingStore] = useState(false)
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart.cartItems)

    // Fetch store information for contact details
    useEffect(() => {
        const fetchStoreInfo = async () => {
            if (!product?.storeId) return

            try {
                setLoadingStore(true)
                const response = await fetch(`${API_BASE_URL}/stores/${product.storeId}`)
                
                if (response.ok) {
                    const result = await response.json()
                    if (result.success) {
                        setStoreInfo(result.data)
                    }
                }
            } catch (error) {
                console.error('Error fetching store info:', error)
                toast.error('Failed to load store information')
            } finally {
                setLoadingStore(false)
            }
        }

        fetchStoreInfo()
    }, [product?.storeId])

    // Calculate the average rating of the product
    const rating = product.rating && product.rating.length > 0 
        ? Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length)
        : 0

    // Check if product is on sale (using original price vs current price)
    const originalPrice = product.originalPrice || (product.price * 1.2)
    const isOnSale = originalPrice > product.price

    const handleWishlistClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsWishlisted(!isWishlisted)

        if (!isWishlisted) {
            toast.success('Added to wishlist!')
        } else {
            toast.success('Removed from wishlist')
        }
        // TODO: Add wishlist API call here
    }

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(addToCart({ productId: product.id }))
        toast.success('Added to cart!')
    }

    // Helper function to clean and format phone number for international use
    const formatPhoneNumber = (phone) => {
        if (!phone) return null
        
        // Remove all non-digit characters except + at the beginning
        let cleaned = phone.replace(/[^\d+]/g, '')
        
        // If it starts with +, keep it and remove any additional + signs
        if (cleaned.startsWith('+')) {
            cleaned = '+' + cleaned.substring(1).replace(/\+/g, '')
        }
        
        // Remove + for WhatsApp URL (WhatsApp expects numbers without +)
        const whatsappFormat = cleaned.startsWith('+') ? cleaned.substring(1) : cleaned
        
        // Basic validation - should have at least 7 digits (minimum international number length)
        const digitsOnly = whatsappFormat.replace(/\D/g, '')
        if (digitsOnly.length < 7) {
            return null
        }
        
        return whatsappFormat
    }

    const handleWhatsAppContact = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        // Check product contact fields first, then store fields as fallback
        const sellerPhone = product?.contact || product?.phone || product?.whatsapp || product?.mobile ||
                           storeInfo?.contact || storeInfo?.phone || storeInfo?.whatsapp || storeInfo?.mobile
        
        if (!sellerPhone) {
            toast.error('Contact information not available for this product')
            return
        }
        
        const formattedPhone = formatPhoneNumber(sellerPhone)
        
        if (!formattedPhone) {
            toast.error('Invalid phone number format')
            return
        }
        
        const message = `Hi! I'm interested in your "${product.name}" listed for ${currency}${product.price}. Is it still available?`
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
        
        try {
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
            toast.success('Opening WhatsApp...')
        } catch (error) {
            console.error('Error opening WhatsApp:', error)
            toast.error('Failed to open WhatsApp. Please try again.')
        }
    }

    const handlePhoneContact = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        // Check product contact fields first, then store fields as fallback
        const sellerPhone = product?.contact || product?.phone || product?.mobile ||
                           storeInfo?.contact || storeInfo?.phone || storeInfo?.mobile
        
        if (!sellerPhone) {
            toast.error('Phone number not available for this product')
            return
        }
        
        try {
            // For tel: links, we can use the original format
            window.location.href = `tel:${sellerPhone}`
            toast.success('Initiating call...')
        } catch (error) {
            console.error('Error initiating call:', error)
            toast.error('Failed to initiate call. Please dial manually: ' + sellerPhone)
        }
    }

    const handleViewStore = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (storeInfo?._id) {
            window.open(`/stores/${storeInfo._id}`, '_blank', 'noopener,noreferrer')
        } else {
            toast.error('Store information not available')
        }
    }

    // Helper function to check if contact info is available
    const hasContactInfo = () => {
        // Check product contact fields first, then store fields as fallback
        const productContact = product?.contact || product?.phone || product?.whatsapp || product?.mobile
        const storeContact = storeInfo?.contact || storeInfo?.phone || storeInfo?.whatsapp || storeInfo?.mobile
        
        return !!(productContact || storeContact)
    }

    return (
        <div className='w-full'>
            <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${!disabled && 'hover:border-[#5C3AEB]'} transition-colors ${disabled ? 'opacity-50 grayscale' : ''}`}>
                
                {/* Image Container */}
                <div className='relative h-40 bg-gray-50 flex items-center justify-center overflow-hidden'>
                    <Link href={`/product/${product.id}`} className={`flex items-center justify-center w-full h-full ${disabled ? 'pointer-events-none' : ''}`}>
                        <Image 
                            width={300} 
                            height={300} 
                            className='max-h-32 w-auto object-contain transition-transform group-hover:scale-105' 
                            src={product.images?.[0] || '/placeholder-image.jpg'} 
                            alt={product.name}
                            onError={(e) => {
                                e.target.src = '/placeholder-image.jpg'
                            }}
                        />
                    </Link>
                    
                    {/* Sale Badge */}
                    {!disabled && isOnSale && (
                        <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded'>
                            SALE
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <div className='absolute top-2 right-2'>
                        <button
                            onClick={handleWishlistClick}
                            disabled={disabled}
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                isWishlisted 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                            } transition-colors ${disabled ? 'cursor-not-allowed' : ''}`}
                        >
                            <HeartIcon size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className='p-3'>
                    <Link href={`/product/${product.id}`} className={`${disabled ? 'pointer-events-none' : ''}`}>
                        <h3 className='font-medium text-gray-900 text-sm line-clamp-2 leading-tight mb-1'>
                            {product.name}
                        </h3>
                    </Link>
                    
                    {/* SKU */}
                    {product.sku && (
                        <p className='text-xs text-gray-400 mb-1'>SKU: {product.sku}</p>
                    )}
                    
                    {/* Rating */}
                    <div className='flex items-center gap-1 mb-2'>
                        <div className='flex'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon 
                                    key={star} 
                                    size={12} 
                                    className='text-transparent' 
                                    fill={rating >= star ? "#F59E0B" : "#E5E7EB"} 
                                />
                            ))}
                        </div>
                        <span className='text-xs text-gray-500'>
                            ({product.rating?.length || 0})
                        </span>
                    </div>
                    
                    {/* Price */}
                    {disabled ? (
                        <div className='flex items-center justify-center bg-gray-100 p-2 rounded-md mb-2'>
                            <p className="text-sm font-medium text-gray-700">Contact owner for price</p>
                        </div>
                    ) : (
                        <div className='flex items-center justify-between mb-2'>
                            <div className='flex items-center gap-1'>
                                <span className='text-base font-bold text-[#5C3AEB]'>
                                    {currency}{product.price?.toFixed(2) || '0.00'}
                                </span>
                                {isOnSale && (
                                    <span className='text-xs text-gray-500 line-through'>
                                        {currency}{originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            
                            {isOnSale && (
                                <span className='text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-medium'>
                                    {Math.round(((originalPrice - product.price) / originalPrice) * 100)}% OFF
                                </span>
                            )}
                        </div>
                    )}
                    
                    {/* Stock Status */}
                    <div className='mb-3'>
                        {product.stock > 10 ? (
                            <span className='text-xs text-green-600 font-medium'>✓ In Stock</span>
                        ) : product.stock > 0 ? (
                            <span className='text-xs text-orange-600 font-medium'>⚠ Only {product.stock} left</span>
                        ) : (
                            <span className='text-xs text-red-600 font-medium'>✗ Out of Stock</span>
                        )}
                    </div>

                    {/* Store Info */}
                    {storeInfo && (
                        <div className='mb-3 p-2 bg-gray-50 rounded text-xs'>
                            <div className='flex items-center gap-1 mb-1'>
                                <MapPin size={10} />
                                <span className='font-medium text-gray-700'>Sold by {storeInfo.name}</span>
                            </div>
                            {storeInfo.address && (
                                <p className='text-gray-500 truncate'>{storeInfo.address}</p>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className='space-y-2'>
                        {product.storeId ? (
                            /* Add to Cart Button for store products */
                            <button
                                onClick={handleAddToCart}
                                disabled={disabled || product.stock === 0}
                                className='w-full bg-[#5C3AEB] hover:bg-[#3525b8] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-medium py-2 rounded flex items-center justify-center gap-1 transition-colors'
                                title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
                            >
                                <ShoppingCartIcon size={12} />
                                Add to Cart
                            </button>
                        ) : (
                            /* Contact Buttons for non-store products */
                            <div className='flex gap-2'>
                                <button
                                    onClick={handleWhatsAppContact}
                                    disabled={loadingStore || !hasContactInfo()}
                                    className='flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-medium py-2 rounded flex items-center justify-center gap-1 transition-colors'
                                    title={!hasContactInfo() ? 'Contact information not available' : 'Chat on WhatsApp'}
                                >
                                    <MessageCircleIcon size={12} />
                                    WhatsApp
                                </button>
                                <button
                                    onClick={handlePhoneContact}
                                    disabled={loadingStore || !hasContactInfo()}
                                    className='flex-1 bg-[#5C3AEB] hover:bg-[#3525b8] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-medium py-2 rounded flex items-center justify-center gap-1 transition-colors'
                                    title={!hasContactInfo() ? 'Phone number not available' : 'Call seller'}
                                >
                                    <PhoneIcon size={12} />
                                    Call
                                </button>
                            </div>
                        )}

                        {/* View Store Button */}
                        {storeInfo && (
                            <button
                                onClick={handleViewStore}
                                className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-2 rounded transition-colors'
                            >
                                View Store
                            </button>
                        )}
                    </div>

                    {/* Loading Contact Info */}
                    {loadingStore && (
                        <div className='mt-2 text-xs text-gray-500 text-center'>
                            Loading contact info...
                        </div>
                    )}

                    {/* No Contact Info Available */}
                    {storeInfo && !loadingStore && !hasContactInfo() && (
                        <div className='mt-2 text-xs text-orange-600 text-center'>
                            Contact information not available
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductCard