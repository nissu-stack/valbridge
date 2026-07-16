export default function ProductLoading() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="h-96 w-full animate-pulse rounded-2xl bg-zinc-200" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />
            <div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-200" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-zinc-200" />
          <div className="h-32 animate-pulse rounded-2xl bg-zinc-200" />
        </div>
      </div>
    </main>
  );
}
