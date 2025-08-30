// Actual prices we charge customers
export const PRICES = {
  TRIPWIRE: 97,    // Initial entry point
  BUMP: 47,        // Order bump
  UPSELL: 9997,    // Premium upsell (Done-For-You)
  DOWNSELL: 997,   // Downsell option (Done-With-You)
} as const;

// Perceived value of each offer (used in thank you page)
export const VALUES = {
  TRIPWIRE: 997,   // Increased value perception
  BUMP: 297,       // Increased value perception
  UPSELL: 14997,   // More realistic premium value
  DOWNSELL: 3997,  // Increased value perception
} as const;

export const OFFERS = {
  // Initial tripwire offer
  TRIPWIRE: {
    price: 97,
    title: "DIY Solution",
    description: "Everything you need to get started on your own",
    features: [
      "Complete sales funnel template",
      "Step-by-step implementation guide",
      "Email sequence templates",
      "24/7 email support"
    ]
  },
  // Order bump
  BUMP: {
    price: 47,
    title: "Quick Start Guide",
    description: "Accelerate your success with our step-by-step video training",
    features: [
      "3-hour video training",
      "Copy-paste email templates",
      "30-day action plan",
      "Bonus: Social media content calendar"
    ]
  },
  // Upsell
  UPSELL: {
    price: 9997,
    title: "Done-For-You",
    description: "Let our experts build and optimize your funnel",
    features: [
      "Custom funnel strategy session",
      "Complete funnel setup",
      "Landing page design",
      "Email automation setup",
      "3 months of management",
      "Priority support"
    ]
  },
  // Downsell
  DOWNSELL: {
    price: 997,
    title: "Done-With-You",
    description: "Hands-on guidance to build your funnel together",
    features: [
      "4 weekly 1:1 coaching calls",
      "Funnel strategy session",
      "Implementation support",
      "Email template review",
      "2 weeks of Voxer support"
    ]
  }
} as const;

export const SOCIAL_PROOF = {
  CUSTOMERS_SERVED: 'thousands of',
  GUARANTEE_DAYS: 30,
  TRUST_BADGES: [
    { label: '30-Day Guarantee', icon: '✓' },
    { label: 'Secure Checkout', icon: '🔒' },
    { label: 'Instant Access', icon: '⚡' },
  ],
  // Updated testimonials to focus on business results
  TESTIMONIALS: [
    {
      name: 'Sarah K.',
      role: 'E-commerce Store Owner',
      content: 'Tripled my email list in 30 days using this system. The templates made it so easy to get started!',
      avatar: 'SK'
    },
    {
      name: 'Mike T.',
      role: 'Service Business Owner',
      content: 'The DFY option was worth every penny. My funnel is now converting at 3x what I was getting before.',
      avatar: 'MT'
    },
    {
      name: 'Priya R.',
      role: 'Course Creator',
      content: 'The done-with-you coaching helped me implement everything perfectly. Best investment I made this year!',
      avatar: 'PR'
    }
  ]
} as const;
