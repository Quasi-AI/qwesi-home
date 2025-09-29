import SkeletonLoader from '@/components/SkeletonLoader'

const DashboardCardSkeleton = ({ type = 'default' }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Header section */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <SkeletonLoader className="w-12 h-12 rounded-lg flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <SkeletonLoader className="h-5 w-32" />
              <SkeletonLoader className="h-4 w-24" />
              <SkeletonLoader className="h-3 w-20" />
            </div>
          </div>
          <SkeletonLoader className="h-6 w-16 rounded-full" />
        </div>

        {/* Details */}
        <div className="space-y-2">
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-3/4" />
          <SkeletonLoader className="h-4 w-1/2" />
        </div>

        {/* Stats */}
        {type === 'employer' && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
            <div className="text-center space-y-1">
              <SkeletonLoader className="h-5 w-8 mx-auto" />
              <SkeletonLoader className="h-3 w-16 mx-auto" />
            </div>
            <div className="text-center space-y-1">
              <SkeletonLoader className="h-5 w-8 mx-auto" />
              <SkeletonLoader className="h-3 w-16 mx-auto" />
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <SkeletonLoader className="w-4 h-4" />
            <SkeletonLoader className="h-4 w-8" />
            <SkeletonLoader className="h-3 w-12" />
          </div>
          <SkeletonLoader className="h-3 w-20" />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <SkeletonLoader className="h-8 flex-1" />
          {type === 'employer' && (
            <>
              <SkeletonLoader className="h-8 flex-1" />
              <SkeletonLoader className="h-8 w-20" />
              <SkeletonLoader className="h-8 w-20" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardCardSkeleton
