const DashboardSkeleton = ({
  type = 'default',
  showHeader = true,
  showStats = true,
  showSearch = false,
  showGrid = false,
  gridItems = 6,
  statsCount = 4
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
          {type === 'employer' && (
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          )}
        </div>
      )}

      {/* Stats Cards */}
      {showStats && (
        <div className={`grid grid-cols-2 lg:grid-cols-${statsCount} gap-4`}>
          {Array.from({ length: statsCount }, (_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search and Filters */}
      {showSearch && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      {showGrid && (
        <div className={`grid grid-cols-1 ${type === 'employer' ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {Array.from({ length: gridItems }, (_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 space-y-4">
                {/* Header section */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Stats */}
                {type === 'employer' && (
                  <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
                    <div className="text-center space-y-1">
                      <div className="h-5 w-8 bg-gray-200 rounded animate-pulse mx-auto" />
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
                    </div>
                    <div className="text-center space-y-1">
                      <div className="h-5 w-8 bg-gray-200 rounded animate-pulse mx-auto" />
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
                  {type === 'employer' && (
                    <>
                      <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
                      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* For dashboard page specific layout */}
      {type === 'dashboard' && (
        <>
          {/* User Header */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center gap-4">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-2 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="hidden md:flex flex-col gap-2 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Chart and Usage Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-64 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardSkeleton
