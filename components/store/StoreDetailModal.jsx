import { X, MapPin, Globe, Phone, Mail, Calendar, Clock, CreditCard, Users, Building, FileText, ExternalLink, Eye, Package, ShoppingCart, TrendingUp } from "lucide-react"
import Image from "next/image"

const StoreDetailModal = ({ store, isOpen, onClose }) => {
    if (!isOpen || !store) return null

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getSocialIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case 'facebook': return '📘'
            case 'instagram': return '📷'
            case 'twitter': return '🐦'
            case 'linkedin': return '💼'
            default: return '🔗'
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                            {store.logo ? (
                                <Image
                                    src={store.logo}
                                    alt={store.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Building size={32} className="text-slate-600" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{store.name}</h2>
                            <p className="text-slate-600">{store.description}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X size={24} className="text-slate-600" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="space-y-8">
                        {/* Store Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Package size={20} className="text-blue-600" />
                                    <span className="text-sm font-medium text-blue-800">Products</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900">{store.productCount || 0}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShoppingCart size={20} className="text-green-600" />
                                    <span className="text-sm font-medium text-green-800">Orders</span>
                                </div>
                                <p className="text-2xl font-bold text-green-900">{store.orderCount || 0}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp size={20} className="text-purple-600" />
                                    <span className="text-sm font-medium text-purple-800">Revenue</span>
                                </div>
                                <p className="text-2xl font-bold text-purple-900">{currency}{(store.totalRevenue || 0).toFixed(2)}</p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye size={20} className="text-orange-600" />
                                    <span className="text-sm font-medium text-orange-800">Status</span>
                                </div>
                                <p className={`text-lg font-bold ${store.isActive ? 'text-green-900' : 'text-red-900'}`}>
                                    {store.isActive ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-slate-800 border-b pb-2">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    {store.address && (
                                        <div className="flex items-start gap-3">
                                            <MapPin size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Address</p>
                                                <p className="text-slate-600">{store.address}</p>
                                            </div>
                                        </div>
                                    )}

                                    {store.metadata?.country && (
                                        <div className="flex items-center gap-3">
                                            <Globe size={20} className="text-blue-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Location</p>
                                                <p className="text-slate-600">
                                                    {store.metadata.city && `${store.metadata.city}, `}{store.metadata.country}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <Calendar size={20} className="text-blue-600 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Created</p>
                                            <p className="text-slate-600">{formatDate(store.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {store.contact && (
                                        <div className="flex items-center gap-3">
                                            <Phone size={20} className="text-blue-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Phone</p>
                                                <p className="text-slate-600">{store.contact}</p>
                                            </div>
                                        </div>
                                    )}

                                    {store.metadata?.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail size={20} className="text-blue-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Email</p>
                                                <p className="text-slate-600">{store.metadata.email}</p>
                                            </div>
                                        </div>
                                    )}

                                    {store.metadata?.website && (
                                        <div className="flex items-center gap-3">
                                            <ExternalLink size={20} className="text-blue-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Website</p>
                                                <a
                                                    href={store.metadata.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 underline"
                                                >
                                                    {store.metadata.website}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Business Details */}
                        {(store.metadata?.businessType || store.metadata?.category || store.metadata?.employeeCount || store.metadata?.yearEstablished) && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-slate-800 border-b pb-2">Business Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        {store.metadata?.businessType && (
                                            <div className="flex items-center gap-3">
                                                <Building size={20} className="text-blue-600 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">Business Type</p>
                                                    <p className="text-slate-600">{store.metadata.businessType}</p>
                                                </div>
                                            </div>
                                        )}

                                        {store.metadata?.category && (
                                            <div className="flex items-center gap-3">
                                                <Package size={20} className="text-blue-600 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">Category</p>
                                                    <p className="text-slate-600">{store.metadata.category}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {store.metadata?.employeeCount && (
                                            <div className="flex items-center gap-3">
                                                <Users size={20} className="text-blue-600 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">Employee Count</p>
                                                    <p className="text-slate-600">{store.metadata.employeeCount}</p>
                                                </div>
                                            </div>
                                        )}

                                        {store.metadata?.yearEstablished && (
                                            <div className="flex items-center gap-3">
                                                <Calendar size={20} className="text-blue-600 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">Year Established</p>
                                                    <p className="text-slate-600">{store.metadata.yearEstablished}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {(store.metadata?.taxId || store.metadata?.businessLicense) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                                        {store.metadata?.taxId && (
                                            <div className="flex items-center gap-3">
                                                <FileText size={20} className="text-blue-600 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">Tax ID</p>
                                                    <p className="text-slate-600">{store.metadata.taxId}</p>
                                                </div>
                                            </div>
                                        )}

                                        {store.metadata?.businessLicense && (
                                            <div className="flex items-center gap-3">
                                                <FileText size={20} className="text-blue-600 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">Business License</p>
                                                    <p className="text-slate-600">{store.metadata.businessLicense}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Payment Methods */}
                        {store.metadata?.paymentMethods && store.metadata.paymentMethods.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-slate-800 border-b pb-2">Payment Methods</h3>
                                <div className="flex flex-wrap gap-2">
                                    {store.metadata.paymentMethods.map((method, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg">
                                            <CreditCard size={16} className="text-slate-600" />
                                            <span className="text-sm text-slate-700">{method}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Media */}
                        {store.metadata?.socialMedia && Object.values(store.metadata.socialMedia).some(link => link) && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-slate-800 border-b pb-2">Social Media</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(store.metadata.socialMedia).map(([platform, link]) => (
                                        link && (
                                            <a
                                                key={platform}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <span className="text-xl">{getSocialIcon(platform)}</span>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700 capitalize">{platform}</p>
                                                    <p className="text-xs text-slate-600 truncate">{link}</p>
                                                </div>
                                                <ExternalLink size={16} className="text-slate-400 ml-auto flex-shrink-0" />
                                            </a>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Business Hours */}
                        {store.metadata?.businessHours && Object.values(store.metadata.businessHours).some(hours => hours) && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-slate-800 border-b pb-2">Business Hours</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                                        const hours = store.metadata.businessHours[day]
                                        return hours ? (
                                            <div key={day} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <span className="text-sm font-medium text-slate-700 capitalize w-20">{day}</span>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-slate-600" />
                                                    <span className="text-sm text-slate-600">{hours}</span>
                                                </div>
                                            </div>
                                        ) : null
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreDetailModal
