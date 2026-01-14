import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";

const linkCardVariants = cva(
  "group flex w-full items-center gap-4 rounded-xl bg-card p-4 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border border-transparent hover:border-border",
        outlined: "border border-border",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]",
      },
    },
    defaultVariants: {
      variant: "default",
      disabled: false,
    },
  }
);

export interface LinkCardProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    VariantProps<typeof linkCardVariants> {
  href: string;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  external?: boolean;
  disabled?: boolean;
}

export const LinkCard = React.forwardRef<HTMLAnchorElement, LinkCardProps>(
  (
    { className, variant, href, icon, title, subtitle, external = false, disabled = false, ...props },
    ref
  ) => {
    const content = (
      <>
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background">
            {icon}
          </div>
        )}
        <div className="flex flex-1 flex-col gap-0.5">
          <span className={cn(
            "font-semibold transition-colors",
            disabled
              ? "text-[color:var(--color-omb-warm-grey)]"
              : "text-[color:var(--color-omb-soft-ink)] group-hover:text-[color:var(--color-omb-red)]"
          )}>
            {title}
          </span>
          {subtitle && (
            <span className="text-sm text-[color:var(--color-omb-warm-grey)]">
              {subtitle}
            </span>
          )}
        </div>
        <svg
          className={cn(
            "h-5 w-5 shrink-0 text-[color:var(--color-omb-warm-grey)]",
            !disabled && "transition-transform group-hover:translate-x-1 group-hover:text-[color:var(--color-omb-red)]"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </>
    );

    // Render as non-interactive div when disabled
    if (disabled) {
      return (
        <div
          className={cn(linkCardVariants({ variant, disabled: true }), className)}
          {...(props as React.HTMLAttributes<HTMLDivElement>)}
        >
          {content}
        </div>
      );
    }

    if (external) {
      return (
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkCardVariants({ variant, disabled: false }), className)}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(linkCardVariants({ variant, disabled: false }), className)}
        {...props}
      >
        {content}
      </Link>
    );
  }
);

LinkCard.displayName = "LinkCard";

export { linkCardVariants };
