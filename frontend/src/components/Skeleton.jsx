// Skeleton Components for Loading States

// Base skeleton element
const SkeletonBase = ({ className = "", width = "full" }) => {
  const widthClasses = {
    full: "w-full",
    "1/4": "w-1/4",
    "1/3": "w-1/3", 
    "1/2": "w-1/2",
    "2/3": "w-2/3",
    "3/4": "w-3/4",
    "16": "w-16",
    "20": "w-20",
    "24": "w-24",
    "32": "w-32"
  }

  return (
    <div className={`animate-pulse bg-slate-200 rounded ${widthClasses[width]} ${className}`} />
  )
}

// Stats Cards Skeleton (for Dashboard)
export const SkeletonStatsCards = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 min-[2178px]:grid-cols-6 gap-4 sm:gap-6 mb-6 lg:mb-8 px-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg border-2 border-slate-100 p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <SkeletonBase className="h-3 mb-2" width="2/3" />
            <SkeletonBase className="h-6 sm:h-8" width="1/2" />
          </div>
          <div className="flex-shrink-0">
            <SkeletonBase className="h-12 w-12 rounded-2xl" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

// Chart Skeleton
export const SkeletonChart = ({ height = "300px" }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-3 sm:p-4 lg:p-6">
    <SkeletonBase className="h-4 mb-4" width="1/3" />
    <div className="space-y-3" style={{ height }}>
      <div className="flex items-end justify-between h-full space-x-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <SkeletonBase 
            key={index}
            className="w-full"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
    </div>
  </div>
)

// Table Skeleton
export const SkeletonTable = ({ columns = 5, rows = 3 }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-slate-50">
        <tr>
          {Array.from({ length: columns }).map((_, index) => (
            <th key={index} className="px-4 py-3">
              <SkeletonBase className="h-3" width="3/4" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex} className={`border-b border-slate-100 ${
            rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
          }`}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex} className="px-4 py-3">
                {colIndex === columns - 1 ? (
                  // Actions column
                  <div className="flex justify-center gap-1">
                    <SkeletonBase className="h-8 w-8 rounded-lg" />
                    <SkeletonBase className="h-8 w-8 rounded-lg" />
                    <SkeletonBase className="h-8 w-8 rounded-lg" />
                  </div>
                ) : colIndex === 0 ? (
                  // First column (usually has image/icon + text)
                  <div className="flex items-center gap-3">
                    <SkeletonBase className="h-10 w-10 rounded-lg" />
                    <div className="flex-1">
                      <SkeletonBase className="h-3 mb-1" width="3/4" />
                      <SkeletonBase className="h-2" width="1/2" />
                    </div>
                  </div>
                ) : (
                  // Regular columns
                  <SkeletonBase className="h-6 rounded-full" width="3/4" />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// Products Table Skeleton (specific to Products page)
export const SkeletonProductsTable = () => (
  <SkeletonTable columns={5} rows={3} />
)

// Purchases Table Skeleton
export const SkeletonPurchasesTable = () => (
  <SkeletonTable columns={7} rows={3} />
)

// Sales Table Skeleton  
export const SkeletonSalesTable = () => (
  <SkeletonTable columns={6} rows={3} />
)

// Suppliers Table Skeleton
export const SkeletonSuppliersTable = () => (
  <SkeletonTable columns={5} rows={3} />
)

// Carousel Skeleton (for mobile views)
export const SkeletonCarousel = ({ itemCount = 3 }) => (
  <div className="px-3 sm:px-4 lg:px-6 py-6">
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index} className="flex-shrink-0 w-full sm:w-1/2">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-4 h-full">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <SkeletonBase className="h-8 w-8 rounded-lg" />
                <SkeletonBase className="h-3" width="16" />
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <SkeletonBase className="h-4 w-4" />
                <div className="flex-1">
                  <SkeletonBase className="h-3 mb-1" width="3/4" />
                  <SkeletonBase className="h-2" width="1/2" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SkeletonBase className="h-4 w-4" />
                <SkeletonBase className="h-3" width="2/3" />
              </div>
              <div className="flex justify-between">
                <div>
                  <SkeletonBase className="h-2 mb-1" width="16" />
                  <SkeletonBase className="h-3" width="20" />
                </div>
                <div>
                  <SkeletonBase className="h-2 mb-1" width="16" />
                  <SkeletonBase className="h-3" width="20" />
                </div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <SkeletonBase className="h-2 mb-1" width="1/3" />
                <SkeletonBase className="h-4" width="1/2" />
              </div>
            </div>
            <div className="flex justify-end gap-1 pt-3 border-t border-slate-200">
              <SkeletonBase className="h-8 w-8 rounded-lg" />
              <SkeletonBase className="h-8 w-8 rounded-lg" />
              <SkeletonBase className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Form Modal Skeleton
export const SkeletonModal = () => (
  <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4">
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <SkeletonBase className="h-10 w-10 rounded-lg" />
          <div>
            <SkeletonBase className="h-6 mb-1" width="32" />
            <SkeletonBase className="h-3" width="24" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonBase className="h-14 rounded-xl" />
            <SkeletonBase className="h-14 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonBase className="h-14 rounded-xl" />
            <SkeletonBase className="h-14 rounded-xl" />
          </div>
          <SkeletonBase className="h-32 rounded-xl" />
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <SkeletonBase className="h-12 rounded-lg" width="32" />
            <SkeletonBase className="h-12 rounded-lg" width="24" />
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Full Page Loading Skeleton
export const SkeletonPage = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <SkeletonBase className="h-8 w-48 mx-auto mb-2" />
      <SkeletonBase className="h-4 w-32 mx-auto" />
    </div>
  </div>
)