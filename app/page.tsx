"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { Text } from "@/components/ui/ds/text";
import { StatusPill } from "@/components/ui/ds/status-pill";
import { OmbButton } from "@/components/ui/ds/button";
import { Input } from "@/components/ui/input";
import { subscribeAction } from "@/app/actions/subscribe";

// Hoist static SVG elements outside component to avoid re-creation on every render
const LocationIcon = (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const InstagramIcon = (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const SuccessCheckmark = (
  <svg
    className="h-6 w-6 text-[color:var(--color-status-success)]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const initialState = {
  success: false,
  message: "",
  error: "",
};

export default function Home() {
  const [state, formAction, pending] = useActionState(subscribeAction, initialState);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Autofocus on desktop after hydration to avoid mismatch
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768 && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-omb-red)]/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[color:var(--color-omb-electric-brew-blue)]/5 blur-3xl" />
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16">
        {/* Content container with entrance animation */}
        <div className="flex max-w-lg flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none motion-reduce:opacity-100">
          {/* Now Open pill */}
          <StatusPill className="mb-8">Now Open</StatusPill>

          {/* Brand name */}
          <h1 className="mb-6 font-display text-6xl leading-tight text-[color:var(--color-omb-red)] sm:text-7xl">
            Oh My Brew
          </h1>

          {/* Tagline */}
          <Text
            variant="body"
            size="lg"
            align="center"
            className="mb-4 max-w-md"
          >
            Good quality specialty coffee that doesn&apos;t take itself too
            seriously—just your brew, done right.
          </Text>

          {/* Location */}
          <div className="mb-8 flex items-center gap-2 text-[color:var(--color-omb-warm-grey)]">
            {LocationIcon}
            <Text variant="caption" size="sm" tone="muted">
              BSD, Tangerang
            </Text>
            <span className="text-[color:var(--color-omb-warm-grey)]">•</span>
            <a
              href="https://instagram.com/ohmy.brew"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[color:var(--color-omb-warm-grey)] hover:text-[color:var(--color-omb-electric-brew-blue)] transition-colors"
              aria-label="Visit our Instagram"
            >
              {InstagramIcon}
              <span className="text-sm">@ohmy.brew</span>
            </a>
          </div>

          {/* Order CTA */}
          <Link href="/order" className="mb-12">
            <OmbButton variant="primary" size="lg">
              Order Now
            </OmbButton>
          </Link>

          {/* Email signup */}
          <div className="w-full max-w-sm">
            {!state.success ? (
              <form action={formAction} className="flex flex-col gap-3">
                <Text variant="label" size="sm" align="center" tone="muted">
                  Be the first to know about promos
                </Text>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <label htmlFor="email-input" className="sr-only">
                      Email address
                    </label>
                    <Input
                      ref={emailInputRef}
                      id="email-input"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      required
                      className="flex-1"
                      disabled={pending}
                      autoComplete="email"
                      spellCheck={false}
                    />
                    <OmbButton type="submit" variant="primary" disabled={pending}>
                      {pending ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          </div>
                          Notify Me
                        </span>
                      ) : (
                        "Notify Me"
                      )}
                    </OmbButton>
                  </div>
                  {state.error ? (
                    <Text
                      variant="caption"
                      size="sm"
                      align="center"
                      className="text-[color:var(--color-omb-red)]"
                      role="alert"
                      aria-live="polite"
                    >
                      {state.error}
                    </Text>
                  ) : null}
                </div>
              </form>
            ) : (
              <div className="rounded-xl bg-card p-6 animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none">
                <div className="mb-2 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-status-success)]/10">
                    {SuccessCheckmark}
                  </div>
                </div>
                <Text variant="body" size="md" align="center" tone="default">
                  You&apos;re in! We&apos;ll keep you posted.
                </Text>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
