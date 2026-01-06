import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button as BaseButton, type ButtonProps as BaseButtonProps } from "@/components/ui/button";

const dsButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-semibold transition-transform",
  {
    variants: {
      variant: {
        primary:
          // Keep brand red on hover instead of falling back to base button hover styles
          "bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:brightness-95 active:scale-[0.97]",
        secondary:
          // Explicit hover background so it doesn't inherit the base button's hover color
          "bg-secondary text-primary border border-primary rounded-lg hover:bg-secondary/80 active:scale-[0.97]",
        ghost:
          "bg-transparent text-[color:var(--color-omb-soft-ink)] hover:bg-muted active:scale-[0.97]",
        link:
          // Avoid the "all white" hover by forcing link buttons to stay transparent
          "bg-transparent text-[color:var(--color-omb-electric-brew-blue)] underline-offset-4 hover:underline hover:bg-transparent",
      },
      size: {
        lg: "h-11 px-6 text-base",
        md: "h-10 px-4 text-sm",
        sm: "h-9 px-3 text-xs",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export interface OmbButtonProps
  extends Omit<BaseButtonProps, "variant" | "size">,
    VariantProps<typeof dsButtonVariants> {}

export const OmbButton = React.forwardRef<HTMLButtonElement, OmbButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <BaseButton
        ref={ref}
        className={cn(dsButtonVariants({ variant, size, fullWidth }), className)}
        {...props}
      />
    );
  },
);

OmbButton.displayName = "OmbButton";

export { dsButtonVariants };


