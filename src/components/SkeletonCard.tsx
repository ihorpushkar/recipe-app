export default function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-64 sm:h-72 bg-gray-300">
        {/* Category Badge Skeleton */}
        <div className="absolute top-4 left-4">
          <div className="bg-gray-400 text-white text-sm font-medium px-3 py-1 rounded-full w-20 h-6"></div>
        </div>
        
        {/* Gradient Overlay Skeleton */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
      </div>

      {/* Content Skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-400 rounded mb-2 w-3/4"></div>
        <div className="h-6 bg-gray-400 rounded w-1/2"></div>
        
        {/* Meta Skeleton */}
        <div className="flex items-center space-x-4 mt-3">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <div className="h-4 bg-gray-400 rounded w-16"></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <div className="h-4 bg-gray-400 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
