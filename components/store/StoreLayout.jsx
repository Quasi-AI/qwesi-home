'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import Navbar from "../Navbar"
import SellerSidebar from "./StoreSidebar"
import { readAuth, validateStoredToken } from "@/lib/auth"

const StoreLayout = ({ children }) => {


    const [isSeller, setIsSeller] = useState(false)
    const [loading, setLoading] = useState(true)
    const [storeInfo, setStoreInfo] = useState(null)

    useEffect(() => {
        const init = async () => {
            const auth = readAuth()
            if (!auth?.user) { setIsSeller(false); setLoading(false); return }
            const valid = await validateStoredToken()
            if (!valid.valid) { setIsSeller(false); setLoading(false); return }
            setIsSeller(true)
            setStoreInfo(null)
            setLoading(false)
        }
        init()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col h-screen bg-gray-50">
                {/* Navbar Placeholder */}
                <div className="h-16 bg-white border-b border-slate-200"></div>
                
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Placeholder */}
                    <div className="w-64 lg:w-60 xl:w-64 bg-white border-r border-slate-200">
                        <div className="p-4 space-y-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-8 bg-slate-200 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Main Content Skeleton */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        <div className="space-y-6">
                            {/* Header Skeleton */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <div className="h-8 w-48 bg-slate-200 rounded-lg mb-2 animate-pulse"></div>
                                    <div className="h-5 w-64 bg-slate-200 rounded-lg animate-pulse"></div>
                                </div>
                                <div className="h-10 w-40 bg-slate-200 rounded-lg animate-pulse"></div>
                            </div>

                            {/* Stats Cards Skeleton */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
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

                            {/* Content Grid Skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
                                        <div className="space-y-3">
                                            <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                                            <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                                            <div className="h-20 bg-slate-200 rounded-lg"></div>
                                            <div className="flex gap-2">
                                                <div className="flex-1 h-8 bg-slate-200 rounded"></div>
                                                <div className="w-8 h-8 bg-slate-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return isSeller ? (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <SellerSidebar storeInfo={storeInfo} />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
            <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full">
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default StoreLayout