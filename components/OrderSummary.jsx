import { SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const OrderSummary = ({ totalPrice, items, onPlaceOrder }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const addressList = useSelector(state => state.address.list);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');

    const handleCouponCode = async (event) => {
        event.preventDefault();

        if (!couponCodeInput.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api';

        // Get storeId from first item (assuming single store cart)
        const storeId = items[0]?.storeId;
        const productIds = items.map(item => item.id);
        const orderSubTotal = totalPrice;

        try {
            const response = await fetch(`${API_BASE_URL}/coupons/${couponCodeInput}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    storeId,
                    productIds,
                    orderSubTotal
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setCoupon(result.data);
                setCouponCodeInput('');
                toast.success('Coupon applied successfully!');
            } else {
                toast.error(result.message || 'Invalid coupon code');
            }
        } catch (error) {
            console.error('Coupon validation error:', error);
            toast.error('Failed to validate coupon. Please try again.');
        }
    }

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        if (onPlaceOrder) {
            onPlaceOrder();
        }
    }

    return (
        <div className='w-full lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
            <h2 className='text-xl font-medium text-slate-600'>Payment Summary</h2>
            <p className='text-slate-400 text-xs my-4'>Payment Method</p>
            <div className='flex gap-2 items-center'>
                <input type="radio" id="COD" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} className='accent-gray-500' />
                <label htmlFor="COD" className='cursor-pointer'>COD</label>
            </div>
            <div className='flex gap-2 items-center mt-1'>
                <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='accent-gray-500' />
                <label htmlFor="STRIPE" className='cursor-pointer'>Stripe Payment</label>
            </div>
            <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
            </div>
            <div className='pb-4 border-b border-slate-200'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 text-slate-400'>
                        <p>Subtotal:</p>
                        <p>Shipping:</p>
                        {coupon && <p>Coupon:</p>}
                    </div>
                    <div className='flex flex-col gap-1 font-medium text-right'>
                        <p>{currency}{totalPrice.toLocaleString()}</p>
                        <p>Free</p>
                        {coupon && <p>{`-${currency}${(coupon.discount / 100 * totalPrice).toFixed(2)}`}</p>}
                    </div>
                </div>
                {
                    !coupon ? (
                        <form onSubmit={e => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })} className='flex justify-center gap-3 mt-3'>
                            <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Coupon Code' className='border border-slate-400 p-1.5 rounded w-full outline-none' />
                            <button className='bg-[#5c3aec] text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>Apply</button>
                        </form>
                    ) : (
                        <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
                            <p>Code: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
                            <p>{coupon.description}</p>
                            <XIcon size={18} onClick={() => setCoupon('')} className='hover:text-red-700 transition cursor-pointer' />
                        </div>
                    )
                }
            </div>
            <div className='flex justify-between py-4'>
                <p>Total:</p>
                <p className='font-medium text-right'>{currency}{coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)).toFixed(2) : totalPrice.toLocaleString()}</p>
            </div>
            <button onClick={handlePlaceOrder} className='w-full bg-[#5c3aec] text-white py-2.5 rounded hover:bg-[#3525b8] active:scale-95 transition-all'>Place Order</button>

        </div>
    )
}

export default OrderSummary