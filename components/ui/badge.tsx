import { cn } from "@/lib/utils";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--gold)] bg-[rgba(201,150,43,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold-light)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
