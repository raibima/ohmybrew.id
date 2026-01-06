"use client";

import { useState } from "react";
import { Text, StatusPill, OmbButton } from "@/components/ui/ds";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-omb-red)]/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[color:var(--color-omb-electric-brew-blue)]/5 blur-3xl" />
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16">
        {/* Content container with entrance animation */}
        <div className="flex max-w-lg flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Coming Soon pill */}
          <StatusPill className="mb-8">Coming Soon</StatusPill>

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
          <div className="mb-12 flex items-center gap-2 text-[color:var(--color-omb-warm-grey)]">
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <Text variant="caption" size="sm" tone="muted">
              BSD, Tangerang
            </Text>
          </div>

          {/* Email signup */}
          <div className="w-full max-w-sm">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Text variant="label" size="sm" align="center" tone="muted">
                  Get notified when we launch
                </Text>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <OmbButton type="submit" variant="primary">
                    Notify Me
                  </OmbButton>
                </div>
              </form>
            ) : (
              <div className="rounded-xl bg-card p-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="mb-2 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-status-success)]/10">
                    <svg
                      className="h-6 w-6 text-[color:var(--color-status-success)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <Text variant="body" size="md" align="center" tone="default">
                  Awesome! We&apos;ll let you know when we&apos;re ready to
                  brew.
                </Text>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
