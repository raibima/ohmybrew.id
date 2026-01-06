import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    variant: {
      heading: "font-semibold text-primary",
      body: "font-normal text-[color:var(--color-omb-soft-ink)]",
      label: "font-medium text-foreground",
      caption: "font-normal text-[color:var(--color-omb-warm-grey)]",
      eyebrow:
        "font-semibold uppercase tracking-[0.16em] text-[color:var(--color-omb-warm-grey)]",
    },
    size: {
      xl: "text-4xl leading-tight",
      lg: "text-2xl leading-snug",
      md: "text-base leading-relaxed",
      sm: "text-sm leading-relaxed",
      xs: "text-xs leading-relaxed",
    },
    tone: {
      default: "text-[color:var(--color-omb-soft-ink)]",
      muted: "text-[color:var(--color-omb-warm-grey)]",
      brand: "text-[color:var(--color-omb-red)]",
      link: "text-[color:var(--color-omb-electric-brew-blue)]",
      success: "text-[color:var(--color-status-success)]",
      danger: "text-[color:var(--color-status-error)]",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    variant: "body",
    size: "md",
    tone: "default",
    align: "left",
  },
});

type TextVariants = VariantProps<typeof textVariants>;

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    TextVariants {
  as?: React.ElementType;
}

function getDefaultElement(variant: TextVariants["variant"], size: TextVariants["size"]) {
  if (variant === "heading") {
    if (size === "xl") return "h1";
    if (size === "lg") return "h2";
    return "h3";
  }

  if (variant === "label") return "label";
  if (variant === "caption") return "p";

  return "p";
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as,
      className,
      variant,
      size,
      tone,
      align,
      ...props
    },
    ref,
  ) => {
    const Component = (as ?? getDefaultElement(variant, size)) as React.ElementType;

    return (
      <Component
        ref={ref}
        className={cn(textVariants({ variant, size, tone, align }), className)}
        {...props}
      />
    );
  },
);

Text.displayName = "Text";

export { textVariants };


