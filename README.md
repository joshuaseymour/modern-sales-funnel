# 🚀 Modern Sales Funnel

A high-converting sales funnel built with cutting-edge 2025 web technologies. Features a streamlined 3-step conversion flow optimized for maximum performance and user experience.

## 📊 **Project Stats**
- **🏗️ Architecture**: 24 TypeScript/React files, optimized and cleaned
- **⚡ Build Performance**: Turbopack for ultra-fast development builds
- **📦 Bundle**: Optimized for Core Web Vitals with zinc color system
- **🔒 Type Safety**: 100% TypeScript coverage with strict mode

## ✨ **Key Features**

### **🎯 Conversion Optimized**
- **3-Step Funnel**: Landing → Checkout → Thank You
- **Order Bump**: Ethical $47 add-on (unchecked by default)
- **Upsell/Downsell**: $9,997/$997 premium offers
- **Social Proof**: Real testimonials and trust indicators

### **⚡ Modern Tech Stack**
- **Next.js 15.5.2** - Turbopack dev builds, Server Components, App Router
- **React 19.1.1** - Latest features with enhanced performance
- **TailwindCSS 4.1.12** - CSS-first @theme configuration with zinc colors
- **TypeScript 5.9.2** - Strict mode, enhanced type safety
- **Motion 12.23.12** - Next-generation animation primitives

### **🎨 Premium UI/UX**
- **Magic UI Pro** - Premium component library (Individual License)
- **shadcn/ui** - Modern component library with Radix UI primitives
- **Framer Motion 12.23.12** - Advanced animations and micro-interactions
- **Mobile-First** - Responsive design with touch-friendly interactions
- **WCAG 2.1 AA** - Full accessibility compliance

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- pnpm (recommended) or npm

### **Installation**
```bash
# Install dependencies
pnpm install

# Start development server (with Turbopack)
pnpm run dev

# Open http://localhost:3000
```

### **Development Commands**
```bash
pnpm run dev          # Start development server (with hot reload)
pnpm run build        # Build for production (~25s optimized)
pnpm start           # Start production server  
pnpm run lint        # ESLint code quality check
pnpm run type-check  # TypeScript validation
```

## 🏗️ **Project Architecture**

### **Directory Structure**
```
src/
├── app/                     # Next.js 15 App Router
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main funnel controller
│   ├── globals.css         # TailwindCSS v4 + zinc colors
│   └── actions/            # Server Actions
├── components/
│   ├── funnel/            # 🎯 Core funnel pages (3 components)
│   │   ├── landing-page.tsx
│   │   ├── checkout-form.tsx
│   │   └── thank-you-page.tsx
│   ├── layout/            # 🏠 Layout system (4 components)
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── main-layout.tsx
│   │   └── progress-bar.tsx
│   ├── ui/                # 🎨 UI components (8 components)
│   │   └── [button, card, input, badge, error-message, etc.]
│   └── providers/         # ⚛️ React Context providers (1 file)
├── hooks/                 # 🔗 Custom React hooks (6 hooks)
├── lib/                   # 🛠️ Utilities and constants
│   ├── constants.ts       # Pricing, copy, offers
│   ├── utils.ts          # Helper functions
│   └── env.ts            # Environment validation
└── types/                 # 📝 TypeScript definitions
```

### **State Management Pattern**
```typescript
// Centralized funnel state with React Context
FunnelProvider → useFunnel() → {
  step: 'landing' | 'checkout' | 'thankyou'
  purchase: { tripwire, bump, upsell, downsell }
  actions: { startCheckout, completeCheckout, acceptUpsell }
}
```

## 💰 **Funnel Configuration**

### **Pricing Structure**
```typescript
// Update in src/lib/constants.ts
export const PRICES = {
  TRIPWIRE: 97,     // Main DIY offer
  BUMP: 47,         // Bonus templates pack
  UPSELL: 9997,     // Done-For-You service
  DOWNSELL: 997     // Done-With-You service
} as const;
```

### **Content Customization**
- **Pricing**: `src/lib/constants.ts` → `PRICES` object
- **Copy**: `src/lib/constants.ts` → `OFFERS` and `SOCIAL_PROOF`  
- **Styling**: `src/app/globals.css` → CSS custom properties
- **Components**: Direct editing of component files

## 🔧 **Development Guide**

### **Adding New Components**
```bash
# UI components (shadcn/ui style)
src/components/ui/new-component.tsx

# Funnel-specific components  
src/components/funnel/new-step.tsx

# Follow existing patterns for TypeScript and styling
```

### **Environment Variables**
```bash
# Copy and customize
cp .env.example .env.local

# Required for production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

### **Code Quality Standards**
- **TypeScript**: Strict mode, no `any` types
- **ESLint**: Next.js + TypeScript rules
- **Components**: Server Components by default, Client only when needed
- **Styling**: Tailwind utilities, CSS custom properties for themes

## 📱 **Responsive Design**

Built mobile-first with Tailwind's responsive system:
- **sm (640px+)**: Small tablets
- **md (768px+)**: Tablets and small laptops  
- **lg (1024px+)**: Laptops and desktops
- **xl (1280px+)**: Large screens

## ⚡ **Performance Features**

### **Build Optimizations**
- **Turbopack**: 90%+ faster builds vs Webpack
- **React Compiler**: Automatic memoization and optimization
- **Code Splitting**: Route-based and dynamic imports
- **Bundle Analysis**: Optimized for minimal bundle size

### **Runtime Performance**
- **Server Components**: Reduced client-side JavaScript
- **Static Generation**: Pre-rendered pages where possible
- **Image Optimization**: Next.js automatic image optimization
- **Core Web Vitals**: Optimized for Google's performance metrics

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
# One-time setup
npm install -g vercel

# Deploy to production
vercel --prod

# Environment variables configured in Vercel dashboard
```

### **Other Platforms**
- **Netlify**: `npm run build && netlify deploy --prod`
- **Docker**: Multi-stage build with Node.js 18+
- **Static Export**: Configure in `next.config.js` if needed

## 🧪 **Testing & Quality**

```bash
# Type checking
npm run type-check

# Linting  
npm run lint

# Build validation
npm run build

# Manual testing checklist
✓ All funnel steps work correctly
✓ Form validation and submission
✓ Responsive design on mobile/desktop
✓ Order bump toggle functionality
✓ Upsell/downsell flow
```

## 🤝 **Contributing**

### **Development Workflow**
1. **Clone**: `git clone [repository-url]`
2. **Install**: `npm install` 
3. **Branch**: `git checkout -b feature/your-feature`
4. **Develop**: Make changes with `npm run dev`
5. **Quality**: Run `npm run lint` and `npm run type-check`
6. **Test**: Manual testing of funnel flow
7. **Submit**: Create pull request

### **Code Standards**
- Follow existing component patterns
- Maintain TypeScript strict mode compliance
- Use Server Components where possible
- Write descriptive commit messages

## 📚 **Additional Resources**

### **Essential Documentation**
- **CLAUDE.md** - Comprehensive Claude Code development guidance
- **MCP_SETUP_GUIDE.md** - MCP servers for Magic UI Pro, shadcn, Supabase, n8n

### **Key Configuration**
- **tailwind.config.ts** - Tailwind CSS configuration with zinc colors
- **tsconfig.json** - TypeScript strict mode configuration
- **eslint.config.js** - Modern ESLint setup with Next.js rules

## 🆘 **Support & Issues**

For questions about this codebase:
- **Component Patterns**: Review existing patterns in `src/components/`
- **Claude Code Guidance**: Check CLAUDE.md for comprehensive development guidance
- **Configuration**: Update `src/lib/constants.ts` for pricing and content
- **MCP Servers**: Use MCP_SETUP_GUIDE.md for Magic UI Pro, shadcn, Supabase setup

---

**Built with ❤️ using the latest 2025 web technologies**  
*Next.js 15.5.2 • React 19.1.1 • TailwindCSS 4.1.12 • TypeScript 5.9.2 • Motion 12.23.12*