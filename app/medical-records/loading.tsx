export default function MedicalRecordsLoading() {
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

      <div className="flex space-x-1 mb-4">
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        <div className="h-10 w-40 bg-muted animate-pulse rounded" />
      </div>

      <div className="border rounded-lg">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 bg-muted animate-pulse rounded" />
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-4 w-48 bg-muted animate-pulse rounded mb-4" />

          <div className="flex items-center space-x-2 mb-4">
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            <div className="h-10 w-64 bg-muted animate-pulse rounded" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-3 w-24 bg-muted animate-pulse rounded mb-1" />
                    <div className="h-3 w-28 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
