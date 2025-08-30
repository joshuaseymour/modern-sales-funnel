import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "overflow-hidden transition-all duration-200",
  {
    variants: {
      variant: {
        default: "rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md",
        elevated: "rounded-2xl bg-card text-card-foreground shadow-lg hover:shadow-xl",
        outline: "rounded-2xl border-2 border-border/50 bg-transparent text-card-foreground hover:border-primary/30",
        filled: "rounded-2xl bg-muted/50 text-card-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
  hoverable?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

const Card = ({ className, variant, hoverable = false, ref, ...props }: CardProps) => (
  <div
    ref={ref}
    className={cn(
      cardVariants({ variant, className }),
      hoverable && "transition-transform hover:-translate-y-0.5"
    )}
    {...props}
  />
);
Card.displayName = "Card";

const CardHeader = ({ className, withBorder = false, ref, ...props }: React.HTMLAttributes<HTMLDivElement> & { withBorder?: boolean; ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      withBorder && "border-b border-border/50",
      className
    )}
    {...props}
  />
);
CardHeader.displayName = "CardHeader";

const CardTitle = ({ className, as: Component = 'h3', size = 'md', ref, ...props }: React.HTMLAttributes<HTMLHeadingElement> & {
    as?: React.ElementType;
    size?: 'sm' | 'md' | 'lg';
    ref?: React.Ref<HTMLParagraphElement>;
  }) => {
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-semibold',
    lg: 'text-2xl font-bold',
  };
  
  return (
    <Component
      ref={ref}
      className={cn(
        "leading-tight tracking-tight text-foreground",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};
CardTitle.displayName = "CardTitle";

const CardDescription = ({ className, muted = true, ref, ...props }: React.HTMLAttributes<HTMLParagraphElement> & {
    muted?: boolean;
    ref?: React.Ref<HTMLParagraphElement>;
  }) => (
  <p
    ref={ref}
    className={cn("text-sm leading-relaxed", {
      "text-muted-foreground": muted,
      "text-foreground/80": !muted,
    }, className)}
    {...props}
  />
);
CardDescription.displayName = "CardDescription";

const CardContent = ({ className, noPadding = false, ref, ...props }: React.HTMLAttributes<HTMLDivElement> & { noPadding?: boolean; ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    className={cn("flex-1", !noPadding && "p-6", className)}
    {...props}
  />
);
CardContent.displayName = "CardContent";

const CardFooter = ({ 
  className, 
  withBorder = true, 
  align = 'end',
  ref,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { 
    withBorder?: boolean;
    align?: 'start' | 'center' | 'end' | 'between' | 'around';
    ref?: React.Ref<HTMLDivElement>;
  }) => {
  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 p-6 pt-0",
        withBorder && "border-t border-border/50",
        alignClasses[align],
        className
      )}
      {...props}
    />
  );
};
CardFooter.displayName = "CardFooter";

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
};
