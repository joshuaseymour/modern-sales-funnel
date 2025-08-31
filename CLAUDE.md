# CLAUDE.md

**Comprehensive guidance for Claude Code when working with this modern sales funnel codebase.**

## 🎯 **Project Context**

This is a production-ready sales funnel application built with modern web technologies and optimized for high conversion rates. The architecture prioritizes performance, type safety, and developer experience while maintaining clean, maintainable code.

**Primary Use Case**: 3-step conversion funnel (Landing → Checkout → Thank You) with order bumps and upsell/downsell sequences. The content is meta - it's a sales funnel that sells sales funnel systems.

## 🛠️ **Latest 2025 Tech Stack**

### **Core Framework**
- **Next.js 15.5.2** - Latest with Turbopack, App Router, Server Components
- **React 19.1.1** - Cutting-edge features with React Compiler
- **TypeScript 5.9.2** - Strict mode with enhanced type safety

### **Styling & UI**  
- **Tailwind CSS 4.1.12** - CSS-first configuration, @theme syntax
- **@tailwindcss/postcss 4.1.12** - New PostCSS plugin for v4
- **next-themes 0.4.6** - Modern theme management with system detection
- **Magic UI Pro** - Premium component library (Individual License: prod_O4REWvflDgCtXp)
- **Shadcn/ui** - Modern component library with Radix UI primitives  
- **Framer Motion 12.23.12** - Latest with motion-dom integration
- **Motion 12.23.12** - New motion primitives library for advanced animations
- **Inter Font** - Variable font with display: swap and preload

### **Development Tools**
- **ESLint 9.34.0** - Next.js + TypeScript rules, modern configuration
- **Prettier 3.6.2** - Code formatting with Tailwind plugin
- **React Compiler 19.1.0-rc.3** - Automatic optimizations in experimental mode

## ⚡ **Essential Commands**

```bash
# Development (using pnpm)
pnpm run dev          # Turbopack dev server (instant hot reload)
pnpm run build        # Production build (~25s with full optimization)
pnpm start           # Production server
pnpm run lint        # Code quality check
pnpm run type-check  # TypeScript validation
```

**Performance Note**: Turbopack provides 90%+ faster builds compared to Webpack.

## 🏗️ **Architecture Deep Dive**

### **File Structure & Responsibilities**

```
src/
├── app/                           # Next.js 15 App Router
│   ├── layout.tsx                # Root layout + providers setup
│   ├── page.tsx                  # Main funnel orchestrator
│   ├── globals.css               # Tailwind v3 + zinc color system
│   └── actions/                  # Server Actions for form handling
│       └── checkout.ts
├── components/
│   ├── funnel/                   # 🎯 Core conversion flow (3 files)
│   │   ├── landing-page.tsx      # Hero + social proof + CTA
│   │   ├── checkout-form.tsx     # Form + validation + order bump
│   │   └── thank-you-page.tsx    # Confirmation + upsell/downsell
│   ├── layout/                   # 🏠 Structural components (4 files)
│   │   ├── header.tsx            # Navigation (Server Component)
│   │   ├── footer.tsx            # Links + trust signals (Server)
│   │   ├── main-layout.tsx       # Page wrapper with progress
│   │   └── progress-bar.tsx      # Funnel step indicator
│   ├── ui/                       # 🎨 Reusable UI primitives (8 files)
│   │   ├── button.tsx            # Primary action component
│   │   ├── card.tsx              # Content containers
│   │   ├── input.tsx             # Form inputs with validation
│   │   ├── badge.tsx             # Status indicators
│   │   ├── error-message.tsx     # Error display component
│   │   ├── testimonial.tsx       # Social proof component
│   │   ├── error-boundary.tsx    # Error handling wrapper
│   │   ├── loading-spinner.tsx   # Loading states
│   │   └── success-animation.tsx # Success feedback
│   └── providers/                # ⚛️ React Context (1 file)
│       └── funnel-provider.tsx   # Global funnel state
├── hooks/                        # 🔗 Custom React hooks (6 files)
│   ├── use-funnel-state.ts      # Core funnel progression logic
│   ├── use-checkout.ts          # Form handling + validation + persistence
│   ├── use-countdown.ts         # Dynamic timer functionality
│   ├── use-dynamic-counter.ts   # Animated counters
│   ├── use-form-persistence.ts  # LocalStorage form persistence
│   └── use-toast.ts             # Toast notification system
├── lib/                          # 🛠️ Utilities & configuration (5 files)
│   ├── constants.ts             # Pricing, content, social proof
│   ├── utils.ts                 # Helper functions (cn, fmtUSD)
│   ├── format.ts                # Input formatting (card, expiry, CVC)
│   ├── validations.ts           # Zod schemas for forms
│   └── env.ts                   # Environment validation with Zod
└── types/                        # 📝 TypeScript definitions (2 files)
    ├── funnel.ts                # Core types (Step, Purchase, etc.)
    └── globals.d.ts             # Global type declarations
```

### **Component Architecture Patterns**

#### **Server vs Client Components**
- **Server Components**: Header, Footer, Static content, Testimonials
- **Client Components**: Forms, State providers, Interactive UI, Animations

#### **State Management**
```typescript
// Centralized funnel state pattern
FunnelProvider (Context) → useFunnel() hook → {
  // Current state
  step: Step                    // 'landing' | 'checkout' | 'thankyou'
  bump: boolean                 // Order bump selection
  purchase: Purchase            // What user has purchased
  
  // Actions
  startCheckout: () => void     // Landing → Checkout transition
  setBump: (value: boolean)     // Toggle order bump
  completeCheckout: () => void  // Checkout → Thank You transition
  acceptUpsell: () => void      // Upsell acceptance
  acceptDownsell: () => void    // Downsell acceptance
  handlePrint: () => void       // Receipt printing
}
```

#### **Form Handling Pattern**
Uses native React form handling with Zod validation:
```typescript
// Validation schema (Zod)
const CheckoutSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  card: z.string().length(16)
});

// Form implementation
const [formData, setFormData] = useState<CheckoutForm>({});
const validationResult = CheckoutSchema.safeParse(formData);
```

## 💰 **Content Management System**

### **Constants Architecture**
All funnel content is centralized in `src/lib/constants.ts`:

```typescript
// Pricing (actual customer pricing)
export const PRICES = {
  TRIPWIRE: 97,    // Main DIY offer
  BUMP: 47,        // Bonus templates pack
  UPSELL: 9997,    // Done-For-You service (updated from 4997)
  DOWNSELL: 997    // Done-With-You service
} as const;

// Perceived values (social proof)
export const VALUES = {
  TRIPWIRE: 497,   // Shows savings
  BUMP: 97,        // Shows discount  
  UPSELL: 49997,   // Premium value
  DOWNSELL: 4997   // Alternative value
};

// Content blocks
export const OFFERS = {
  TRIPWIRE: {
    title: "Sales Funnel Accelerator Course",
    features: [...],
    guarantee: "30-day money back"
  }
  // ...
};

export const SOCIAL_PROOF = {
  CUSTOMERS_SERVED: "thousands of",
  TESTIMONIALS: [...]
};
```

### **Content Modification Workflow**
1. **Never edit component files directly for content changes**
2. **Always update `src/lib/constants.ts` first**
3. **Components automatically reflect changes**
4. **Maintains consistency across entire funnel**

## 🎨 **Styling System**

### **Tailwind CSS v4 CSS-First Configuration**
- **Latest Beta 4.0.0-beta.7**: Cutting-edge CSS-first approach
- **@theme Syntax**: Modern configuration directly in CSS
- **Zinc Color Palette**: Professional, conversion-optimized design
- **Component Variants**: Using `class-variance-authority` (cva)
- **next-themes Integration**: Seamless light/dark mode switching

```css
/* globals.css - Tailwind v4 CSS-first configuration */
@import "tailwindcss";

@theme {
  /* Zinc color system - optimized for conversion */
  --color-background: 0 0% 100%;
  --color-foreground: 240 10% 3.9%;
  --color-primary: 240 5.9% 10%;
  --color-primary-foreground: 0 0% 98%;
  /* ...complete zinc color system */
}

@theme dark {
  /* Dark mode zinc colors */
  --color-background: 240 10% 3.9%;
  --color-foreground: 0 0% 98%;
  /* ...dark mode variants */
}
```

### **Component Styling Pattern**
```typescript
// Using cva for component variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-semibold transition-all",
  {
    variants: {
      variant: {
        primary: "bg-black text-white hover:shadow-lg",
        secondary: "bg-white text-gray-900 ring-1 ring-black/10"
      },
      size: {
        sm: "px-3 py-2 text-sm",
        lg: "px-6 py-3 text-base"
      }
    }
  }
);
```

## 🔄 **Development Patterns**

### **Adding New Components**
1. **Determine component type** (UI, Layout, or Funnel)
2. **Choose Server vs Client Component** based on interactivity
3. **Follow existing naming conventions** (`kebab-case.tsx`)
4. **Export as named export** (not default)
5. **Add proper TypeScript interfaces**

Example new component:
```typescript
// src/components/ui/new-component.tsx
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface NewComponentProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary";
}

export function NewComponent({ 
  variant = "default", 
  className, 
  ...props 
}: NewComponentProps) {
  return (
    <div
      className={cn(
        "base-styles",
        variant === "secondary" && "secondary-styles",
        className
      )}
      {...props}
    />
  );
}
```

### **Form Components Pattern**
```typescript
// Use controlled components with validation
export function FormField({ 
  value, 
  onChange, 
  error 
}: FormFieldProps) {
  return (
    <div>
      <Input
        value={value}
        onChange={onChange}
        className={error ? "border-destructive" : ""}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
```

### **State Updates Pattern**
```typescript
// Use optimistic updates for better UX
const handleBumpToggle = (checked: boolean) => {
  setBump(checked);  // Immediate UI update
  // Server sync happens in background
};
```

## 🔧 **Common Development Tasks**

### **Modifying Pricing**
```typescript
// src/lib/constants.ts
export const PRICES = {
  TRIPWIRE: 127,  // Changed from 97
  // ... other prices
};
// Components automatically reflect new pricing
```

### **Adding New Funnel Steps**
1. **Add step to types**: `src/types/funnel.ts`
2. **Update provider**: `src/components/providers/funnel-provider.tsx`  
3. **Create component**: `src/components/funnel/new-step.tsx`
4. **Add routing logic**: `src/app/page.tsx`

### **Customizing Styling**
```css
/* src/app/globals.css - Add custom properties */
@theme {
  --color-brand-primary: #your-color;
}

/* Components automatically use new values */
```

### **Environment Configuration**
```bash
# .env.local - Add new variables
NEW_API_KEY=your_value

# src/lib/env.ts - Add validation
export const env = z.object({
  NEW_API_KEY: z.string()
}).parse(process.env);
```

## 🐛 **Troubleshooting Guide**

### **Common Issues & Solutions**

#### **Build Errors**
```bash
# TypeScript errors
npm run type-check  # Check specific issues

# ESLint errors  
npm run lint        # Fix code quality issues

# Clear build cache
rm -rf .next && npm run build
```

#### **Component Issues**
- **"Component not found"**: Check import paths use `@/` alias
- **"Hook errors"**: Ensure hooks are inside Client Components (`"use client"`)
- **"Hydration mismatch"**: Check Server/Client component boundaries

#### **Styling Issues**
- **Tailwind not working**: Verify `globals.css` import in `layout.tsx`
- **Custom styles not applying**: Check CSS custom property definitions
- **Responsive issues**: Test with browser dev tools at different breakpoints

### **Performance Debugging**
```bash
# Build analysis
npm run build        # Check bundle size output

# Development debugging
npm run dev          # Hot reload for instant feedback
```

## 📋 **Code Quality Standards**

### **TypeScript Requirements**
- **Strict mode enabled**: No `any` types allowed
- **Explicit return types**: For complex functions
- **Interface definitions**: For all component props
- **Proper generics**: For reusable components

### **Component Standards**
- **Single responsibility**: Each component has one clear purpose
- **Composition over inheritance**: Use composition patterns
- **Prop drilling avoidance**: Use Context for deep state
- **Performance optimization**: Leverage React Compiler automatic optimization

### **File Organization**
- **Consistent naming**: `kebab-case` for files, `PascalCase` for components
- **Logical grouping**: Related files in same directory
- **Clear dependencies**: Minimal circular dependencies

## 🚀 **Performance Considerations**

### **React 19 Optimizations**
- **React Compiler**: Automatic memoization (no manual `useMemo`/`useCallback` needed)
- **Server Components**: Reduced client-side JavaScript
- **Actions API**: Built-in form handling with loading states

### **Next.js 15 Features**
- **Turbopack**: Ultra-fast development builds
- **Static Generation**: Pre-rendered pages where possible
- **Image Optimization**: Automatic WebP/AVIF conversion
- **Code Splitting**: Route-based and dynamic imports

### **Bundle Optimization**
- **Tree Shaking**: Unused code automatically removed
- **Dynamic Imports**: Large components loaded on demand
- **CSS Optimization**: Tailwind purges unused styles
- **Asset Optimization**: Images and fonts optimized

## 🎯 **Working with Claude Code - ENFORCEMENT REQUIRED**

### **Mandatory Guideline Compliance**

#### **ALWAYS START WITH GUIDELINE VALIDATION**
Before any coding task, Claude Code MUST:
1. **Read this CLAUDE.md file**
2. **Confirm tech stack compliance** (Next.js 15.5.2, React 19.1.1, TypeScript 5.9.2, TailwindCSS 4.1.12)
3. **Check component hierarchy** (shadcn/ui → Framer Motion → custom)
4. **Verify zinc color system usage**
5. **Ensure Server/Client component boundaries**

#### **Component Creation Process (MANDATORY)**
```typescript
// REQUIRED CHECKLIST before creating any component:
// ✅ 1. Does Magic UI Pro have this premium component?
// ✅ 2. Does shadcn/ui have this component?
// ✅ 3. Can we enhance existing components?
// ✅ 4. Are we using zinc colors from globals.css?
// ✅ 5. Is this Server Component by default?
// ✅ 6. Do we have proper TypeScript interfaces?
// ✅ 7. Are we following existing patterns?
// ✅ 8. Does it integrate with Framer Motion 12.23.12?
```

#### **Magic UI Pro Integration (PRIORITY)**
**License**: Individual License (prod_O4REWvflDgCtXp)
**MCP Server**: Configured for direct component access

**Premium Components Available:**
- **Hero Sections**: Video backgrounds, interactive elements, conversion-optimized layouts
- **Text Animations**: Morphing effects, gradient text, sparkles, typing animations
- **Layout Systems**: Bento grids, dock navigation, file trees, interactive patterns
- **Progress Indicators**: Animated progress bars, circular progress, scroll-based animations
- **Call-to-Action**: Premium button animations, hover effects, micro-interactions
- **Social Proof**: Animated testimonials, marquee components, trust indicators

**Usage Priority**: Magic UI Pro → shadcn/ui (via MCP) → custom components

#### **shadcn/ui MCP Integration**
**MCP Server**: Official shadcn MCP server configured
**Registry**: Default shadcn/ui registry + custom registries
**Base Color**: Zinc (matches our design system)
**CSS Variables**: Enabled for our TailwindCSS v4 setup

**Available via MCP:**
- **Browse Components**: "Show me all available components in the shadcn registry"
- **Search Components**: "Find me a login form from the shadcn registry"  
- **Install Components**: "Add the button, dialog and card components to my project"
- **Natural Language**: "Create a contact form using shadcn components"

**Existing Components**: button, card, input, badge, testimonial, error-boundary, loading-spinner, success-animation, error-message

### **Best Practices for AI Assistance**

#### **When Requesting Changes**
1. **Specify exact files** to modify (use file paths)
2. **Provide context** about existing patterns to follow
3. **Mention constraints** (TypeScript strict, Server/Client components)
4. **Reference constants** for content changes rather than hardcoding

#### **Code Review Approach**
1. **Check TypeScript compliance** (`npm run type-check`)
2. **Verify component patterns** match existing architecture
3. **Validate Server/Client boundaries** are maintained
4. **Test funnel flow** after changes

#### **Effective Prompts**
✅ **REQUIRED FORMAT**: "Claude, following our CLAUDE.md guidelines, update the checkout form in `src/components/funnel/checkout-form.tsx` to add a phone field. MUST use: existing Zod validation pattern, shadcn/ui Input component, zinc colors, TypeScript interfaces."

❌ **NEVER ACCEPT**: "Make the form better"

#### **Enforcement Commands**
```bash
# Use these to ensure compliance:
/validate-guidelines     # Check current work against CLAUDE.md
/component-hierarchy    # Show proper component selection process  
/design-validate        # Validate component against design system
/tech-stack-check       # Confirm correct versions being used
/funnel-audit           # Review entire funnel flow for issues
/pricing-check          # Validate pricing constants match reality
/zinc-colors            # Show available zinc colors from globals.css
/form-patterns          # Display proper form validation patterns
```

#### **Quick Reference Commands**
```bash
# Instant access to key information:
/constants             # Show current PRICES, VALUES, OFFERS
/file-structure        # Display actual project architecture
/component-list        # Show all available UI components
/hook-usage           # Display custom hooks and their purposes
/server-client        # Guide for Server vs Client component decisions
```

#### **Self-Validation Required**
After every coding task, Claude Code MUST verify:
- ✅ Used correct tech stack versions
- ✅ Followed component hierarchy (shadcn → enhance → custom)
- ✅ Applied zinc color system
- ✅ Maintained TypeScript strict mode
- ✅ Used Server Components unless interactivity required
- ✅ Updated constants.ts for content, not hardcoded values

### **Project-Specific Context**
- **This is a sales funnel**: Focus on conversion optimization
- **Performance matters**: Bundle size and load times critical
- **Type safety is required**: All changes must pass TypeScript strict mode
- **Follow existing patterns**: Don't introduce new architectures without discussion

## 📊 **Current Metrics**

- **Total Files**: 24 TypeScript/React files (optimized)
- **Core Components**: 19 React components (3 funnel + 8 UI + 4 layout + 1 provider + 3 other)
- **Custom Hooks**: 6 reusable hooks for state and form management
- **Build Performance**: Turbopack for ultra-fast development builds
- **Type Coverage**: 100% TypeScript with strict mode
- **Bundle Size**: Optimized for Core Web Vitals
- **Color System**: Zinc palette for professional, high-converting design
- **Dependencies**: Minimal, production-ready stack with latest stable versions

---

## 🤖 **Proactive Claude Code Behaviors**

### **I Will Always Do Without Being Asked:**

#### **Before Every Coding Task:**
1. **Read CLAUDE.md** - Refresh understanding of current guidelines
2. **Check package.json** - Verify exact versions being used
3. **Review existing patterns** - Look at similar components first
4. **Validate tech stack** - Ensure using correct Next.js/React/Tailwind versions

#### **During Development:**
1. **Follow component hierarchy** - shadcn/ui → Framer Motion → custom
2. **Use TypeScript interfaces** - Never skip type definitions
3. **Apply zinc colors** - Reference globals.css variables
4. **Maintain Server/Client boundaries** - Default to Server Components
5. **Update constants.ts** - Never hardcode content

#### **After Every Change:**
1. **Run type-check** - `npm run type-check` 
2. **Run lint** - `npm run lint`
3. **Self-validate** - Check against CLAUDE.md requirements
4. **Test funnel flow** - Ensure no regressions
5. **Update documentation** - If patterns change

### **I Will Proactively Suggest:**
- **Performance optimizations** when I see opportunities
- **Component consolidation** when I notice duplication
- **Type safety improvements** when I see `any` types
- **Accessibility enhancements** for better UX
- **Bundle size optimizations** when adding dependencies

### **I Will Always Warn About:**
- **Breaking changes** before making them
- **Tech stack mismatches** when I detect version conflicts  
- **Pattern violations** when code doesn't follow guidelines
- **Performance impacts** when changes affect bundle size
- **Conversion risks** when changes might hurt funnel performance

---

---

## 🏢 **C-Suite Agent Architecture (August 2025 Optimized)**

### **Enhanced Executive Model**
This project uses an optimized **C-Suite agent architecture** following August 2025 best practices for AI agent coordination and intelligent task routing.

#### **The Executive Team**
- **CEO (ceo-leadership)**: Strategic FOCUS, organizational priorities, vision clarity
- **CMO (cmo-marketing-sales)**: USERS experience, front-end optimization, user engagement  
- **CVO (cvo-product-service)**: VALUE creation, optimization, delivery systems
- **COO (coo-management-operations)**: ADMIN systems, back-end operations, technical infrastructure
- **CFO (cfo-cash-flow)**: FUNDS management, financial systems, legal compliance
- **c-suite-orchestrator**: Board-level coordination for complex multi-executive decisions

#### **Smart Task Routing (4 Levels)**
```
Level 1: Direct specialist → Executive informed (2 min)
Level 2: Executive → Specialist team → Executive decision (15 min)  
Level 3: Multi-executive coordination via orchestrator (30 min)
Level 4: Full C-suite strategic decisions (60 min)
```

#### **Enhanced Features**
- **Executive Briefing System**: Shared context across all executives
- **Intelligent Routing**: Automatic complexity-based task assignment
- **Performance Tracking**: Executive effectiveness and system optimization metrics
- **Context Sharing**: Decision history and cross-functional awareness

#### **For Claude Code Users**
When working with this project, tasks are automatically routed to the appropriate executive level based on:
- **Domain expertise** (FOCUS, USERS, VALUE, ADMIN, FUNDS)
- **Task complexity** (specialist, executive, coordination, strategic)
- **Cross-functional impact** (single vs. multi-domain decisions)

See `C-SUITE_IMPLEMENTATION_GUIDE.md` for detailed architecture documentation.

---

**This documentation is maintained for optimal Claude Code collaboration. Updated: 2025-08-31 with C-suite architecture optimization and August 2025 best practices.**