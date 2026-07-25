import { cn } from '@/lib/cn';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200/90',
        className,
      )}
      {...props}
    />
  );
}

export function TableSkeleton({
  rows = 6,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="grid gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:grid-cols-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-20" />
        ))}
      </div>
      <ul className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, row) => (
          <li
            key={row}
            className="grid items-center gap-3 px-4 py-3.5 sm:grid-cols-4"
          >
            {Array.from({ length: cols }).map((_, col) => (
              <Skeleton
                key={col}
                className={cn('h-3', col === 0 ? 'w-[75%]' : 'w-1/2')}
              />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div className="mt-6 max-w-2xl space-y-4 rounded-md border border-slate-200 bg-white p-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({
  cards = 4,
}: {
  cards?: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={i}
          className="rounded-md border border-slate-200 bg-white p-4"
        >
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-3 h-8 w-12" />
        </div>
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </div>
  );
}
