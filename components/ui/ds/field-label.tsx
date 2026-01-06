import * as React from "react";
import { cn } from "@/lib/utils";
import { Label, type LabelProps } from "@/components/ui/label";
import { Text } from "./text";

export interface FieldLabelProps extends LabelProps {
  required?: boolean;
}

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <Label ref={ref} className={cn("mb-1 inline-flex items-center gap-1", className)} {...props}>
        <Text as="span" variant="label" size="sm">
          {children}
        </Text>
        {required ? (
          <span className="text-[color:var(--color-status-error)]" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>
    );
  },
);

FieldLabel.displayName = "FieldLabel";


