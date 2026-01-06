import * as React from "react";
import { cn } from "@/lib/utils";
import { Text, type TextProps } from "./text";

export interface FormHelperTextProps
  extends Omit<TextProps, "variant" | "size" | "tone"> {
  error?: string | boolean;
}

export const FormHelperText = React.forwardRef<
  HTMLElement,
  FormHelperTextProps
>(({ className, error, children, ...props }, ref) => {
  const hasError = Boolean(error);

  const tone = hasError ? "danger" : "muted";

  return (
    <Text
      ref={ref}
      as="p"
      variant="caption"
      size="sm"
      tone={tone}
      className={cn("mt-1 text-xs", className)}
      {...props}
    >
      {typeof error === "string" ? error : children}
    </Text>
  );
});

FormHelperText.displayName = "FormHelperText";


