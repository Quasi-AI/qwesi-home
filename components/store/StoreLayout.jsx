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

    return loading ? (
        <Loading />
    ) : isSeller ? (
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