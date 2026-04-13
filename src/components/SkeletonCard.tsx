export const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg animate-pulse">
    {/* Header skeleton */}
    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-3/4"></div>

    {/* Description skeleton */}
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-5/6"></div>

    {/* Pricing skeleton */}
    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>

    {/* Features skeleton */}
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
    </div>

    {/* Button skeleton */}
    <div className="h-10 bg-slate-300 dark:bg-slate-600 rounded-lg w-full"></div>
  </div>
);
