'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Counter from "./Counter";
import ReviewModal from "../modals/ReviewModal";
import { useDispatch, useSelector } from "react-redux";

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

const ProductDetails = ({ product: passedProduct, productId: initialProductId }) => {
    const [product, setProduct] = useState(passedProduct || null)
    const [loading, setLoading] = useState(!passedProduct)
    const [error, setError] = useState(null)
    const [mainImage, setMainImage] = useState('')
    const [showRatingForm, setShowRatingForm] = useState(false)
    const [ratingForm, setRatingForm] = useState({
        rating: 5,
        comment: '',
        reviewerName: ''
    })
    const [submittingRating, setSubmittingRating] = useState(false)
    const [ratingError, setRatingError] = useState(null)

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();
    const router = useRouter()

    useEffect(() => {
        if (passedProduct) {
            setProduct(passedProduct)
            const firstImage = passedProduct.images?.[0]
            setMainImage((firstImage && firstImage.trim()) ? firstImage : '/placeholder-image.jpg')
            setLoading(false)
        }
    }, [passedProduct])

    useEffect(() => {
        if (!passedProduct && initialProductId) {
            const fetchProduct = async () => {
                try {
                    setLoading(true)
                    setError(null)

                    const response = await fetch(`${API_BASE_URL}/products/${initialProductId}`)

                    if (response.ok) {
                        const result = await response.json()

                        if (result.success) {
                            setProduct(result.data)
                            const firstImage = result.data.images?.[0]
                            setMainImage((firstImage && firstImage.trim()) ? firstImage : '/placeholder-image.jpg')
                        } else {
                            throw new Error(result.message || 'Product not found')
                        }
                    } else if (response.status === 404) {
                        throw new Error('Product not found')
                    } else {
                        throw new Error(`Failed to fetch product details`)
                    }

                } catch (error) {
                    console.error('Error fetching product:', error)
                    setError(error.message)
                } finally {
                    setLoading(false)
                }
            }

            fetchProduct()
        }
    }, [initialProductId, passedProduct])

    const addToCartHandler = () => {
        dispatch(addToCart({ productId: product.id }))
    }

    const submitRating = async (e) => {
        e.preventDefault()
        
        try {
            setSubmittingRating(true)
            setRatingError(null)

            const response = await fetch(`${API_BASE_URL}/products/${product.id}/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ratingForm),
            })

            if (response.ok) {
                const result = await response.json()

                if (result.success) {
                    setProduct(result.data)
                    setShowRatingForm(false)
                    setRatingForm({ rating: 5, comment: '', reviewerName: '' })
                    setRatingError(null)
                } else {
                    throw new Error(result.message || 'Failed to submit rating')
                }
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to submit rating')
            }

        } catch (error) {
            console.error('Error submitting rating:', error)
            setRatingError(error.message)
        } finally {
            setSubmittingRating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 animate-pulse px-4 lg:px-0">
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="bg-gray-200 w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="w-full sm:w-96 lg:w-[450px] h-64 sm:h-96 lg:h-[450px] bg-gray-200 rounded-lg"></div>
                </div>
                <div className="flex-1 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-12 bg-gray-200 rounded w-40"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12 px-4">
                <div className="text-red-600 text-4xl sm:text-6xl mb-4">⚠️</div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">{error}</p>
                <button 
                    onClick={() => router.back()} 
                    className="bg-[#5C3AEB] hover:bg-[#4c2dd4] text-white px-6 py-2 rounded transition-colors text-sm sm:text-base"
                >
                    Go Back
                </button>
            </div>
        )
    }

    if (!product) return null

    const ratings = product.rating || []
    const averageRating = ratings.length > 0 
        ? ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length 
        : 0

    const originalPrice = product.originalPrice || product.price * 1.2
    const discountPercentage = originalPrice > product.price 
        ? ((originalPrice - product.price) / originalPrice * 100).toFixed(0)
        : 0

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 px-4 lg:px-0">
                {/* Image Gallery */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full lg:w-auto lg:flex-shrink-0">
                    <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                        {(product.images || []).filter(img => img && img.trim()).map((image, index) => (
                            <div 
                                key={index} 
                                onClick={() => setMainImage(image)} 
                                className={`bg-slate-100 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg cursor-pointer border-2 transition-all ${
                                    mainImage === image ? 'border-[#5C3AEB]' : 'border-transparent hover:border-slate-300'
                                }`}
                            >
                                <Image 
                                    src={image} 
                                    className="transition-transform hover:scale-105" 
                                    alt={`${product.name} ${index + 1}`} 
                                    width={60} 
                                    height={60} 
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center items-center w-full sm:w-96 lg:w-[450px] h-64 sm:h-96 lg:h-[450px] bg-slate-100 rounded-lg overflow-hidden">
                        {mainImage && mainImage.trim() ? (
                            <Image 
                                src={mainImage} 
                                alt={product.name}
                                width={400} 
                                height={400}
                                className="object-contain w-full h-full p-4"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <svg className="w-24 h-24 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm">No image available</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 leading-tight">{product.name}</h1>
                    
                    {/* Rating Display */}
                    <div className='flex items-center mt-3 flex-wrap gap-2'>
                        <div className="flex">
                            {Array(5).fill('').map((_, index) => (
                                <StarIcon 
                                    key={index} 
                                    size={16} 
                                    className='text-transparent' 
                                    fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} 
                                />
                            ))}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500">
                            {ratings.length} Review{ratings.length !== 1 ? 's' : ''}
                            {averageRating > 0 && (
                                <span className="ml-2">({averageRating.toFixed(1)})</span>
                            )}
                        </p>
                    </div>

                    {/* SKU Display */}
                    {product.sku && (
                        <p className="text-xs sm:text-sm text-slate-500 mt-2">SKU: {product.sku}</p>
                    )}
                    
                    <div className="flex items-center my-4 sm:my-6 gap-3 flex-wrap">
                        <p className="text-2xl sm:text-3xl font-semibold text-slate-800">{currency}{product.price}</p>
                        {originalPrice > product.price && (
                            <p className="text-lg sm:text-xl text-slate-500 line-through">{currency}{originalPrice}</p>
                        )}
                    </div>
                    
                    {discountPercentage > 0 && (
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <TagIcon size={16} />
                            <p>Save {discountPercentage}% right now</p>
                        </div>
                    )}

                    {/* Stock Status */}
                    <div className="mt-4">
                        {product.stock > 0 ? (
                            <p className="text-green-600 text-xs sm:text-sm">✓ In Stock ({product.stock} available)</p>
                        ) : (
                            <p className="text-red-600 text-xs sm:text-sm">✗ Out of Stock</p>
                        )}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="mt-6">
                            <h3 className="font-semibold text-slate-800 mb-2 text-base sm:text-lg">Description</h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{product.description}</p>
                        </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 mt-8">
                        {product.storeId ? (
                            <>
                                {cart[product.id] && (
                                    <div className="flex flex-col gap-3">
                                        <p className="text-base sm:text-lg text-slate-800 font-semibold">Quantity</p>
                                        <Counter productId={product.id} />
                                    </div>
                                )}
                                <button
                                    onClick={() => !cart[product.id] ? addToCartHandler() : router.push('/cart')}
                                    className="bg-[#5C3AEB] text-white px-8 sm:px-10 py-3 text-sm font-medium rounded hover:bg-[#4c2dd4] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                                    disabled={product.stock === 0}
                                >
                                    {product.stock === 0 ? 'Out of Stock' :
                                     !cart[product.id] ? 'Add to Cart' : 'View Cart'}
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => {
                                        const phone = product.attributes?.originalSellerPhone || product.contact;
                                        if (phone) {
                                            window.open(`tel:${phone}`, '_self');
                                        }
                                    }}
                                    className="bg-[#5C3AEB] text-white px-6 py-3 text-sm font-medium rounded hover:bg-[#4c2dd4] active:scale-95 transition w-full sm:w-auto"
                                >
                                    📞 Contact Seller
                                </button>
                                {(product.attributes?.originalSellerPhone || product.contact) && (
                                    <button
                                        onClick={() => {
                                            const phone = product.attributes?.originalSellerPhone || product.contact;
                                            const message = `Hi, I'm interested in your product: ${product.name}`;
                                            const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                                            window.open(whatsappUrl, '_blank');
                                        }}
                                        className="bg-[#5C3AEB] text-white px-6 py-3 text-sm font-medium rounded hover:bg-[#4c2dd4] active:scale-95 transition flex items-center justify-center gap-2 w-full sm:w-auto"
                                    >
                                        <span>💬 WhatsApp</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-300 my-6" />
                    
                    <div className="flex flex-col gap-3 sm:gap-4 text-slate-500 text-xs sm:text-sm">
                        <p className="flex gap-3 items-center"><EarthIcon size={18} className="text-slate-400 flex-shrink-0" /> Free shipping worldwide</p>
                        <p className="flex gap-3 items-center"><CreditCardIcon size={18} className="text-slate-400 flex-shrink-0" /> 100% Secured Payment</p>
                        <p className="flex gap-3 items-center"><UserIcon size={18} className="text-slate-400 flex-shrink-0" /> Trusted by top brands</p>
                    </div>
                </div>
            </div>

            {/* Customer Reviews Section - Full Width Below */}
            <div className="mt-12 px-4 lg:px-0 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-800">Customer Reviews</h3>
                    <button 
                        onClick={() => setShowRatingForm(!showRatingForm)}
                        className="bg-[#5C3AEB] hover:bg-[#4c2dd4] text-white px-4 py-2 text-sm rounded transition-colors w-full sm:w-auto"
                    >
                        Write Review
                    </button>
                </div>

                {/* Rating Modal */}
                <ReviewModal
                    isOpen={showRatingForm}
                    onClose={() => setShowRatingForm(false)}
                    ratingForm={ratingForm}
                    setRatingForm={setRatingForm}
                    submittingRating={submittingRating}
                    onSubmit={submitRating}
                    ratingError={ratingError}
                    setRatingError={setRatingError}
                />

                {/* Reviews List */}
                <div className="space-y-4 max-w-4xl">
                    {ratings.length > 0 ? (
                        ratings.slice().reverse().map((review, index) => (
                            <div key={index} className="border-b border-gray-200 pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                    <div className="flex">
                                        {Array(5).fill('').map((_, starIndex) => (
                                            <StarIcon
                                                key={starIndex}
                                                size={14}
                                                fill={starIndex < review.rating ? "#F59E0B" : "#D1D5DB"}
                                                className="text-transparent"
                                            />
                                        ))}
                                    </div>
                                    <span className="font-medium text-slate-800 text-sm">
                                        {review.reviewerName || 'Anonymous'}
                                    </span>
                                    <span className="text-xs sm:text-sm text-slate-500">
                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                                    </span>
                                </div>
                                {review.comment && (
                                    <p className="text-slate-600 text-xs sm:text-sm">{review.comment}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 text-center py-8 text-sm">No reviews yet. Be the first to review!</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductDetails