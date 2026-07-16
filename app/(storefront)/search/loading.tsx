export default function SearchLoading() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-8">
      <div className="h-10 w-1/2 animate-pulse rounded bg-zinc-200" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-2xl bg-zinc-200" />
        ))}
      </div>
    </main>
  );
}
