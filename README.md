# zc-ui-playground

A scratch space for playing with UI components on the zSpace design tokens.

## Stack

| Piece | Choice |
| --- | --- |
| Build | Vite + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first, no `tailwind.config`) |
| Components | [shadcn/ui](https://ui.shadcn.com) (new-york), Radix + `lucide-react` |
| Animation | [Motion for React](https://motion.dev) (`motion/react`) |
| Fonts | Inter + Lexend, bundled locally via `@fontsource-variable` |

## Getting started

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Adding components

```bash
npx shadcn@latest add dialog tooltip
```

They land in `src/components/ui/` and pick up the theme automatically — see below.

## Theming

`src/index.css` is the zSpace design-token sheet (primitives → semantic roles),
followed by a small **shadcn token bridge**: an `@theme inline` block mapping
shadcn's role names (`bg-card`, `text-muted-foreground`, `border-border`, …)
onto the zSpace semantic roles. Anything added with `npx shadcn add` therefore
inherits the design system without editing the component.

Two things worth knowing:

- **Radius and spacing are not bridged.** The zSpace `@theme` already owns
  `--radius-*` and `--spacing-*`, so `rounded-md` / `p-md` resolve to
  design-system values. The scale runs 8 / 16 / 24 / 32px, which is chunkier
  than shadcn's — shadcn's default `rounded-xl` lands at 32px and reads as a
  pill on a small card. Prefer `rounded-md` (16px) on cards.
- **The theme is single-mode** (dark surfaces). There is no `.dark` variant, so
  shadcn's `dark:` utilities are inert.

Fonts: `font-body` (Inter, the default) and `font-display` (Lexend).
