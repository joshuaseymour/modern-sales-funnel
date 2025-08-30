import { type Step } from "@/types/funnel";

interface HeaderProps {
  step: Step;
}

export const Header = ({ step }: HeaderProps) => {
  const isTransactional = step === "checkout" || step === "thankyou";
  
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center text-xs font-bold">
            SFS
          </div>
          <span className="text-base font-semibold tracking-tight">
            Sales Funnel Systems
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs sm:text-sm text-muted-foreground">
          {isTransactional && (
            <span className="inline-flex items-center gap-1" aria-label="Secure checkout">
              <svg 
                viewBox="0 0 24 24" 
                className="h-4 w-4" 
                fill="none" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Secure Checkout</span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
