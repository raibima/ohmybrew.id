## Oh My Brew – AGENTS Guide

Short rules for how AI agents should work on this repo.

---

## 1. Core References

- **Always check**:
  - `business.md` for product/operations context.
  - `design.md` for brand, design tokens, and UI rules.
- Re-skim both before **any** UX, IA, or copy-heavy change.

---

## 2. Tech Stack & Architecture

- **Framework**: Next.js (App Router, `app/` directory).
- **Language**: TypeScript.
- **Styling**:
  - Tailwind-style utilities with CSS variables.
  - Global styles in `app/globals.css`.
- **Components**:
  - Reuse primitives in `components/ui` and `components/ui/ds` first.
  - Prefer composition; keep page-specific components near their pages.

---

## 3. Coding Rules

- Keep changes **small and scoped**; avoid wide refactors unless explicitly requested.
- Preserve behavior and styling unless clearly buggy or misaligned with `design.md`.
- Maintain **type safety**:
  - Don’t leave TypeScript errors you introduced.
  - Prefer explicit types for exported functions/components.
- APIs (`app/api/*/route.ts`):
  - Validate inputs.
  - Handle errors with clear, friendly messages.
  - Avoid new external calls unless required and gracefully handled (timeouts, fallbacks).

---

## 4. UI / UX Implementation

- Use DS primitives where possible:
  - `Text`, `Button`, `TextInput`, `FieldLabel`, `FormHelperText`, `StatusPill`, etc.
- Respect color roles from `design.md`:
  - Red for primary actions/CTAs.
  - Blue for links and focus states.
  - Neutrals for text, borders, and surfaces.
- Ensure:
  - Accessible contrast.
  - Clear focus states.
  - Layouts tested on **mobile and desktop** (avoid fixed widths for core flows like ordering).

---

## 5. Workflow for Agents

- **Before editing**:
  - Skim relevant sections of `business.md` / `design.md`.
  - Inspect affected pages in `app/` and shared components in `components/ui`.
- **While editing**:
  - Use `// TODO` only when blocked by missing decisions or external services.
- **After editing**:
  - Run `bun lint` and/or `bun run typecheck` (if configured).
  - Self-review for runtime issues, unused code, and obvious UX/brand mismatches.
