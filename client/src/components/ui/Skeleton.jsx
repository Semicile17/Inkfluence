export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-ink/[0.07] ${className}`} />;
}

export function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center gap-3 pt-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 py-10">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-4/5" />
      <Skeleton className="h-5 w-full" />
      <div className="flex items-center gap-3 py-4">
        <Skeleton className="h-11 w-11 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="aspect-[16/8] w-full rounded-3xl" />
      <div className="space-y-3 pt-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className={`h-3.5 ${index % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}
