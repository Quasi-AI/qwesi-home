'use client'
import Counter from '@/components/Counter';
import OrderSummary from '@/components/OrderSummary';
import PageTitle from '@/components/PageTitle';
import CheckoutModal from '@/modals/CheckoutModal';
import { deleteItemFromCart } from '@/lib/features/cart/cartSlice';
import { setProduct } from '@/lib/features/product/productSlice';
import { Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api';

    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    const fetchProducts = async () => {
        if (products.length > 0) return;
        
        setLoadingProducts(true);
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    dispatch(setProduct(result.data));
                }
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                cartArray.push({
                    ...product,
                    quantity: value,
                });
                setTotalPrice(prev => prev + product.price * value);
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    return cartArray.length > 0 ? (
        <div className='min-h-screen mx-2 sm:mx-4 text-slate-800'>
            <div className='max-w-6xl mx-auto px-2 sm:px-4'>
                {/* Title */}
                <PageTitle heading='My Cart' text='items in your cart' u='Add more' />

                <div className='flex flex-col xl:flex-row items-start justify-between gap-0 xl:gap-6'>

                    {/* Table View for Medium and Large Screens */}
                    <div className='hidden md:block w-full max-w-4xl overflow-x-auto'>
                        <table className='w-full text-slate-600 table-auto min-w-[600px]'>
                            <thead>
                                <tr className='border-b border-slate-200'>
                                    <th className='text-left py-4 font-medium'>Product</th>
                                    <th className='text-center py-4 font-medium'>Quantity</th>
                                    <th className='text-center py-4 font-medium'>Total Price</th>
                                    <th className='text-center py-4 font-medium'>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartArray.map((item, index) => (
                                    <tr key={index} className='border-b border-slate-100'>
                                        <td className='py-4 sm:py-6'>
                                            <div className='flex gap-3 sm:gap-4 items-center'>
                                                <div className='flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-slate-100 rounded-lg flex items-center justify-center'>
                                                    <Image
                                                        src={item.images[0]}
                                                        className='h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 object-cover rounded'
                                                        alt=''
                                                        width={40}
                                                        height={40}
                                                    />
                                                </div>
                                                <div className='min-w-0 flex-1'>
                                                    <p className='font-medium text-slate-900 text-sm sm:text-base truncate'>{item.name}</p>
                                                    <p className='text-xs sm:text-sm text-slate-500'>{item.category}</p>
                                                    <p className='text-xs sm:text-sm font-medium text-slate-700'>{currency}{item.price}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-center py-4 sm:py-6'>
                                            <Counter productId={item.id} />
                                        </td>
                                        <td className='text-center py-4 sm:py-6'>
                                            <span className='font-medium text-sm sm:text-base'>{currency}{(item.price * item.quantity).toLocaleString()}</span>
                                        </td>
                                        <td className='text-center py-4 sm:py-6'>
                                            <button
                                                onClick={() => handleDeleteItemFromCart(item.id)}
                                                className='text-red-500 hover:bg-red-50 p-1.5 sm:p-2 rounded-full active:scale-95 transition-all'
                                            >
                                                <Trash2Icon size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className='md:hidden w-full space-y-3'>
                        {cartArray.map((item, index) => (
                            <div key={index} className='bg-white border border-slate-200 rounded-lg p-3 shadow-sm'>
                                <div className='flex gap-2 sm:gap-3'>
                                    {/* Product Image */}
                                    <div className='flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 rounded-lg flex items-center justify-center'>
                                        <Image
                                            src={item.images[0]}
                                            className='h-9 w-9 sm:h-11 sm:w-11 object-cover rounded'
                                            alt=''
                                            width={36}
                                            height={36}
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex justify-between items-start mb-1.5'>
                                            <div className='min-w-0 flex-1'>
                                                <h3 className='font-medium text-slate-900 text-sm sm:text-base truncate'>{item.name}</h3>
                                                <p className='text-xs sm:text-sm text-slate-500'>{item.category}</p>
                                                <p className='text-xs sm:text-sm font-medium text-slate-700'>{currency}{item.price}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteItemFromCart(item.id)}
                                                className='text-red-500 hover:bg-red-50 p-1.5 rounded-full active:scale-95 transition-all ml-1 flex-shrink-0'
                                            >
                                                <Trash2Icon size={14} />
                                            </button>
                                        </div>

                                        {/* Quantity and Total */}
                                        <div className='flex justify-between items-center'>
                                            <div className='flex items-center gap-1.5 sm:gap-2'>
                                                <span className='text-xs sm:text-sm text-slate-600'>Qty:</span>
                                                <Counter productId={item.id} />
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-medium text-slate-900 text-sm sm:text-base'>{currency}{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className='w-full xl:w-96 xl:flex-shrink-0 xl:order-last'>
                        <OrderSummary
                            totalPrice={totalPrice}
                            items={cartArray}
                            onPlaceOrder={() => setShowCheckoutModal(true)}
                        />
                    </div>
                </div>
            </div>

            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                cartItems={cartItems}
                totalPrice={totalPrice}
                currency={currency}
                products={products}
            />
        </div>
    ) : (
        <div className='min-h-[70vh] mx-2 sm:mx-4 flex items-center justify-center text-slate-400'>
            <div className='text-center'>
                <h1 className='text-xl sm:text-2xl lg:text-3xl font-semibold mb-2'>Your cart is empty</h1>
                <p className='text-sm sm:text-base text-slate-500'>Add some products to get started!</p>
            </div>
        </div>
    )
}
