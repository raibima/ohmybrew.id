import type { Metadata } from "next";
import { Text } from "@/components/ui/ds/text";
import { StatusPill } from "@/components/ui/ds/status-pill";
import { OmbButton } from "@/components/ui/ds/button";

export const metadata: Metadata = {
  title:
    "Coffee Catering Jakarta — Corporate & Event | Oh My Brew",
  description:
    "Event coffee service and office coffee catering in Jakarta. Specialty coffee for launches, seminars, and offices. Catering kopi kantor dan acara. Barista bars, pre-batched, or coffee corner—email or WhatsApp to plan.",
};

const EMAIL_ADDRESS = "business@ohmybrew.id";
const WHATSAPP_LINK = "https://wa.me/6281994565124";

export default function CateringPage() {
  return (
    <div className="relative min-h-full flex-1 overflow-hidden bg-background">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 -top-40 h-80 w-80 rounded-full bg-(--color-omb-red)/5 blur-3xl" />
        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-omb-electric-brew-blue/5 blur-3xl" />
        <div className="absolute inset-x-10 bottom-0 h-32 rounded-t-[3rem] border border-dashed border-omb-warm-grey/40 bg-off-white/60" />
      </div>

      <main className="relative mx-auto flex min-h-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16 sm:px-8 lg:px-12">
        {/* Hero */}
        <section
          aria-labelledby="catering-hero-heading"
          className="grid gap-10 md:grid-cols-2 md:items-center"
        >
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none">
            <StatusPill className="mb-4">
              Corporate &amp; event catering
            </StatusPill>
            <h1
              id="catering-hero-heading"
              className="mb-4 font-display text-4xl leading-tight text-(--color-omb-red) sm:text-5xl"
            >
              Coffee catering{" "}
              <span className="underline decoration-omb-electric-brew-blue/60 decoration-2 underline-offset-4">
                Jakarta
              </span>{" "}
              for offices &amp; events.
            </h1>
            <Text
              variant="body"
              size="lg"
              tone="default"
              className="mb-6 max-w-xl"
            >
              Oh My Brew offers event coffee service and office coffee catering
              in Jakarta. Flexible formats,
              coffee-first menus, and a team that helps you plan the right
              setup.
            </Text>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <a href={`mailto:${EMAIL_ADDRESS}`}>
                <OmbButton variant="primary" size="lg">
                  Email our sales team
                </OmbButton>
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                <OmbButton variant="secondary" size="lg">
                  Chat via WhatsApp
                </OmbButton>
              </a>
            </div>
            <Text variant="caption" size="sm" tone="muted">
              Tell us about your event, headcount, and budget—we&apos;ll reply
              within one business day with options.
            </Text>
          </div>

          <div className="relative hidden min-h-[260px] md:block">
            <div className="absolute inset-0 rounded-3xl border border-omb-warm-grey/40 bg-off-white/90 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <Text
                  as="p"
                  variant="eyebrow"
                  size="sm"
                  tone="brand"
                  className="uppercase tracking-[0.16em]"
                >
                  Sample event setup
                </Text>
                <span className="rounded-full bg-(--color-omb-red)/10 px-3 py-1 text-xs font-medium text-(--color-omb-red)">
                  Jakarta office
                </span>
              </div>
              <Text
                as="p"
                variant="body"
                size="sm"
                tone="default"
                className="mb-3"
              >
                <span className="font-semibold">Friday Coffee Ritual</span>{" "}
                — 80 cups | 2 baristas | 3-hour service window.
              </Text>
              <ul className="mb-4 space-y-1.5 text-xs text-(--color-omb-soft-ink)">
                <li>• Signature lattes &amp; black coffee menu</li>
                <li>• On-site pop-up bar with minimal footprint</li>
                <li>• Friendly baristas who can talk coffee (without the snob)</li>
              </ul>
              <Text variant="caption" size="xs" tone="muted">
                Every setup is customized. We adjust menu, headcount, and timing
                to match your event and budget.
              </Text>
            </div>
          </div>
        </section>

        {/* Who this is for — Office coffee catering & event coffee service */}
        <section aria-labelledby="catering-who-heading" className="space-y-6">
          <div className="max-w-2xl">
            <h2
              id="catering-who-heading"
              className="mb-2 font-display text-2xl text-(--color-omb-red)"
            >
              Office coffee catering &amp; event coffee service.
            </h2>
            <Text variant="body" size="md" tone="default">
              Coffee catering Jakarta for teams that care: if you&apos;re
              planning for people and want coffee that feels intentional—not an
              afterthought—we&apos;re for you.
            </Text>
            <Text variant="caption" size="sm" tone="muted" className="mt-2">
              Service area: Jakarta (and surrounding areas, subject to
              logistics).
            </Text>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-omb-warm-grey/40 bg-off-white/70 p-4">
              <Text as="h3" variant="heading" size="md" className="mb-2">
                Offices &amp; HR
              </Text>
              <ul className="space-y-1 text-sm text-(--color-omb-soft-ink)">
                <li>• All-hands &amp; town halls</li>
                <li>• People &amp; Culture rituals</li>
                <li>• Recurring &quot;coffee day&quot; in the office</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-omb-warm-grey/40 bg-off-white/70 p-4">
              <Text as="h3" variant="heading" size="md" className="mb-2">
                Events &amp; launches
              </Text>
              <ul className="space-y-1 text-sm text-(--color-omb-soft-ink)">
                <li>• Product launches &amp; media gatherings</li>
                <li>• Conferences, seminars, and meetups</li>
                <li>• Brand activations &amp; community nights</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-omb-warm-grey/40 bg-off-white/70 p-4">
              <Text as="h3" variant="heading" size="md" className="mb-2">
                Teams &amp; leaders
              </Text>
              <ul className="space-y-1 text-sm text-(--color-omb-soft-ink)">
                <li>• Offsites &amp; workshops</li>
                <li>• Team celebrations &amp; milestones</li>
                <li>• Client meetings that deserve good coffee</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          aria-labelledby="catering-how-heading"
          className="grid gap-8 rounded-3xl bg-off-white/80 p-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:p-8"
        >
          <div>
            <h2
              id="catering-how-heading"
              className="mb-2 font-display text-2xl text-(--color-omb-red)"
            >
              How it works
            </h2>
            <Text variant="body" size="md" tone="default" className="mb-4">
              No self-service checkout, no confusing packages. We keep it human
              and tailored—while still being efficient for busy teams.
            </Text>
            <ol className="space-y-3 text-sm text-(--color-omb-soft-ink)">
              <li>
                <span className="font-semibold text-(--color-omb-soft-ink)">
                  1. Reach out with your event details.
                </span>{" "}
                Share your date, location, estimated headcount, and any
                preferences via email or WhatsApp.
              </li>
              <li>
                <span className="font-semibold text-(--color-omb-soft-ink)">
                  2. We suggest formats &amp; menu options.
                </span>{" "}
                We&apos;ll propose 1–2 setups that fit your budget and the kind
                of experience you want.
              </li>
              <li>
                <span className="font-semibold text-(--color-omb-soft-ink)">
                  3. Confirm &amp; lock in logistics.
                </span>{" "}
                Once you&apos;re happy, we finalize timing, service style, and
                any branding touches.
              </li>
              <li>
                <span className="font-semibold text-(--color-omb-soft-ink)">
                  4. We brew, serve, and clean up.
                </span>{" "}
                Our team shows up ready with coffee, gear, and friendly faces so
                you can focus on the event.
              </li>
            </ol>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-dashed border-omb-warm-grey/60 bg-background/70 p-5">
            <div>
              <Text
                as="p"
                variant="eyebrow"
                size="sm"
                tone="brand"
                className="mb-1 uppercase tracking-[0.16em]"
              >
                Coffee-first menus
              </Text>
              <Text variant="body" size="sm" tone="default" className="mb-2">
                We build menus around our specialties:
              </Text>
              <ul className="mb-3 space-y-1 text-sm text-(--color-omb-soft-ink)">
                <li>• Signature white coffees: Creamy, Strong, Mint, Maple</li>
                <li>
                  • Signature black coffees: Iced Americano, Espresso Tonic,
                  Yuzu Americano
                </li>
                <li>• Classics: Long Black, Flat White, Cappuccino, Magic, Mocha</li>
              </ul>
              <Text variant="caption" size="xs" tone="muted">
                We can adjust sweetness, profiles, and menu breadth to match
                your guests and time window.
              </Text>
            </div>
            <div className="mt-3 border-t border-omb-warm-grey/40 pt-3">
              <Text variant="caption" size="sm" tone="muted">
                Planning for later? It&apos;s okay if your headcount or timing
                isn&apos;t final yet—reach out early and we&apos;ll refine
                details together.
              </Text>
            </div>
          </div>
        </section>

        {/* Example setups / use cases — event coffee service formats */}
        <section aria-labelledby="catering-examples-heading" className="space-y-6">
          <div className="max-w-2xl">
            <h2
              id="catering-examples-heading"
              className="mb-2 font-display text-2xl text-(--color-omb-red)"
            >
              Event coffee service: setups &amp; use cases
            </h2>
            <Text variant="body" size="md" tone="default">
              Every company and event is different, but these are some of the
              ways teams already work with us.
            </Text>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="flex flex-col rounded-2xl border border-omb-warm-grey/40 bg-off-white/80 p-4">
              <Text as="h3" variant="heading" size="md" className="mb-1">
                Office Coffee Bar
              </Text>
              <Text variant="caption" size="sm" tone="muted" className="mb-2">
                Pop-up bar in your office
              </Text>
              <Text variant="body" size="sm" tone="default" className="mb-2">
                For town halls, quarterly kickoffs, or People &amp; Culture
                days. 1–2 baristas serving a curated menu in your pantry or
                lobby area.
              </Text>
              <Text variant="caption" size="xs" tone="muted" className="mt-auto">
                Great for 40–150 guests depending on timing.
              </Text>
            </article>
            <article className="flex flex-col rounded-2xl border border-omb-warm-grey/40 bg-off-white/80 p-4">
              <Text as="h3" variant="heading" size="md" className="mb-1">
                Event Coffee Corner
              </Text>
              <Text variant="caption" size="sm" tone="muted" className="mb-2">
                Branded corner at your venue
              </Text>
              <Text variant="body" size="sm" tone="default" className="mb-2">
                A cozy corner for conferences, launches, and meetups with
                signage and menu boards that match your brand or event.
              </Text>
              <Text variant="caption" size="xs" tone="muted" className="mt-auto">
                Ideal when you want coffee to feel like part of the experience.
              </Text>
            </article>
            <article className="flex flex-col rounded-2xl border border-omb-warm-grey/40 bg-off-white/80 p-4">
              <Text as="h3" variant="heading" size="md" className="mb-1">
                Pre-batched &amp; Delivered
              </Text>
              <Text variant="caption" size="sm" tone="muted" className="mb-2">
                Ready-to-pour bottles or gallons
              </Text>
              <Text variant="body" size="sm" tone="default" className="mb-2">
                For internal meetings, workshops, or simple &quot;thank you&quot;
                drops. We deliver chilled coffee that&apos;s ready to serve.
              </Text>
              <Text variant="caption" size="xs" tone="muted" className="mt-auto">
                Works well for smaller headcounts or recurring rituals.
              </Text>
            </article>
          </div>
        </section>

        {/* FAQ — long-tail: how to order, event coffee package options */}
        <section
          aria-labelledby="catering-faq-heading"
          className="space-y-4 rounded-3xl border border-omb-warm-grey/40 bg-off-white/70 p-6 md:p-8"
        >
          <h2
            id="catering-faq-heading"
            className="font-display text-2xl text-(--color-omb-red)"
          >
            Frequently asked
          </h2>
          <ul className="space-y-6">
            <li>
              <Text as="h3" variant="heading" size="sm" className="mb-1">
                How do I order coffee for an office event?
              </Text>
              <Text variant="body" size="sm" tone="default">
                Reach out via email or WhatsApp with your date, headcount, and
                rough budget. We&apos;ll suggest formats (barista bar,
                pre-batched, or coffee corner) and a menu—then we lock in
                logistics and show up on the day.                 No online checkout; everything
                is tailored.{" "}
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  className="font-medium text-(--color-omb-red) underline underline-offset-2 hover:no-underline"
                >
                  Get in touch
                </a>
                .
              </Text>
            </li>
            <li>
              <Text as="h3" variant="heading" size="sm" className="mb-1">
                What event coffee package options do you offer?
              </Text>
              <Text variant="body" size="sm" tone="default">
                We offer an <strong>Office Coffee Bar</strong> (pop-up bar with
                baristas), <strong>Event Coffee Corner</strong> (branded corner
                at your venue), and <strong>Pre-batched &amp; Delivered</strong>{" "}
                (ready-to-pour for smaller or internal meetings). Menu size,
                service window, and pricing depend on headcount and location—we
                send a simple proposal after you contact us.
              </Text>
            </li>
            <li>
              <Text as="h3" variant="heading" size="sm" className="mb-1">
                Which areas do you cover for coffee catering?
              </Text>
              <Text variant="body" size="sm" tone="default">
                We cover Jakarta and surrounding areas depending on date and
                scale. Tell us your venue when you reach out and we&apos;ll
                confirm availability.
              </Text>
            </li>
          </ul>
        </section>

        {/* Final CTA */}
        <section
          aria-labelledby="catering-final-cta-heading"
          className="mb-8 rounded-3xl border border-omb-warm-grey/40 bg-off-white/90 p-6 text-center md:p-8"
        >
          <h2
            id="catering-final-cta-heading"
            className="mb-3 font-display text-2xl text-(--color-omb-red)"
          >
            Ready to plan your coffee?
          </h2>
          <Text
            variant="body"
            size="md"
            tone="default"
            className="mx-auto mb-4 max-w-2xl"
          >
            Share your event idea, headcount, and rough budget. We&apos;ll
            follow up via email or WhatsApp with a simple proposal—no pressure,
            no jargon, just good coffee planning.
          </Text>
            <div className="flex flex-wrap justify-center gap-3">
            <a href={`mailto:${EMAIL_ADDRESS}`}>
              <OmbButton variant="primary" size="md">
                Email business@ohmybrew.id
              </OmbButton>
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <OmbButton variant="secondary" size="md">
                Talk to us on WhatsApp
              </OmbButton>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

