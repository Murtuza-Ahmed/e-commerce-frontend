import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-sm bg-muted" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="animate-pulse space-y-2 mb-8">
      <div className="h-3 w-12 rounded bg-muted" />
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="h-4 w-24 rounded bg-muted" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="animate-pulse">
        <div className="border-b border-border px-4 py-3 flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-3 w-20 rounded bg-muted" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="border-b border-border last:border-0 px-4 py-4 flex gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className={cn("h-4 rounded bg-muted", c === 0 ? "w-32" : "w-16")} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
