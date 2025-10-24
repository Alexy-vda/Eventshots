export default function Loading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header Skeleton */}
      <header className="bg-white shadow-sm border-b-2 border-sage/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="h-4 w-32 bg-sage/20 rounded animate-pulse"></div>
        </div>
      </header>

      {/* Content Skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
          {/* Title Skeleton */}
          <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>

          {/* Description Skeleton */}
          <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Info Skeleton */}
          <div className="flex gap-4">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Gallery Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-cream rounded animate-pulse border-2 border-sage/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
