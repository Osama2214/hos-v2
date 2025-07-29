export default function AppointmentsLoading() {
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

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-8 w-12 bg-muted animate-pulse rounded mb-1" />
            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>

      <div className="border rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-64 bg-muted animate-pulse rounded" />
              <div className="h-10 w-20 bg-muted animate-pulse rounded" />
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>

        <div className="border-t">
          <div className="grid grid-cols-8 gap-4 p-4 border-b bg-muted/50">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted animate-pulse rounded" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-8 gap-4 p-4 border-b">
              {Array.from({ length: 8 }).map((_, j) => (
                <div key={j} className="h-4 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
