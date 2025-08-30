"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { Testimonials } from '@/components/ui/testimonial';
import { useFunnel } from "@/components/providers/funnel-provider";
import { useCountdown } from "@/hooks/use-countdown";
import { useSocialProof } from "@/hooks/use-dynamic-counter";
import { useState } from "react";

export function LandingPage() {
  const { startCheckout } = useFunnel();
  const { timeString } = useCountdown();
  const { getSocialProofText } = useSocialProof();
  const [loading, setLoading] = useState(false);

  const handleStartCheckout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Brief loading delay
    startCheckout();
    setLoading(false);
  };
  const benefits = [
    {
      title: "Proven Sales Funnel",
      description: "The exact 3-step funnel system that generated $2.3M+ in revenue"
    },
    {
      title: "Complete Templates",
      description: "Landing pages, checkout forms, email sequences, and upsell pages included"
    },
    {
      title: "3 Service Levels",
      description: "DIY ($97), Done-With-You ($997), or Done-For-You ($9,997) options"
    }
  ];

  return (
    <>
      {/* Hero Section - Modern container queries and fluid design */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-muted/10 container-query">

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
          {/* Urgency Banner - Modern accessible design */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="animate-fade-in-up inline-flex items-center gap-3 bg-gradient-to-r from-red-50/80 via-orange-50/80 to-amber-50/80 border border-red-100/60 rounded-full px-4 sm:px-6 py-2.5 backdrop-blur-sm">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-500" aria-hidden="true"></span>
              <span className="text-sm font-medium text-red-700">
                Limited Time: Offer expires in 
                <time className="font-mono font-bold ml-1" aria-label="countdown timer">{timeString}</time>
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Content Section - Enhanced typography and accessibility */}
            <div className="space-y-6 lg:space-y-8 animate-fade-in-up">
              <header>
                <div className="text-sm font-semibold text-primary mb-4">
                  Sales Funnel System
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] text-balance mb-6">
                  Build High-Converting 
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"> Sales Funnels</span>
                  <br />That Actually Work
                </h1>
              </header>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Get the exact same funnel system that generated over $2.3M in revenue. Choose DIY ($97), Done-With-You ($997), or Done-For-You ($9,997).
              </p>
              
              {/* Primary CTA - Conversion Optimized */}
              <div className="space-y-4">
                <Button 
                  size="xl" 
                  onClick={handleStartCheckout}
                  disabled={loading}
                  className="w-full sm:w-auto group px-8 py-4 text-lg font-bold bg-primary hover:bg-primary/90 transition-colors duration-200"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <>
                      Start with DIY - Only $97
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>✓ 30-day money back guarantee</p>
                  <p>✓ Instant access after purchase</p>
                  <p className="font-medium">Need more help? Done-With-You ($997) • Done-For-You ($9,997)</p>
                </div>
              </div>

              {/* Social Proof - Enhanced accessibility and modern design */}
              <div className="pt-6">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5" role="img" aria-label="5 star rating">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-medium text-foreground">4.9/5 rating</span>
                  </div>
                  <div className="text-muted-foreground">
                    Trusted by <span className="font-semibold text-foreground">{getSocialProofText()}</span> entrepreneurs
                  </div>
                </div>
              </div>
            </div>

            {/* Value Props - Conversion Focused */}
            <div className="lg:order-2 space-y-6">
              <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-primary">$2.3M+</div>
                  <p className="text-sm text-muted-foreground">Revenue Generated Using This System</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <span>Complete landing page templates</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <span>Checkout form & payment processing</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <span>Upsell & downsell sequences</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <span>Email automation templates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern card-based design */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16 lg:mb-20">
            <Badge variant="outline" className="mb-4 inline-flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">✨</span>
              <span>Features</span>
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance mb-6">
              Everything you need to build
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> profitable funnels</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              This is the same system we used to generate millions in revenue. Get the templates, training, and support to build yours.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <article 
                key={benefit.title}
                className="group relative bg-card/80 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Feature icon with modern styling */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground/60">
                    0{index + 1}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
                
                {/* Subtle decoration */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Final CTA Section - Modern design with urgency */}
      <section className="relative py-20 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <header>
              <Badge variant="outline" className="mb-6 inline-flex items-center gap-2 bg-background/50 backdrop-blur-sm">
                <span className="text-lg" aria-hidden="true">🚀</span>
                <span>Ready to Transform?</span>
              </Badge>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
                Ready to build your 
                <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"> million-dollar funnel</span>?
              </h2>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                Join <span className="font-semibold text-foreground">{getSocialProofText()}</span> entrepreneurs who are already building profitable funnels. 
                <span className="block mt-2 text-primary font-medium">Start with DIY for just $97 or get it done-for-you for $9,997.</span>
              </p>
            </header>

            {/* Enhanced CTA with social proof */}
            <div className="space-y-6">
              <Button 
                size="xl" 
                onClick={handleStartCheckout}
                disabled={loading}
                className="group min-w-60 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    Start Building - $97
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                30-day guarantee • Instant access • Secure checkout
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
