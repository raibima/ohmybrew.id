import Link from "next/link";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-omb-red)]/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[color:var(--color-omb-electric-brew-blue)]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 border-b border-[color:var(--color-omb-warm-grey)]/40 pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-[color:var(--color-omb-warm-grey)]">
              Oh My Brew Journal
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[color:var(--color-omb-soft-ink)]">
              Notes on coffee, menu ideas, and the small decisions behind the brew.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 rounded-full border border-[color:var(--color-omb-warm-grey)]/50 bg-[color:var(--color-omb-off-white)] px-4 py-2 text-sm font-medium text-[color:var(--color-omb-soft-ink)] transition-colors hover:border-[color:var(--color-omb-red)] hover:text-[color:var(--color-omb-red)]"
          >
            Back home
          </Link>
        </header>

        <main className="flex-1 py-10">{children}</main>
      </div>
    </div>
  );
}
