import { cn } from '@/lib/cn';

export function Spinner({
  className,
  label = 'Loading',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block size-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800',
        className,
      )}
    />
  );
}

export function PageLoader({
  label = 'Loading…',
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-h-[12rem] flex-col items-center justify-center gap-3 text-slate-500',
        className,
      )}
    >
      <Spinner className="size-7 border-[2.5px]" label={label} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ButtonSpinner({ className }: { className?: string }) {
  return (
    <Spinner
      className={cn('size-4 border-white/40 border-t-white', className)}
      label="Working"
    />
  );
}
