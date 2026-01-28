export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-gray-200"></div>

        <div className="mb-8 flex gap-2">
          <div className="h-10 flex-1 animate-pulse rounded bg-gray-200"></div>
          <div className="h-10 w-20 animate-pulse rounded bg-gray-200"></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-between rounded-lg bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-64 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
