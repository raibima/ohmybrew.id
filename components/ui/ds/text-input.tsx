import * as React from "react";
import { cn } from "@/lib/utils";
import { Input, type InputProps } from "@/components/ui/input";

export interface TextInputProps extends InputProps {
  error?: string | boolean;
  fullWidth?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, error, fullWidth, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <Input
        ref={ref}
        aria-invalid={hasError || undefined}
        className={cn(
          "bg-secondary",
          "rounded-lg",
          fullWidth && "w-full",
          hasError && "border-[color:var(--color-status-error)]",
          className,
        )}
        {...props}
      />
    );
  },
);

TextInput.displayName = "TextInput";


