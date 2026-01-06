import { Text } from "@/components/ui/ds/text";
import { OmbButton } from "@/components/ui/ds/button";
import { FieldLabel } from "@/components/ui/ds/field-label";
import { TextInput } from "@/components/ui/ds/text-input";
import { FormHelperText } from "@/components/ui/ds/form-helper-text";
import { StatusPill } from "@/components/ui/ds/status-pill";

export default function DsPrimitivesDemoPage() {
  return (
    <main className="min-h-screen bg-[color:var(--color-omb-light-mist)] px-6 py-10 text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 rounded-2xl bg-card p-8 shadow-sm">
        <header className="flex flex-col gap-3">
          <Text variant="eyebrow" size="xs">
            Oh My Brew · Design System
          </Text>
          <Text variant="heading" size="xl" tone="brand">
            Low-level primitives tasting flight
          </Text>
          <Text variant="body" size="md" tone="default">
            These are foundational components that power the Oh My Brew UI — tuned
            for cozy, playful coffee vibes and clear interactions.
          </Text>
        </header>

        <section className="flex flex-col gap-4">
          <Text variant="heading" size="lg">
            Buttons
          </Text>
          <div className="flex flex-wrap gap-3">
            <OmbButton>Order this brew</OmbButton>
            <OmbButton variant="secondary">See the menu</OmbButton>
            <OmbButton variant="ghost">Maybe later</OmbButton>
            <OmbButton variant="link">What&apos;s a fruity espresso?</OmbButton>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <Text variant="heading" size="lg">
            Simple order form
          </Text>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col space-y-1">
              <FieldLabel htmlFor="name" required>
                Your name
              </FieldLabel>
              <TextInput id="name" placeholder="Tell us who&apos;s sipping" />
              <FormHelperText>
                We&apos;ll write it on your imaginary cup.
              </FormHelperText>
            </div>

            <div className="flex flex-col space-y-1">
              <FieldLabel htmlFor="email" required>
                Email
              </FieldLabel>
              <TextInput
                id="email"
                type="email"
                error="Hmm… that email doesn’t look right yet."
                placeholder="you@cozy-cat.coffee"
              />
              <FormHelperText error="Hmm… that email doesn’t look right yet." />
            </div>

            <div className="pt-2">
              <OmbButton fullWidth>Brew it</OmbButton>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <Text variant="heading" size="lg">
            Status pills
          </Text>
          <div className="flex flex-wrap gap-3">
            <StatusPill>Coming soon</StatusPill>
            <StatusPill variant="success">Freshly roasted</StatusPill>
            <StatusPill variant="warning">Limited beans</StatusPill>
            <StatusPill variant="danger">Almost out</StatusPill>
            <StatusPill variant="neutral">House favorite</StatusPill>
          </div>
        </section>
      </div>
    </main>
  );
}


