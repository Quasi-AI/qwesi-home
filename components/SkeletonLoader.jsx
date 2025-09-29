const LoaderSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-4 bg-gray-200 rounded w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-4 bg-gray-200 rounded w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-4 bg-gray-200 rounded w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-28"></div>
        </div>
      </div>
      <div className="h-12 bg-gray-200 rounded mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-8"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  )

export default LoaderSkeleton;