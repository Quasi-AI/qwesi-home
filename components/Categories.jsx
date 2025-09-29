'use client'

import { useState, Suspense } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

// Separate the component that uses useSearchParams
function CategoriesContent({ products = [], onCategorySelect }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''
  const [expanded, setExpanded] = useState(true)

  // Get unique categories with counts
  const categoryCounts = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const categories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', category)
    params.delete('page') // Reset pagination on filter change
    router.push(`/shop?${params.toString()}`)
    if (onCategorySelect) onCategorySelect(category)
  }

  const clearCategory = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
    if (onCategorySelect) onCategorySelect('')
  }

  if (categories.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded-lg hover:bg-gray-100"
        >
          {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {expanded && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map(({ name, count }) => (
            <button
              key={name}
              onClick={() => handleCategoryClick(name)}
              className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                currentCategory === name
                  ? 'bg-[#5C3AEB] text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">{name}</span>
              <span className={`text-sm ${
                currentCategory === name ? 'text-white/80' : 'text-gray-500'
              }`}>
                ({count})
              </span>
            </button>
          ))}
        </div>
      )}

      {currentCategory && (
        <button
          onClick={clearCategory}
          className="mt-3 w-full bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-100 transition-colors"
        >
          Clear Category Filter
        </button>
      )}
    </div>
  )
}

// Loading fallback component
function CategoriesLoading() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}

// Main component wrapped with Suspense
const Categories = ({ products = [], onCategorySelect }) => {
  return (
    <Suspense fallback={<CategoriesLoading />}>
      <CategoriesContent products={products} onCategorySelect={onCategorySelect} />
    </Suspense>
  )
}

export default Categories