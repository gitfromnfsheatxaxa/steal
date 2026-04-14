# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project intent

- Pure frontend web app — Next.js 15 (App Router + Server Components), TypeScript strict mode.
- Communicates with an existing backend via HTTP only. **All API calls must go through `src/lib/api.ts`** — no scattered `fetch` calls in components.
- Backend URL is read from `NEXT_PUBLIC_API_URL` (set in `.env.local`). The current value is a placeholder (`https://your-real-backend-url-here.com`) — ask the user before assuming a real URL.
- Deploy target: Vercel.

## Tech stack (locked — do not substitute without asking)

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, RSC, Turbopack dev) |
| Language | TypeScript 5, `strict: true` |
| Styling | Tailwind CSS **v4** (via `@tailwindcss/postcss`, no `tailwind.config.js` — tokens live in `globals.css` via `@theme`) |
| Components | shadcn/ui (New York style, neutral base, CSS variables) |
| Server state | `@tanstack/react-query` v5 |
| Client state | `zustand` v5 |
| Forms | `react-hook-form` + `zod` (via `@hookform/resolvers`) |
| Icons | `lucide-react` |
| Path alias | `@/*` → `src/*` |

Rule of thumb: Zustand for client-only state (UI toggles, ephemeral form wizards); TanStack Query for anything sourced from the backend.

## Folder structure

```
src/
├── app/
│   ├── layout.tsx        # root layout — Server Component
│   ├── page.tsx          # landing — Server Component
│   └── globals.css       # Tailwind v4 entry + CSS vars
├── components/           # shadcn/ui components land here (via `npx shadcn@latest add ...`)
├── hooks/                # custom React hooks (client)
├── lib/
│   ├── api.ts            # typed fetch wrapper for the backend — SINGLE source of outbound HTTP
│   └── utils.ts          # `cn()` helper for shadcn
├── types/                # shared TS types / DTOs
└── utils/                # pure helpers (non-React)
```

`components.json` at the repo root is the shadcn/ui config — aliases match this tree.

## Product rules

- Distinctive UI — no generic "AI slop" layouts. Prefer Server Components; only reach for `"use client"` when you need interactivity, browser APIs, or a client-only library.
- Every API call must handle **loading, error, and empty** states explicitly. An unhandled empty state counts as a bug.
- Accessibility and Core Web Vitals are first-class requirements, not polish.
- API calls must go through `src/lib/api.ts` (or a TanStack Query hook that wraps it). No bare `fetch()` in components.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start dev server at http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` strict typecheck |
| `npx shadcn@latest add <component>` | Add a shadcn/ui component into `src/components/ui/` |
    
Lint is not wired up yet — add `next lint` or an ESLint flat config in a follow-up if/when needed.

## Environment

- `.env.local` holds `NEXT_PUBLIC_API_URL`. It is gitignored via `.env*.local`. Do **not** commit real backend URLs here.
- Any new public env var must be prefixed `NEXT_PUBLIC_` to reach the browser; otherwise it is server-only.

## Environment & tooling gotchas

- **Platform is Windows + Git Bash.** Use Unix shell syntax in Bash tool calls (forward slashes, `/dev/null`). Hooks may still invoke PowerShell.
- `.claude/settings.json` defines a `PreToolUse` hook meant to block `Edit`/`Write` on `main`. It is currently written as a PowerShell one-liner which does not parse as bash — it fails open in this environment rather than blocking. If you hit unexpected hook failures (or unexpected successes on `main`), that hook is the likely cause. Fix it or work on a feature branch rather than routing around it.
- `.claude/skills/frontend-design/` and `.claude/skills/api-communication/` hold the UI and API conventions. Read them before inventing new patterns.
- `.claude/agents/` contains four agents: `architect.md`, `frontend-dev.md`, `workout-planner.md`, `reviewer.md`. Read them for role-specific instructions before delegating work.

## Token Efficiency & Context Management Rules (2026 Best Practices)

These rules must be followed in every project to maximize output quality while minimizing token usage. Never sacrifice code quality, reasoning depth, or creativity for token saving.

### Core Principles
- Be concise but complete. Prefer clarity over brevity when it affects understanding.
- Never repeat information that already exists in CLAUDE.md, global skills, or previous agent outputs unless explicitly asked.
- Keep responses focused. Only include what is necessary for the current task.
- Use structured, compact formats (tables, bullet points, YAML) when appropriate.

### Agent & Pipeline Rules
- When using multiple agents, keep the active agent count to a maximum of 5 unless the user explicitly requests more.
- Agents must reference existing files (CLAUDE.md, skills, SPEC.md) instead of re-explaining rules.
- After completing a major phase (e.g. planning, implementation, review), summarize the outcome in maximum 8–10 lines before moving to the next phase.
- Only load relevant skills and agents for the current task. Do not preload unnecessary ones.

### Response Style Rules
- Avoid long introductory explanations or motivational language unless the user asks for it.
- When suggesting code changes, show only the diff or the specific file/section being modified (not the entire file) unless the user requests full file output.
- Use "Continue" or "Next" style responses when a task has clear next steps instead of repeating the full plan.
- For code generation: Prioritize clean, production-ready code with minimal comments. Add comments only for complex logic.

### Context Management Rules
- At the end of every major milestone (after Architect, after Frontend-Dev, or after Reviewer), offer a short "Context Summary" (max 5 lines) that captures the current state. This helps future prompts stay efficient.
- If the conversation history becomes very long (>15 messages), suggest starting a fresh session with a condensed summary.
- Prefer referencing file paths and existing documentation over re-describing architecture or rules.

### Performance Safeguards (Do NOT limit quality)
- These token rules must never reduce reasoning quality, architectural thinking, or UI/design excellence.
- If a task requires deep analysis or creative solutions, use full reasoning even if it costs more tokens.
- Always prioritize correctness, type safety, accessibility, and distinctive UI over token optimization.
- When in doubt, favor quality over token saving and note the trade-off to the user.

### Recommended Workflow for Large Projects
1. Use Plan Mode for complex features first.
2. Execute with maximum 4–5 agents.
3. After each major phase, create/update a short SPEC.md or STATUS.md.
4. Regularly extract useful patterns into the global library to reduce future context load.