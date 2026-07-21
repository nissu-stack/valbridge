export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-[var(--panel)] px-5 pb-16 pt-[116px] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1240px] animate-pulse gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:gap-20">
        <div className="grid gap-4 sm:grid-cols-[72px_minmax(0,1fr)]">
          <div className="hidden space-y-3 sm:block">
            {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-[88px] bg-[var(--graphite)]" />)}
          </div>
          <div className="aspect-[4/5] bg-[var(--panel2)]" />
        </div>
        <div className="space-y-6 pt-3">
          <div className="h-3 w-36 bg-[var(--graphite)]" />
          <div className="h-14 w-4/5 bg-[var(--graphite)]" />
          <div className="h-8 w-36 bg-[var(--graphite)]" />
          <div className="h-24 w-full bg-[var(--graphite)]" />
          <div className="h-12 w-full bg-[var(--graphite)]" />
          <div className="h-12 w-full bg-[var(--gold-deep)]" />
        </div>
      </div>
    </main>
  );
}
