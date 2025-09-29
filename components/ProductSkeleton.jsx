const ProductSkeleton = () => (
    <div className="w-full">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
            {/* Image Container */}
            <div className="relative h-40 bg-gray-50 flex items-center justify-center">
                <div className="w-24 h-24 bg-gray-200 rounded"></div>
            </div>

            {/* Product Info */}
            <div className="p-3">
                {/* Product Name */}
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <div key={star} className="w-3 h-3 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>

                {/* Stock Status */}
                <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>

                {/* Store Info */}
                <div className="mb-3 p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-1 mb-1">
                        <div className="w-2 h-2 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                        <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-full h-8 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    </div>
)

export default ProductSkeleton;
