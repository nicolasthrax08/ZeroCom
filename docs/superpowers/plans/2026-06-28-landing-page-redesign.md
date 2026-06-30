# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current plain landing page with a cinematic, animated "wow" experience using GSAP + ScrollTrigger, generative art, elegant typography, and a teal + champagne/gold palette.

**Architecture:** The landing page is a single client component (`app/landing-shell.tsx`) composed of 7 section components in `components/landing/`. GSAP handles all scroll-triggered animations via timelines. A reusable `<GenerativeCanvas />` component renders particle art for hero and CTA sections. Existing `<Button>`, `<Badge>`, `<Card>`, and `<ListingCard>` components are reused. The design system extends Tailwind with new color tokens and the Instrument Sans font via `next/font`.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind 3, GSAP (gsap + ScrollTrigger), next/font (Instrument Sans), Lucide React icons, existing clsx/tailwind-merge utilities.

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `package.json` | Add `gsap` dependency |
| Modify | `tailwind.config.ts` | Add gold palette tokens, accent-deep |
| Modify | `app/globals.css` | Add new CSS custom properties, font-family update |
| Modify | `app/layout.tsx` | Load Instrument Sans via next/font, apply to body |
| Modify | `lib/i18n/dictionary.ts` | Add new section keys (problem, solution, how-it-works, calculator) |
| Create | `components/landing/generative-canvas.tsx` | Canvas-based particle system with connecting lines |
| Create | `components/landing/hero.tsx` | Hero section with generative art background |
| Create | `components/landing/problem.tsx` | Problem section with animated ¥200,000 number |
| Create | `components/landing/solution.tsx` | Solution section with SVG path-drawing connection |
| Create | `components/landing/how-it-works.tsx` | 3-step section with animated connecting path |
| Create | `components/landing/savings-calculator.tsx` | Interactive slider with live savings calculation |
| Create | `components/landing/featured-listings.tsx` | Staggered listing cards with hover spring |
| Create | `components/landing/cta-section.tsx` | Final CTA with ambient particle effect |
| Create | `components/landing/section-title.tsx` | Reusable heading + subtitle component |
| Create | `lib/hooks/use-reduced-motion.ts` | Hook to detect prefers-reduced-motion |
| Modify | `app/landing-shell.tsx` | Rewrite to compose new 7-section layout |
| Modify | `app/page.tsx` | No changes needed (already passes listings) |

---

## Tasks

### Task 1: Install GSAP dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add gsap to the project**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && npm install gsap
```

- [ ] **Step 2: Verify installation**

Run: `cat node_modules/gsap/package.json | grep '"version"'`
Expected: version string confirming gsap is installed

- [ ] **Step 3: Verify the build still works**

Run: `npx next build 2>&1 | tail -5`
Expected: no new errors from gsap

- [ ] **Step 4: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add package.json package-lock.json && git commit -m "deps: add gsap for scroll-driven animations"
```

---

### Task 2: Extend Tailwind config with new palette tokens

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Add new color tokens**

Replace the `colors` block in `tailwind.config.ts` with:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#111827',
        muted: '#f6f7f9',
        'muted-foreground': '#6b7280',
        border: '#e5e7eb',
        card: '#ffffff',
        primary: '#111827',
        'primary-foreground': '#ffffff',
        accent: '#0f766e',
        'accent-deep': '#0a3d39',
        'accent-soft': '#e6f7f5',
        gold: '#d4a574',
        'gold-soft': '#f5e6d3',
        'gold-surface': '#faf6f0',
        warning: '#f59e0b',
        danger: '#dc2626',
      },
      borderRadius: { lg: '0.5rem', xl: '0.75rem' },
      fontFamily: {
        sans: [
          '"Instrument Sans"',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Verify Tailwind compiles the new tokens**

Run: `npx next build 2>&1 | tail -5`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add tailwind.config.ts && git commit -m "style: extend palette with gold tokens and accent-deep, add Instrument Sans to font stack"
```

---

### Task 3: Update global CSS custom properties

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add new CSS custom properties**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: #ffffff;
    --foreground: #111827;
    --muted: #f6f7f9;
    --muted-foreground: #6b7280;
    --border: #e5e7eb;
    --card: #ffffff;
    --primary: #111827;
    --primary-foreground: #ffffff;
    --accent: #0f766e;
    --accent-deep: #0a3d39;
    --accent-soft: #e6f7f5;
    --gold: #d4a574;
    --gold-soft: #f5e6d3;
    --gold-surface: #faf6f0;
    --warning: #f59e0b;
    --danger: #dc2626;
  }
  html, body {
    background: var(--background);
    color: var(--foreground);
    font-family: "Instrument Sans", "PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  * { box-sizing: border-box; }
}
@layer components {
  .container-page {
    @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
  }
}
```

- [ ] **Step 2: Verify the dev server picks up changes**

Run: `curl -s http://localhost:3000 | grep -o '<body[^>]*>' | head -1`
Expected: body tag renders without error (dev server must be running)

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add app/globals.css && git commit -m "style: add gold and accent-deep CSS custom properties"
```

---

### Task 4: Add Instrument Sans font via next/font

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update layout.tsx with next/font**

```tsx
import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LanguageProvider } from '@/lib/i18n/language-context';
import { cookies } from 'next/headers';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-instrument',
});

export const metadata: Metadata = {
  title: 'ZeroCom · 零佣金房产直连',
  description: '零佣金，房东买家直接见面 — ZeroCom',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('zerocom_lang')?.value === 'en' ? 'en' : 'zh-CN';

  return (
    <html lang={lang} className={instrumentSans.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `npx next build 2>&1 | tail -10`
Expected: build succeeds, no font-related errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add app/layout.tsx && git commit -m "feat: add Instrument Sans font via next/font"
```

---

### Task 5: Add new i18n dictionary keys

**Files:**
- Modify: `lib/i18n/dictionary.ts`

- [ ] **Step 1: Add new section keys to the dictionary**

Add these keys after the existing `calc.savings` entry (line 62):

```ts
  // New landing sections (redesign)
  'problem.title': { zh: '你正在为中介费买单', en: 'You are paying broker fees' },
  'problem.subtitle': { zh: '传统中介 ≈ 2.5% 佣金', en: 'Traditional broker ≈ 2.5% commission' },
  'solution.title': { zh: '直接见面，零佣金', en: 'Meet directly, zero commission' },
  'solution.buyer': { zh: '房东直连买家', en: 'Sellers connect directly with buyers' },
  'solution.noFee': { zh: '无中介费', en: 'No broker fees' },
  'solution.free': { zh: '免费注册', en: 'Free to sign up' },
  'how.title': { zh: '三步上手', en: 'Get started in 3 steps' },
  'how.1': { zh: '注册', en: 'Sign up' },
  'how.1.desc': { zh: '手机号验证即可开始', en: 'Phone verification to start' },
  'how.2': { zh: '浏览', en: 'Browse' },
  'how.2.desc': { zh: '按城市、价格、户型筛选', en: 'Filter by city, price, bedrooms' },
  'how.3': { zh: '联系', en: 'Connect' },
  'how.3.desc': { zh: 'Pro 会员直连房东', en: 'Pro members connect directly' },
  'calc.title': { zh: '省多少？', en: 'How much do you save?' },
  'calc.traditional': { zh: '传统佣金（2.5%）', en: 'Traditional commission (2.5%)' },
  'calc.pro': { zh: 'ZeroCom Pro（年）', en: 'ZeroCom Pro (annual)' },
  'calc.savings': { zh: '节省', en: 'You save' },
  'calc.cta': { zh: '开始省钱', en: 'Start saving' },
  'featured.viewAll': { zh: '浏览全部', en: 'View all' },
  'cta.title': { zh: '开始你的零佣金之旅', en: 'Start your zero-commission journey' },
  'cta.subtitle': { zh: '免费注册，每天 5 次免费查看', en: 'Free signup, 5 free views per day' },
  'cta.signup': { zh: '立即注册', en: 'Sign up now' },
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: no type errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add lib/i18n/dictionary.ts && git commit -m "feat: add i18n keys for redesigned landing sections"
```

---

### Task 6: Create use-reduced-motion hook

**Files:**
- Create: `lib/hooks/use-reduced-motion.ts`

- [ ] **Step 1: Create the hook**

```ts
'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -10`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add lib/hooks/use-reduced-motion.ts && git commit -m "feat: add use-reduced-motion hook for accessibility"
```

---

### Task 7: Create SectionTitle component

**Files:**
- Create: `components/landing/section-title.tsx`

- [ ] **Step 1: Create the component**

```tsx
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionTitle({ title, subtitle, align = 'center' }: SectionTitleProps) {
  return (
    <div className={`mb-10 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -10`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add components/landing/section-title.tsx && git commit -m "feat: add SectionTitle component for landing sections"
```

---

### Task 8: Create GenerativeCanvas component

**Files:**
- Create: `components/landing/generative-canvas.tsx`

- [ ] **Step 1: Create the canvas particle system**

```tsx
'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface GenerativeCanvasProps {
  className?: string;
  particleCount?: number;
  colors?: string[];
  connectionDistance?: number;
  speed?: number;
}

export function GenerativeCanvas({
  className,
  particleCount = 30,
  colors = ['#0f766e', '#d4a574', '#e6f7f5'],
  connectionDistance = 120,
  speed = 0.4,
}: GenerativeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.15 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [particleCount, colors, connectionDistance, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className ?? ''}`}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -10`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add components/landing/generative-canvas.tsx && git commit -m "feat: add GenerativeCanvas particle system component"
```

---

### Task 9: Create Hero section

**Files:**
- Create: `components/landing/hero.tsx`

- [ ] **Step 1: Create the hero section**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GenerativeCanvas } from './generative-canvas';
import { useLanguage } from '@/lib/i18n/language-context';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import Link from 'next/link';

export function HeroSection() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(badgeRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
        .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .fromTo(chevronRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');

      gsap.to(chevronRef.current, {
        y: 8,
        duration: 1,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, containerRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-accent-deep"
    >
      <GenerativeCanvas />
      <div className="container-page relative z-10 py-24 text-center">
        <div ref={badgeRef} className="mb-6">
          <Badge
            tone="accent"
            className="border border-white/10 bg-white/10 text-white backdrop-blur-sm"
          >
            {t('hero.badge')}
          </Badge>
        </div>
        <h1
          ref={titleRef}
          className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          {t('hero.title')}
        </h1>
        <p
          ref={subtitleRef}
          className="mx-auto mt-5 max-w-2xl text-base text-white/70 sm:text-lg"
        >
          {t('hero.subtitle')}
        </p>
        <div ref={ctaRef} className="mt-8 flex items-center justify-center gap-4">
          <Link href="/listings">
            <Button
              variant="accent"
              size="lg"
              className="bg-white text-accent-deep hover:bg-white/90"
            >
              {t('hero.cta.browse')}
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              variant="outline"
              size="lg"
              className="border-gold/50 text-gold hover:bg-gold/10"
            >
              {t('hero.cta.pricing')}
            </Button>
          </Link>
        </div>
      </div>
      <div
        ref={chevronRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -10`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add components/landing/hero.tsx && git commit -m "feat: add Hero section with generative canvas and GSAP entrance"
```

---

### Task 10: Create Problem section

**Files:**
- Create: `components/landing/problem.tsx`

- [ ] **Step 1: Create the problem section**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/i18n/language-context';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';

gsap.registerPlugin(ScrollTrigger);

export function ProblemSection() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animated number count-up
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 200000,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: numberRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.textContent = `¥${Math.round(obj.val).toLocaleString('zh-CN')}`;
          }
        },
      });

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.3,
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-accent-deep to-background py-24 sm:py-32"
    >
      <div className="container-page text-center">
        <h2
          ref={titleRef}
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {t('problem.title')}
        </h2>
        <div className="mt-10">
          <span
            ref={numberRef}
            className="text-6xl font-extrabold tabular-nums text-danger sm:text-8xl"
          >
            ¥0
          </span>
        </div>
        <p
          ref={subtitleRef}
          className="mt-4 text-lg text-muted-foreground"
        >
          {t('problem.subtitle')}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -10`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add components/landing/problem.tsx && git commit -m "feat: add Problem section with animated counting number"
```

---

### Task 11: Create Solution section

**Files:**
- Create: `components/landing/solution.tsx`

- [ ] **Step 1: Create the solution section**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/i18n/language-context';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { User, Handshake, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function SolutionSection() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const zeroRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-solution-title]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: { trigger: '[data-solution-title]', start: 'top 80%' },
        }
      );

      // Draw the connecting path
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: pathRef.current, start: 'top 80%' },
        });
      }

      // Fade in ¥0 at center
      gsap.fromTo(
        zeroRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: zeroRef.current, start: 'top 85%' },
        }
      );

      // Value props stagger
      gsap.fromTo(
        '[data-value-prop]',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          scrollTrigger: { trigger: '[data-value-prop]', start: 'top 85%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  const valueProps = [
    { icon: User, label: t('solution.buyer') },
    { icon: Handshake, label: t('solution.noFee') },
    { icon: ShieldCheck, label: t('solution.free') },
  ];

  return (
    <section ref={sectionRef} className="bg-background py-24 sm:py-32">
      <div className="container-page">
        <h2
          data-solution-title
          className="mb-16 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {t('solution.title')}
        </h2>

        {/* Connection visual */}
        <div className="relative mx-auto mb-16 flex h-32 max-w-md items-center justify-center">
          {/* Left circle */}
          <div className="absolute left-0 h-12 w-12 rounded-full bg-accent-soft" />
          {/* Right circle */}
          <div className="absolute right-0 h-12 w-12 rounded-full bg-gold-soft" />
          {/* SVG path */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 128" fill="none">
            <path
              ref={pathRef}
              d="M48 64 C 120 20, 280 100, 352 64"
              stroke="#0f766e"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {/* Center ¥0 */}
          <span
            ref={zeroRef}
            className="relative z-10 rounded-full bg-accent px-4 py-2 text-2xl font-bold text-white"
          >
            ¥0
          </span>
        </div>

        {/* Value props */}
        <div className="grid gap-8 sm:grid-cols-3">
          {valueProps.map((vp) => (
            <div
              key={vp.label}
              data-value-prop
              className="flex flex-col items-center text-center"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                <vp.icon size={24} />
              </div>
              <p className="text-sm font-medium text-foreground">{vp.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -10`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add components/landing/solution.tsx && git commit -m "feat: add Solution section with SVG path-drawing connection"
```

---

### Task 12: Create HowItWorks section

**Files:**
- Create: `components/landing/how-it-works.tsx`

- [ ] **Step 1: Create the how-it-works section**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/i18n/language-context';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { UserPlus, Search, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEP_ICONS = [UserPlus, Search, MessageCircle];

export function HowItWorksSection() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-how-title]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: { trigger: '[data-how-title]', start: 'top 80%' },
        }
      );

      // Draw connecting path
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: pathRef.current, start: 'top 80%' },
        });
      }

      gsap.fromTo(
        '[data-step]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.2,
          scrollTrigger: { trigger: '[data-step]', start: 'top 80%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  const steps = [
    { n: '1', title: t('how.1'), desc: t('how.1.desc') },
    { n: '2', title: t('how.2'), desc: t('how.2.desc') },
    { n: '3', title: t('how.3'), desc: t('how.3.desc') },
  ];

  return (
    <section ref={sectionRef} className="bg-background py-24 sm:py-32">
      <div className="container-page">
        <h2
          data-how-title
          className="mb-16 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {t('how.title')}
        </h2>

        <div className="relative grid gap-8 sm:grid-cols-3">
          {/* Connecting path (desktop only) */}
          <svg
            className="pointer-events-none absolute top-12 hidden h-1 w-full sm:block"
            viewBox="0 0 600 4"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              ref={pathRef}
              d="M0 2 C 150 0, 450 4, 600 2"
              stroke="#d4a574"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <div
                key={step.n}
                data-step
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/20">
                  <Icon size={28} />
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-white">
                    {step.n}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -10`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add components/landing/how-it-works.tsx && git commit -m "feat: add HowItWorks section with animated connecting path"
```

---

### Task 13: Create Savings Calculator section

**Files:**
- Create: `components/landing/savings-calculator.tsx`

- [ ] **Step 1: Create the savings calculator**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/i18n/language-context';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const COMMISSION_RATE = 0.025;
const PRO_ANNUAL = 199;
const MIN_PRICE = 100;
const MAX_PRICE = 2000;

export function SavingsCalculatorSection() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [priceWan, setPriceWan] = useState(800);

  const traditional = Math.round(priceWan * COMMISSION_RATE * 10000);
  const savings = traditional - PRO_ANNUAL;

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-calc-title]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: { trigger: '[data-calc-title]', start: 'top 80%' },
        }
      );
      gsap.fromTo(
        '[data-calc-card]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: { trigger: '[data-calc-card]', start: 'top 80%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="bg-gold-surface py-24 sm:py-32">
      <div className="container-page">
        <h2
          data-calc-title
          className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {t('calc.title')}
        </h2>

        <div data-calc-card className="mx-auto max-w-xl">
          {/* Slider */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t('calc.price')}: <span className="font-bold tabular-nums">¥{priceWan}万</span>
            </label>
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={10}
              value={priceWan}
              onChange={(e) => setPriceWan(Number(e.target.value))}
              className="w-full accent-accent"
              aria-label="Property value in wan yuan"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>¥{MIN_PRICE}万</span>
              <span>¥{MAX_PRICE}万</span>
            </div>
          </div>

          {/* Comparison */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-xs text-muted-foreground">{t('calc.traditional')}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-danger line-through sm:text-3xl">
                ¥{traditional.toLocaleString('zh-CN')}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-xs text-muted-foreground">{t('calc.pro')}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-accent sm:text-3xl">
                ¥{PRO_ANNUAL}
              </p>
            </div>
            <div className="rounded-xl border border-accent bg-accent/5 p-4 text-center">
              <p className="text-xs text-muted-foreground">{t('calc.savings')}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-accent sm:text-3xl">
                ¥{savings.toLocaleString('zh-CN')}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/auth">
              <Button variant="accent" size="lg">
                {t('calc.cta')} →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -10`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add components/landing/savings-calculator.tsx && git commit -m "feat: add interactive Savings Calculator section"
```

---

### Task 14: Create Featured Listings section

**Files:**
- Create: `components/landing/featured-listings.tsx`

- [ ] **Step 1: Create the featured listings section**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ListingCard } from '@/components/listings/listing-card';
import { SectionTitle } from './section-title';
import { useLanguage } from '@/lib/i18n/language-context';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedListingsProps {
  listings: Awaited<ReturnType<typeof import('@/server/data/store').store.listListings>>;
}

export function FeaturedListingsSection({ listings }: FeaturedListingsProps) {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-featured-title]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: { trigger: '[data-featured-title]', start: 'top 80%' },
        }
      );
      gsap.fromTo(
        '[data-listing-card]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-listing-card]', start: 'top 85%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="bg-background py-24 sm:py-32">
      <div className="container-page">
        <div data-featured-title>
          <SectionTitle title={t('landing.featured')} subtitle={t('landing.featured.sub')} />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <div key={listing.id} data-listing-card className="transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/listings"
            className="text-sm font-medium text-accent hover:text-accent/80"
          >
            {t('featured.viewAll')} →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -10`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add components/landing/featured-listings.tsx && git commit -m "feat: add Featured Listings section with staggered reveal"
```

---

### Task 15: Create CTA section

**Files:**
- Create: `components/landing/cta-section.tsx`

- [ ] **Step 1: Create the CTA section**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { GenerativeCanvas } from './generative-canvas';
import { useLanguage } from '@/lib/i18n/language-context';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-cta-title]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: { trigger: '[data-cta-title]', start: 'top 80%' },
        }
      );
      gsap.fromTo(
        '[data-cta-sub]',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: { trigger: '[data-cta-sub]', start: 'top 85%' },
        }
      );
      gsap.fromTo(
        '[data-cta-buttons]',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          scrollTrigger: { trigger: '[data-cta-buttons]', start: 'top 85%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-accent-deep py-24 sm:py-32"
    >
      <GenerativeCanvas particleCount={15} speed={0.2} />
      <div className="container-page relative z-10 text-center">
        <h2
          data-cta-title
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          {t('cta.title')}
        </h2>
        <p data-cta-sub className="mt-3 text-base text-white/70">
          {t('cta.subtitle')}
        </p>
        <div data-cta-buttons className="mt-8 flex items-center justify-center gap-4">
          <Link href="/auth">
            <Button
              variant="accent"
              size="lg"
              className="bg-white text-accent-deep hover:bg-white/90"
            >
              {t('cta.signup')}
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              variant="outline"
              size="lg"
              className="border-gold/50 text-gold hover:bg-gold/10"
            >
              {t('hero.cta.pricing')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -10`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add components/landing/cta-section.tsx && git commit -m "feat: add CTA section with ambient particle effect"
```

---

### Task 16: Rewrite landing-shell.tsx to compose new sections

**Files:**
- Modify: `app/landing-shell.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
'use client';

import { HeroSection } from '@/components/landing/hero';
import { ProblemSection } from '@/components/landing/problem';
import { SolutionSection } from '@/components/landing/solution';
import { HowItWorksSection } from '@/components/landing/how-it-works';
import { SavingsCalculatorSection } from '@/components/landing/savings-calculator';
import { FeaturedListingsSection } from '@/components/landing/featured-listings';
import { CTASection } from '@/components/landing/cta-section';

export function LandingShell({ listings }: { listings: Awaited<ReturnType<typeof import('@/server/data/store').store.listListings>> }) {
  return (
    <main>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <SavingsCalculatorSection />
      <FeaturedListingsSection listings={listings} />
      <CTASection />
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -10`
Expected: no errors

- [ ] **Step 3: Run the full build**

Run: `npx next build 2>&1 | tail -15`
Expected: build succeeds with no errors

- [ ] **Step 4: Manual smoke test**

Run: `npx next dev -p 3000` then visit `http://localhost:3000`
Expected: landing page renders with all 7 sections, animations play on scroll, no console errors

- [ ] **Step 5: Commit**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git add app/landing-shell.tsx && git commit -m "feat: rewrite landing-shell to compose 7 redesigned sections"
```

---

### Task 17: Final verification and cleanup

**Files:**
- Verify: full project build

- [ ] **Step 1: Run full type check**

Run: `npx tsc --noEmit 2>&1`
Expected: zero errors

- [ ] **Step 2: Run full production build**

Run: `npx next build 2>&1 | tail -20`
Expected: build succeeds, all pages generated

- [ ] **Step 3: Run tests**

Run: `npm test 2>&1 | tail -10`
Expected: all existing tests pass (no regressions)

- [ ] **Step 4: Verify no stale imports remain**

Run: `grep -r "FadeIn\|FadeInStagger\|WhyUsSection\|StepsSection" app/ components/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v node_modules`
Expected: no references to old components (they are now unused — safe to leave or delete)

- [ ] **Step 5: Final commit (if cleanup needed)**

```bash
cd "/Users/fostiernicolas/Downloads/ZeroCom copy" && git status
```
