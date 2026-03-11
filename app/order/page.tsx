import { Text, LinkCard } from "@/components/ui/ds";
import Image from "next/image";

// Feature flag: set to true when GrabFood integration is ready
const GRABFOOD_ENABLED = true;

export default function OrderPage() {
  return (
    <div className="relative min-h-full flex-1 overflow-hidden bg-background">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-(--color-omb-red)/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-omb-electric-brew-blue/5 blur-3xl" />
      </div>

      <main className="relative flex min-h-full flex-1 flex-col items-center justify-center px-6 py-16">
        {/* Content container with entrance animation */}
        <div className="flex w-full max-w-md flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Brand heading */}
          <h1 className="mb-4 font-display text-5xl leading-tight text-(--color-omb-red) sm:text-6xl">
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
                  className={!GRABFOOD_ENABLED ? "grayscale" : undefined}
                />
              }
              title={GRABFOOD_ENABLED ? "Order on GrabFood" : "GrabFood — Coming Soon"}
              subtitle={GRABFOOD_ENABLED ? "Delivery via Grab" : "Stay tuned!"}
              external
              disabled={!GRABFOOD_ENABLED}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
            />
            <LinkCard
              href="/catering"
              icon={
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-(--color-omb-red)/10 text-(--color-omb-red)">
                  <span className="text-xs font-semibold">☕</span>
                </div>
              }
              title="Corporate & Event Catering"
              subtitle="Coffee setups for offices & events"
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
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
