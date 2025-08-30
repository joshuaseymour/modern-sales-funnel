import type { ReactNode } from "react";
import { Header } from "./header";
import { ProgressBar } from "./progress-bar";
import { Footer } from "./footer";
import { type Step } from "@/types/funnel";

interface MainLayoutProps {
  children: ReactNode;
  step: Step;
}

export function MainLayout({ children, step }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-muted/30 text-foreground">
      <Header step={step} />
      <ProgressBar step={step} />
      <main id="main" className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
