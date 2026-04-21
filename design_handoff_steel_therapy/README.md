# Steel Therapy — Design Handoff

**Feature:** Full UI redesign — glassmorphism + forge background system  
**Fidelity:** High-fidelity prototype  
**Target:** Next.js 15 App Router · TypeScript · Tailwind v4 · shadcn/ui (New York) · PocketBase

---

## About the Design Files

The files in this bundle (`Steel Therapy HiFi.html` and `Steel Therapy Wireframes.html`) are **design references built in plain HTML/React**. They show intended look, layout, and behavior. Your task is to **recreate these designs inside your existing Next.js codebase** using your established component patterns, shadcn/ui primitives, Tailwind v4 classes, and PocketBase data hooks — not to ship the HTML files directly.

---

## Fidelity

**High-fidelity.** The hi-fi prototype uses final colors, typography, spacing, animations, and interactions. Implement pixel-for-pixel where possible. The wireframes file shows structural alternatives that were explored and then resolved into the hi-fi — use the hi-fi as the source of truth.

---

## Design → Existing Code Token Mapping

Your `globals.css` already has most of these values under different names. Map them as follows:

| Design role | Design value | Your existing token | Notes |
|---|---|---|---|
| Forge accent (CTAs, active) | `#e53e00` | `--steal-steel: #C2410C` | Use `--steal-steel` / `bg-[#C2410C]`. Bump lightness slightly if desired |
| Accent hover | `#ff4500` | `--steal-steel-hover: #EA580C` | Already exists |
| Accent glow | `rgba(229,62,0,.3)` | `--steel-glow: rgba(234,88,12,.3)` | Already exists |
| Background void | `#080808` | `--background: #050505` | Already exists, use as-is |
| Card surface | `rgba(255,255,255,.05)` | New — glass utility | See globals.css additions below |
| Border subtle | `rgba(255,255,255,.08)` | `--border: #1a1a1a` | Keep solid for non-glass, use rgba for glass |
| Success / streak | `#22c55e` | `--tactical: #166534` | Use `text-[#22c55e]` for text, `--tactical` for BG |
| Primary heading font | Oswald | **Barlow Condensed** | Your codebase uses Barlow Condensed — keep it, it's the same DNA |
| Data / mono font | Share Tech Mono | JetBrains Mono (`font-data`) | Keep JetBrains Mono — already in your stack |
| Text high | `#f0f0f0` | `--ink-high: #E5E5E5` | Use `text-ink-high` |
| Text muted | `#444` | `--ink-dim: #525252` | Use `text-ink-dim` |

---

## New Globals to Add to `globals.css`

Add these to the `:root` block inside your existing `@theme` / `:root`:

```css
/* ── Glassmorphism system ─────────────────────────────────── */
--glass-bg:        rgba(255, 255, 255, 0.05);
--glass-bg-hover:  rgba(255, 255, 255, 0.08);
--glass-bg-acc:    rgba(194, 65, 12, 0.08);      /* steal-steel tinted */
--glass-border:    rgba(255, 255, 255, 0.08);
--glass-border-acc:rgba(194, 65, 12, 0.30);
--glass-blur:      20px;
--glass-shadow:    0 8px 32px rgba(0, 0, 0, 0.5);
--glass-shadow-acc:0 8px 32px rgba(194, 65, 12, 0.15);

/* ── Forge background blobs ───────────────────────────────── */
--forge-blob-1:    rgba(194, 65, 12, 0.18);
--forge-blob-2:    rgba(194, 65, 12, 0.12);
--forge-blob-3:    rgba(150, 40, 0, 0.08);
```

Add these **utility classes** to `globals.css` (after the `:root` block):

```css
/* Glass card — base */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,0.06);
}

/* Glass card — forge accent tint */
.glass-acc {
  background: var(--glass-bg-acc);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-acc);
  box-shadow: var(--glass-shadow-acc), inset 0 1px 0 rgba(194,65,12,0.08);
}

/* Glass card — opaque dark (navbar, bottom nav) */
.glass-dark {
  background: rgba(5, 5, 5, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.06);
}

/* Hover lift for glass cards */
.glass-hover {
  transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1),
              box-shadow 300ms cubic-bezier(0.23, 1, 0.32, 1),
              border-color 300ms;
}
.glass-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.6),
              0 0 0 1px rgba(194,65,12,0.2),
              inset 0 1px 0 rgba(255,255,255,0.10);
}

/* Forge accent pulse animation */
@keyframes forge-pulse {
  0%, 100% { box-shadow: 0 0 0 rgba(194,65,12,0); }
  50%       { box-shadow: 0 0 24px rgba(194,65,12,0.3); }
}
.forge-pulse {
  animation: forge-pulse 3s ease-in-out infinite;
}

/* Fade-up stagger entry */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up   { animation: fade-up 400ms cubic-bezier(0.23,1,0.32,1) both; }
.fade-up-1 { animation-delay: 50ms; }
.fade-up-2 { animation-delay: 100ms; }
.fade-up-3 { animation-delay: 150ms; }
.fade-up-4 { animation-delay: 200ms; }
.fade-up-5 { animation-delay: 250ms; }
```

---

## Component: AmbientGymLayer (Forge Background)

Update `components/layout/AmbientGymLayer.tsx` to render the living forge effect:

```tsx
// Three slow-moving radial blobs + tactical grid + noise overlay
// All at will-change: transform for GPU compositing
// Mouse parallax: shift blob positions by ±20px on mousemove
// Scroll parallax: translateY blobs by -scrollY * 0.03

// Blob sizes and positions:
// blob-1: 600×600px, top:-200px left:-100px, opacity 0.18, 18s animation
// blob-2: 400×400px, bottom:-100px right:-80px, opacity 0.12, 22s animation
// blob-3: 300×300px, center (40%/40%), opacity 0.08, 28s animation

// Tactical grid: 
// background-image: linear-gradient(rgba(194,65,12,.025) 1px, transparent 1px),
//                   linear-gradient(90deg, rgba(194,65,12,.025) 1px, transparent 1px)
// background-size: 40px 40px
// Very subtle — if it looks too busy, reduce to rgba(194,65,12,.015)

// Noise texture: SVG feTurbulence at opacity 0.03 — adds steel grain depth
// Keep total background opacity LOW — UI must be readable above it
```

**Mouse parallax hook** (add to `hooks/useMouseParallax.ts`):
```ts
export function useMouseParallax(strength = 20) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * strength;
      const y = (e.clientY / window.innerHeight - 0.5) * strength;
      setOffset({ x, y });
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, [strength]);
  return offset;
}
```

---

## Screens

### 1. Dashboard (`/dashboard`)

**Layout:** Full-width desktop. Top navbar (sticky) + scrollable content area.

**Structure:**
```
<header> sticky top navbar (52px)
<main>
  ├── Header strip (title + operator + clock) — border-bottom 1px rgba(255,255,255,.06)
  ├── KPI row — CSS grid 4 columns, gap 8px
  ├── Main grid — 3 columns (2fr 1.2fr 1fr), gap 10px
  │   ├── Col 1: Active Mission (glass-acc, forge-pulse)
  │   ├── Col 2: Week Schedule + Upcoming sessions
  │   └── Col 3: Activity Log + Recent PRs
  └── HUD strip — border-top 2px steal-steel, 3 cells
```

**KPI Cards:**
- Container: `glass kpi` — left border 2px per accent, `p-3`
- Label: `font-data text-[8px] tracking-[.2em] text-ink-dim uppercase`
- Value: `font-heading text-[26px] font-black` colored per accent
- Unit: `font-data text-[8px] text-ink-dim`
- Accents: streak=`#22c55e`, sessions/volume=`--steal-steel`, prs=`#3b82f6`
- Entry: `.fade-up` with staggered delays

**Active Mission Card (glass-acc + forge-pulse):**
- Border: `1px solid rgba(194,65,12,.30)`
- Background: `rgba(194,65,12,.08)` + `backdrop-blur-xl`
- Progress ring: SVG, stroke-dasharray calculated from program % complete
- Exercise list: `font-heading text-[12px] font-semibold uppercase tracking-[.03em] text-[#bbb]`
- CTA button: `bg-[--steal-steel] hover:bg-[--steal-steel-hover] h-9 w-full font-heading font-black uppercase tracking-widest text-[12px]` + forge glow on hover

**Week Schedule Grid:**
- 7 columns, gap 3px
- Each cell: `border border-[rgba(255,255,255,.05)] text-center`
- Active (next) session: `border-steal-steel bg-[rgba(194,65,12,.08)]`
- Completed: `border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.04)]`
- REST DAY: neutral `—` with `text-[#1e1e1e]`, label text "REST" — **no red or green**

---

### 2. Live Workout (`/workout/[sessionId]`)

**Layout:** Mobile-first. Full-height with bottom nav (56px). Sticky header with session title + rest timer.

**Header (glass-dark, sticky top-0):**
- Left: back arrow (acc color) + session title (font-heading 20px bold) + subtitle (font-data 8px)
- Right: rest timer box (glass-acc, `font-data text-[18px] font-bold text-steal-steel`)

**5-step progress bar:**
- 5 flex-1 divs, `height: 3px`, active=`bg-steal-steel + glow shadow`, inactive=`bg-[rgba(255,255,255,.06)]`

**Exercise Accordion Cards:**
- Completed: `glass opacity-50`
- Active: `glass-acc` + animated left border
- Collapsed: shows name + tags + status icon only
- Expanded (active only): shows GIF placeholder + set rows + action buttons

**GIF Placeholder:**
- `height: 100px` — `bg-[rgba(0,0,0,.4)]` + `border border-dashed border-[rgba(255,255,255,.06)]`
- Diagonal stripe pattern at `opacity: 0.04`
- Center label: `▶` at `opacity:0.15` + `font-data text-[8px] text-ink-dim`
- When real GIFs exist: replace with `<ExerciseMedia>` component

**Set Rows (SetRow component):**
- Done: `border-[rgba(34,197,94,.2)] bg-[rgba(34,197,94,.04)]`
- Active: `border-[rgba(194,65,12,.4)] bg-[rgba(194,65,12,.06)]`
- Weight/reps inputs: `bg-[rgba(0,0,0,.5)] border-[rgba(255,255,255,.08)] font-data text-[14px] text-center w-[52px] h-[28px]`
- Active inputs: `border-[rgba(194,65,12,.5)] text-steal-steel bg-[rgba(194,65,12,.08)]`
- Done checkbox: `border-[rgba(34,197,94,.4)] bg-[rgba(34,197,94,.1)]` with ✓ in `#22c55e`

**Action buttons:**
- `+ Add Set`: ghost, `h-32 flex-1` — `border border-[rgba(255,255,255,.1)] text-[#888]`
- `Log Set ✓`: forge, `h-32 flex-2` — `bg-steal-steel text-white font-heading font-black`

**Bottom bar (glass-dark, position fixed bottom-[56px]):**
- Left: mood selector row (5 emoji in 24×24 boxes)
- Right: `FINISH SESSION` forge button

---

### 3. Progress / Analytics (`/progress`)

**Layout:** Mobile-first scrollable. Bottom nav.

**Section order (top to bottom):**
1. Page header + accent underline
2. 3-column KPI strip (streak/volume/PRs)
3. Volume Trend bar chart (8 weeks)
4. 2-col: Lift Progression line chart + Muscle Radar spider
5. Calendar Heatmap (52 columns × variable rows)
6. 2-col: Split Donut + Streak counter
7. **PR Board table** (5 columns: exercise / 1RM / 3RM / 5RM / date)
8. **PR Wall** (3 cards in a grid)
9. Achievements board

**Heatmap cells:** 
- High activity: `bg-steal-steel` + `box-shadow: 0 0 4px steal-steel`  
- Medium: `bg-[rgba(194,65,12,.55)]`
- Low: `bg-[rgba(194,65,12,.12)]`
- None: `bg-[rgba(255,255,255,.04)]`

**PR Board:**
- Header row: `bg-[rgba(0,0,0,.4)] font-data text-[7px] tracking-[.08em] text-ink-dim`
- 1RM column: `font-data text-[12px] text-steal-steel font-bold`
- Alternating rows: `bg-[rgba(255,255,255,.03)]` / `bg-[rgba(0,0,0,.2)]`

**PR Wall Cards (glass-acc, glass-hover):**
- Icon emoji: `text-[22px]` centered
- Exercise: `font-heading text-[12px] font-bold uppercase text-[#aaa]`
- Weight: `font-heading text-[22px] font-bold text-steal-steel` + `text-shadow: 0 0 20px steal-steel`
- Date: `font-data text-[7px] text-ink-dim`

---

### 4. Programs Browse (`/programs`)

**Layout:** Mobile-first, 2-column grid. Bottom nav.

**Filter strip:** Horizontal scroll, pill buttons. Active pill: `bg-steal-steel text-white`. Inactive: `border-[rgba(255,255,255,.06)] text-ink-dim`.

**Program Cards:**
- Image area: `height: 120px` — real athlete photo (or placeholder). No border-radius.
- Featured card: `border border-steal-steel`
- Standard card: `border border-[rgba(255,255,255,.06)]`
- Title: `font-heading text-[14px] font-bold uppercase text-[#e0e0e0]`
- Meta: `font-data text-[8px] text-ink-dim`
- Tags: `tag` class
- CTA: featured=forge button, others=ghost button

---

### 5. Exercises Library (`/exercises`)

**Layout:** Mobile-first. Top has search bar + filter chips. Then scrollable list.

**Search bar (glass-acc):**
- `height: 40px`, full width
- Icon: `⌕` in steal-steel at `opacity: 0.5`
- Placeholder: `font-heading text-[13px] text-ink-dim`
- On focus: `border-steal-steel`

**Exercise list items (glass, glass-hover):**
- GIF thumbnail: `44×44px` hatch placeholder → replaced by `<ExerciseMedia>` when real GIFs land
- Name: `font-heading text-[14px] font-bold uppercase text-[#ddd]`
- Muscles: `font-data text-[7px] text-ink-dim`
- Tags: `tag` class
- Arrow: `font-data text-[14px] text-ink-dim`

---

### 6. Plans (`/plans`)

**Tab strip (glass):**
- Active tab: `border-b-2 border-steal-steel bg-[rgba(194,65,12,.06)]`
- Label: `font-data text-[9px] tracking-[.08em] text-steal-steel`

**Active plan card (glass-acc + forge-pulse):**
- Progress bar: `height: 3px, bg-steal-steel` + linear-gradient glow
- CTA row: forge button (Continue) + ghost button (Details)

**Plan detail `/plans/[planId]`:**
- Week selector: 12-cell row, scrollable horizontal. Active=`border-steal-steel`, done=`border-[rgba(34,197,94,.2)]`, future=`border-[rgba(255,255,255,.05)]`
- Day cards: done=`glass opacity-50 border-[rgba(34,197,94,.2)]`, next=`glass-acc`, locked=`glass opacity-40`

---

### 7. Onboarding (`/onboarding`)

**Layout:** Full-screen, no navbar/bottom nav. Dark void background.

**Step progress bar:**
- 4 segments, flex-1, `height: 2px`
- Completed: `bg-steal-steel`
- Current: `bg-[rgba(194,65,12,.4)]`
- Future: `bg-[rgba(255,255,255,.06)]`
- Label below each: `font-data text-[6px] tracking-[.08em]`

**Injury checkboxes (LimitationsStep):**
- Checked: `border-steal-steel bg-[rgba(194,65,12,.1)]`
- Checkbox itself: `bg-steal-steel` when checked, `✓` in white
- Label: checked=`text-[#e0e0e0]`, unchecked=`text-ink-dim`

**Navigation:**
- Back: ghost button, `h-42`
- Continue: forge button, `flex-1 h-42 text-[14px]`

---

## Interactions & Animations

### Page transitions
Your existing `PageTransition` provider handles route changes. Ensure it uses:
```
duration: 0.3s
easing: cubic-bezier(0.23, 1, 0.32, 1)
type: fade + translateY(8px) → translateY(0)
```

### Hover states (all interactive elements)
```css
transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
```
- Glass cards: `translateY(-2px)` + enhanced shadow
- Forge buttons: `bg lighten` + `0 0 24px rgba(194,65,12,.5)` glow
- Nav links: color transition only

### Screen load (fade-up stagger)
Apply `.fade-up` + `.fade-up-N` classes to each content block.
First element appears at 0ms, each subsequent adds 50ms delay.
Max 5 stagger steps, then everything loads together.

### KPI counters
Use your existing `<CounterFX>` / `<ImpactFlash>` component for the number roll-up on dashboard KPIs.

### Rest timer
`useRestTimer()` hook already exists. Display in `glass-acc` box, `font-data text-[18px] font-bold text-steal-steel`.

---

## Build Priority Order

```
Week 1  globals.css tokens + .glass utility classes
        AmbientGymLayer forge background (blobs + grid + noise)
        AppShell update — glass-dark navbar and bottom nav

Week 2  Dashboard KPI cards (glass + KpiPanel)
        Active Mission card (glass-acc + forge-pulse)
        WeekGrid component (REST DAY = neutral)

Week 3  WorkoutSession screen
        ExerciseCard accordion with GIF placeholder
        SetRow inputs (done/active states)
        RestTimer display

Week 4  Progress screen
        Charts (recharts — existing library)
        PR Board table
        PR Wall 3-card grid

Week 5  Programs grid (120px image cards)
        Exercises library (search + filter + list)
        Plan detail (week selector + day cards)

Week 6  Onboarding wizard glass treatment
        Settings page
        Page transition polish
        Performance audit (backdrop-filter fallback for low-end)
```

---

## Design Tokens — Quick Reference

```
Background:       #050505
Surface 1:        #0a0a0a
Surface 2:        #111111
Glass BG:         rgba(255,255,255,0.05)
Glass border:     rgba(255,255,255,0.08)
Accent (forge):   #C2410C  (--steal-steel)
Accent hover:     #EA580C  (--steal-steel-hover)
Accent glow:      rgba(234,88,12,0.3)
Success/streak:   #22c55e
Info/PRs:         #3b82f6
Text high:        #E5E5E5  (--ink-high)
Text mid:         #A3A3A3  (--ink-mid)
Text dim:         #525252  (--ink-dim)
Border:           rgba(255,255,255,0.06)–rgba(255,255,255,0.08)
Radius:           0px (--radius: 0px — already set)
Heading font:     Barlow Condensed (existing) / Oswald (in prototype)
Data font:        JetBrains Mono (--font-data, existing)
Button height:    36px (desktop) / 40–44px (mobile touch targets)
Card padding:     12–16px
Section gap:      8–14px
```

---

## Assets

- Exercise GIFs: handled by `<ExerciseMedia>` component — already built
- Athlete photos (Programs): use placeholder pattern until real assets land
- Icons: lucide-react — already in stack

---

## Files in This Bundle

| File | Purpose |
|---|---|
| `Steel Therapy HiFi.html` | **Primary reference** — interactive hi-fi prototype, 5 screens, forge background, glassmorphism |
| `Steel Therapy Wireframes.html` | Layout exploration — 7 sections, 14 artboards showing all screens including wireframe variants |
| `README.md` | This document |

> Open `Steel Therapy HiFi.html` in a browser. Navigate screens via the top navbar or bottom tabs. Click `▲ Developer Implementation Guide` at the bottom for inline code snippets.
