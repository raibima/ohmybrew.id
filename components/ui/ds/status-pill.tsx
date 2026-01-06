import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";

const statusPillVariants = cva("", {
  variants: {
    variant: {
      default:
        // Keep pill background consistent on hover instead of inheriting badge hover styles
        "bg-secondary hover:bg-secondary text-primary rounded-full px-3 py-1 text-xs border-transparent",
      success:
        "bg-[color:var(--color-status-success)] hover:bg-[color:var(--color-status-success)] text-white rounded-full px-3 py-1 text-xs border-transparent",
      warning:
        "bg-[color:var(--color-status-warning)] hover:bg-[color:var(--color-status-warning)] text-black rounded-full px-3 py-1 text-xs border-transparent",
      danger:
        "bg-[color:var(--color-status-error)] hover:bg-[color:var(--color-status-error)] text-white rounded-full px-3 py-1 text-xs border-transparent",
      neutral:
        "bg-muted hover:bg-muted text-[color:var(--color-omb-soft-ink)] rounded-full px-3 py-1 text-xs border-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface StatusPillProps
  extends Omit<BadgeProps, "variant">,
    VariantProps<typeof statusPillVariants> {
  icon?: React.ReactNode;
}

export const StatusPill = React.forwardRef<HTMLDivElement, StatusPillProps>(
  ({ className, icon, variant, children, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 border-transparent",
          statusPillVariants({ variant }),
          className,
        )}
        {...props}
      >
        {icon ? <span className="inline-flex h-3 w-3 items-center justify-center">{icon}</span> : null}
        {children}
      </Badge>
    );
  },
);

StatusPill.displayName = "StatusPill";

export { statusPillVariants };


