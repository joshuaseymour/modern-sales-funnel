import { type Step } from "@/types/funnel";

interface ProgressBarProps {
  step: Step;
}

export function ProgressBar({ step }: ProgressBarProps) {
  const stepNumber = step === "landing" ? 1 : step === "checkout" ? 2 : 3;
  
  if (step === "landing") return null;
  
  return (
    <div className="bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span className={stepNumber >= 1 ? 'text-foreground font-medium' : ''}>
            Landing
          </span>
          <span className={stepNumber >= 2 ? 'text-foreground font-medium' : ''}>
            Checkout
          </span>
          <span className={stepNumber >= 3 ? 'text-foreground font-medium' : ''}>
            Complete
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full">
          <div 
            className="h-2 bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(stepNumber / 3) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
