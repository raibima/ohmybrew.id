import { Text, LinkCard } from "@/components/ui/ds";
import Image from "next/image";
import Link from "next/link";

export default function OrderPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-omb-red)]/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[color:var(--color-omb-electric-brew-blue)]/5 blur-3xl" />
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16">
        {/* Content container with entrance animation */}
        <div className="flex w-full max-w-md flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Back link */}
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 text-sm text-[color:var(--color-omb-warm-grey)] transition-colors hover:text-[color:var(--color-omb-soft-ink)]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to home
          </Link>

          {/* Brand heading */}
          <h1 className="mb-4 font-display text-5xl leading-tight text-[color:var(--color-omb-red)] sm:text-6xl">
            Order Now
          </h1>

          {/* Subtitle */}
          <Text
            variant="body"
            size="lg"
            align="center"
            tone="muted"
            className="mb-10 max-w-sm"
          >
            Get your favorite Oh My Brew coffee delivered through our partner
            platforms.
          </Text>

          {/* Link cards */}
          <div className="flex w-full flex-col gap-4">
            <LinkCard
              href="https://gofood.link/a/SharcAY"
              icon={
                <Image
                  src="/gojek.svg"
                  alt="Gojek"
                  width={28}
                  height={28}
                />
              }
              title="Order on GoFood"
              subtitle="Delivery via Gojek"
              external
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
            />
            <LinkCard
              href="https://r.grab.com/g/2-1-6-C4NFSBXTBCAWGX"
              icon={
                <Image
                  src="/grab.svg"
                  alt="Grab"
                  width={28}
                  height={28}
                />
              }
              title="Order on GrabFood"
              subtitle="Delivery via Grab"
              external
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
            />
          </div>

          {/* Footer note */}
          <Text
            variant="caption"
            size="sm"
            align="center"
            tone="muted"
            className="mt-10"
          >
            Located in BSD, Tangerang
          </Text>
        </div>
      </main>
    </div>
  );
}
