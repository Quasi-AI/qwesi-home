'use client'
import { useSelector } from "react-redux"
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { useAuthStore } from '@/stores/authStore'
import Loading from "@/components/Loading"
import { authFetch } from '@/lib/auth'

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function Orders() {
    const { user, initAuth } = useAuthStore()
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);

    const getUserIdentifier = () => {
        if (user?.id) return user.id;
        if (user?._id) return user._id;
        if (user?.uid) return user.uid;
        if (user?.userId) return user.userId;
        return null;
    };

    const userId = getUserIdentifier();

    useEffect(() => {
        initAuth();
    }, []);

    useEffect(() => {
        const fetchUserOrders = async () => {
            if (userId) {
                setLoading(true)
                try {
                    console.log('Fetching orders for userId:', userId); // Debug log
                    const response = await authFetch(`${API_BASE_URL}/orders/user/${userId}`);
                    console.log('API Response status:', response.status); // Debug log
                    if (response.ok) {
                        const data = await response.json();
                        console.log('API Response data:', data); // Debug log
                        setOrders(data.data || data);
                    } else {
                        console.error('Failed to fetch orders');
                        setOrders([]);
                    }
                } catch (err) {
                    console.error('Error fetching orders:', err);
                    setOrders([]);
                }
                setLoading(false)
            } else {
                console.log('No valid userId found, skipping fetch'); // Debug log
                setOrders([]);
                setLoading(false);
            }
        }
        fetchUserOrders();
    }, [userId]);

    if (loading) return <Loading />

    return (
        <div className="min-h-[70vh] mx-6" >
            {orders && orders.length > 0 ?
                <div className="my-20 max-w-7xl mx-auto">
                    <PageTitle heading="My Orders" text={`Showing total ${orders.length} orders`} linkText={'Go to home'} />

                    <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                        <thead>
                            <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                <th className="text-left">Product</th>
                                <th className="text-center">Total Price</th>
                                <th className="text-left">Address</th>
                                <th className="text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                return (
                                    <OrderItem order={order} key={order._id} />
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                :
                <div className="min-h-[80vh] mx-6 flex items-center justify-center">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400 mb-2">You have no orders</h1>
                        <p className="text-slate-600">All your orders will show up here</p>
                    </div>
                </div>
            }
        </div>
    )
}