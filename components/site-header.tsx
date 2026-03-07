"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/order", label: "Order" },
  { href: "/news", label: "News" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-omb-warm-grey/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="font-display text-xl text-(--color-omb-red) transition-colors hover:text-(--color-omb-red)/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-omb-electric-brew-blue)"
          aria-label="Oh My Brew – Home"
        >
          Oh My Brew
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-omb-electric-brew-blue) ${
                  isActive
                    ? "text-(--color-omb-red)"
                    : "text-(--color-omb-soft-ink) hover:text-(--color-omb-electric-brew-blue)"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
