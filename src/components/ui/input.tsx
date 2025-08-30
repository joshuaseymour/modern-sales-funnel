import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Whether the input has an error
   */
  error?: boolean;
  /**
   * Optional helper text below the input
   */
  helperText?: string;
  /**
   * Optional label text above the input
   */
  label?: string;
  /**
   * Optional icon to display inside the input
   */
  icon?: React.ReactNode;
  /**
   * Optional class name for the container
   */
  containerClassName?: string;
  ref?: React.Ref<HTMLInputElement>;
}

const Input = ({
    className,
    type = "text",
    error = false,
    helperText,
    label,
    icon,
    containerClassName,
    id: idProp,
    ref,
    ...props
  }: InputProps) => {
    // Generate a unique ID if not provided
    const id = React.useId();
    const inputId = idProp || `input-${id}`;
    const helperTextId = `${inputId}-helper`;
    const isError = Boolean(error);
    const hasHelperText = Boolean(helperText);

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground/90"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-11 w-full rounded-lg border-2 bg-background px-4 py-2.5 text-base ring-offset-background transition-all duration-200",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-60",
              "read-only:bg-muted/20 read-only:cursor-default",
              {
                "border-destructive/50 focus-visible:ring-destructive/20 focus-visible:border-destructive/70": isError,
                "border-input hover:border-primary/30 focus:border-primary/70 focus-visible:border-primary/70": !isError,
                "pl-10": icon,
              },
              className
            )}
            ref={ref}
            aria-invalid={isError}
            aria-describedby={hasHelperText ? helperTextId : undefined}
            {...props}
          />
        </div>
        {hasHelperText && (
          <p
            id={helperTextId}
            className={cn(
              "text-sm",
              isError ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  };
Input.displayName = "Input";

export { Input };
