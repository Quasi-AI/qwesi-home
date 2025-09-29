'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/products/${productId}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Map _id to id for compatibility
                    const productWithId = {
                        ...result.data,
                        id: result.data._id
                    };
                    setProduct(productWithId);
                } else {
                    throw new Error(result.message || 'Failed to fetch product');
                }
            } else {
                throw new Error('Failed to fetch product');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
        scrollTo(0, 0);
    }, [productId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3AEB] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">Error loading product</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchProduct}
                        className="bg-[#5C3AEB] text-white px-6 py-2 rounded-lg hover:bg-[#3525b8] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-500 mb-4">Product not found</div>
                    <p className="text-gray-600">The product you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrums */}
                <div className="  text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product?.category}
                </div>

                {/* Product Details */}
                <ProductDetails product={product} />

                {/* Description & Reviews */}
                <ProductDescription product={product} />
            </div>
        </div>
    );
}