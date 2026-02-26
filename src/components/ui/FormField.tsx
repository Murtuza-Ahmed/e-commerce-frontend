import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={cn("space-y-1.5", className)}>
        {label && (
          <label className="text-xs font-body font-semibold tracking-wide uppercase block">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-background border rounded-sm text-sm font-body focus:outline-none focus:ring-2 transition-colors",
            error
              ? "border-destructive focus:ring-destructive/30"
              : "border-border focus:ring-primary/30"
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-body text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
