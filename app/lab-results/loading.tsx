export default function LabResultsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-muted animate-pulse rounded" />
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-16 bg-muted animate-pulse rounded" />
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-8 w-8 bg-muted animate-pulse rounded mb-1" />
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>

      <div className="border rounded-lg">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-1 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-32 bg-muted animate-pulse rounded" />
        ))}
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="h-6 w-48 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded mb-1" />
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-10 w-28 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="text-center p-2 bg-muted rounded">
                    <div className="h-3 w-16 bg-muted-foreground/20 animate-pulse rounded mb-1 mx-auto" />
                    <div className="h-4 w-12 bg-muted-foreground/20 animate-pulse rounded mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
