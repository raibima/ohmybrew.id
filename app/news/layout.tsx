export default function NewsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-full flex-1 overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-omb-red)]/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[color:var(--color-omb-electric-brew-blue)]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-5xl flex-1 flex-col px-6 py-10 sm:px-8 lg:px-12">
        <header className="border-b border-[color:var(--color-omb-warm-grey)]/40 pb-6">
          <p className="text-sm uppercase tracking-[0.16em] text-[color:var(--color-omb-warm-grey)]">
            Oh My Brew News
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[color:var(--color-omb-soft-ink)]">
            Notes on coffee, menu ideas, and the small decisions behind the brew.
          </p>
        </header>

        <main className="flex-1 py-10">{children}</main>
      </div>
    </div>
  );
}
