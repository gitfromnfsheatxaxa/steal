# Brutal Gym UI Skill

## Purpose
Defines the distinctive brutalist UI conventions for the Steal Therapy fitness application. This skill ensures all UI components follow the industrial dark aesthetic with the "Steal Forges Steel" tone.

## Design Philosophy

### Core Principles
1. **Industrial Brutalism** — Raw, functional, no-nonsense design
2. **High Contrast** — Dark backgrounds with bold accent colors
3. **Typography-First** — Strong, readable type with clear hierarchy
4. **Progressive Disclosure** — Show only what's needed, when it's needed

### Color Palette
```css
/* Industrial Dark Theme */
--background: #0a0a0a
--foreground: #fafafa
--card: #111111
--card-foreground: #fafafa
--popover: #111111
--popover-foreground: #fafafa
--primary: #ffffff
--primary-foreground: #0a0a0a
--secondary: #27272a
--secondary-foreground: #fafafa
--muted: #27272a
--muted-foreground: #a1a1aa
--accent: #27272a
--accent-foreground: #fafafa
--destructive: #7f1d1d
--destructive-foreground: #fafafa
--border: #27272a
--input: #27272a
--ring: #ffffff

/* Fitness Accents */
--accent-gym: #3b82f6    /* Blue for primary actions */
--accent-progress: #22c55e  /* Green for progress/success */
--accent-warning: #f59e0b   /* Amber for warnings */
```

### Typography
- **Headings**: Inter or system-ui, bold weight, tight tracking
- **Body**: Inter or system-ui, regular weight, comfortable line-height
- **Numbers**: Tabular nums for metrics and stats

### Component Patterns

#### Buttons
- Primary: Solid white background, black text, sharp corners or subtle radius (2px)
- Secondary: Transparent with border, white text
- All buttons have clear hover states with subtle brightness shift

#### Cards
- Dark background (#111111)
- Subtle border (#27272a)
- Padding: 16px or 24px
- No shadows — use depth through layering

#### Forms
- Input backgrounds: #18181b
- Border on focus: white ring
- Labels: muted foreground color
- Error states: red accent with clear messaging

#### Progress Indicators
- Linear progress bars with solid fill
- Circular progress for stats/streaks
- Always show current value alongside visual

#### Data Display
- Metrics in large, bold type
- Labels in muted color, smaller size
- Use grids for aligned data

### Tone & Copy
- Direct, actionable language
- "Steal Forges Steel" mentality — progress through effort
- No cutesy animations or friendly microcopy
- Celebrate milestones without being cheesy

### Accessibility
- Minimum contrast ratio 4.5:1 for text
- Focus rings always visible
- Keyboard navigation for all interactive elements
- ARIA labels for icon-only buttons

## Usage
When implementing any UI component for Steal Therapy, reference this skill to ensure consistency with the brutal gym aesthetic.