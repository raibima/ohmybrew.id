"use client";

import { useState } from "react";
import Link from "next/link";
import { Text, StatusPill, OmbButton } from "@/components/ui/ds";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to subscribe");
    } finally {
      setLoading(false);
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

          {/* Order CTA */}
          <Link href="/order" className="mb-12">
            <OmbButton variant="primary" size="lg">
              Order Now
            </OmbButton>
          </Link>

          {/* Email signup */}
          <div className="w-full max-w-sm">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Text variant="label" size="sm" align="center" tone="muted">
                  Be the first to know about promos
                </Text>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      required
                      className="flex-1"
                      disabled={loading}
                    />
                    <OmbButton type="submit" variant="primary" disabled={loading}>
                      {loading ? "..." : "Notify Me"}
                    </OmbButton>
                  </div>
                  {error && (
                    <Text
                      variant="caption"
                      size="sm"
                      align="center"
                      className="text-[color:var(--color-omb-red)]"
                    >
                      {error}
                    </Text>
                  )}
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
