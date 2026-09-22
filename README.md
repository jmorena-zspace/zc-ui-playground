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

Other useful script: `npm run typecheck` — see "What compiles" below.

## Layout

```
src/components/        vendored from the zCentral app (~90 components + Storybook stories)
src/components/ui/     shadcn primitives (some from `shadcn add`, some vendored)
src/pages/             one page per component being exercised
src/fixtures/          hardcoded sample content
src/stubs/             local stand-ins for things this repo cannot install
```

## Adding shadcn components

```bash
npx shadcn@latest add dialog tooltip
```

They land in `src/components/ui/` and pick up the theme automatically — see Theming.

## Porting a vendored component

`src/components/` is a raw copy out of the zCentral app, so the files import
through that app's aliases. Rather than edit the components, `vite.config.ts`
points each alias at a local stand-in under `src/stubs/`:

| Alias | Points at | Contains |
| --- | --- | --- |
| `@zcentral-v2/types` | `src/stubs/zcentral-v2/types.ts` | domain types inferred from how the components use them |
| `@tanstack/react-router` | `src/stubs/tanstack/react-router.ts` | `useRouterState`, `useRouter`, `useCanGoBack`, backed by `window.location` + `popstate` |
| `@hooks/*`, `@stores/*`, `@services/*` | `src/stubs/…` | fakes with the real signatures, returning hardcoded data |
| `@assets/*` | `src/stubs/assets/` | placeholder art |
| `@fixtures/*` | `src/fixtures/` | sample content items |

To bring over another component:

1. Run it and read the failures — each one names a module with no stand-in yet.
2. Add the stand-in under `src/stubs/`; the alias prefix already resolves, so
   no config change is needed. Keep the real module's signature so the
   component stays untouched.
3. Replace any `t(...)` calls with plain strings — see "No i18n" below.
4. Add a page under `src/pages/` and a route in `src/App.tsx`.

Three deliberate deviations from the source project:

- **No i18n.** The source components call `t(PAGE_TEXTS.X)` against the private
  `@zcentral-v2/i18n` package. Every one of those is inlined here as a plain
  English string, and nothing translates. When you port a component, replace
  its `t(...)` calls and drop `useTranslation` the same way.

- **FontAwesome is out.** The components came in importing the private
  FontAwesome Pro kit `@awesome.me/kit-935ddc1468`, which needs a token this
  repo does not have. Icons are `lucide-react` instead, which has no brand
  marks (the Google Drive link on a lesson file uses a cloud). Swapped so far:
  `lesson-card`, `content-badge`, `animated-title`, `lesson-side-panel`,
  `lesson-side-panel-content`, `lesson-file-card`, `app-launcher-button`,
  `back-button`. Anything else still imports the kit and will fail until
  converted.
- **`verbatimModuleSyntax` and `erasableSyntaxOnly` are off** in
  `tsconfig.app.json`. The vendored files use plain `import { FC }` and
  `enum`, which those flags ban.

## What compiles

`npm run typecheck` checks only what the playground actually renders, walking
out from `src/main.tsx`. `npm run build` type-checks **everything**, including
the ~85 vendored components that still reference modules with no stand-in, so
it fails until they are ported. That is expected, not a broken build.

The `.docs.stories.tsx` files are along for the ride — Storybook is not set up,
so they are inert (and still import FontAwesome).

## Theme lab

`#/theme` is where the light mode gets built. The theme ships one set of
colour values (which render dark); the lab treats those as locked and lets you
author a light set beside them.

- The canvas stacks five real components at the app's own measure: a lesson
  card, the filter bar with its dropdowns, global search results, pagination
  and the tab bar. All content is hardcoded — the lab never calls an API.
- The rail lists the **76 semantic roles the components actually reference**,
  grouped and searchable, each row showing one chip: the value for the mode you
  are in. Picking opens the palette from `index.css`. Dark rows are read-only.
- **Isolate on hover** (on by default, toggleable): hovering a role dims every
  component that does not paint with it to 30% and rings the exact elements
  that do. It matches Tailwind's class names rather than computed styles,
  anchored to the end of the class so `bg-skeleton` cannot claim
  `bg-skeleton-inverse`.
- Light values start from a **generated guess** (`src/theme-lab/light-guess.ts`)
  that mirrors each role's position in its ramp, keeps brand and overlay roles
  as they are, and sends the `dark`/`midnight` ramps to `neutral`. It is a
  starting point, not an answer.
- Edits autosave to `localStorage`. **Save CSS** writes a
  `[data-theme='light']` block using `var()` references to palette entries, and
  **Load CSS** reads one back — including a block pasted out of `index.css`.
- The theme applies at `:root` while the lab is open so Radix portals
  (tooltips, selects, dialogs) are themed too; the lab's own chrome is painted
  with palette primitives so it stays readable whatever you set.

`src/theme-lab/tokens.generated.ts` is generated from `index.css` — rerun
`npm run generate:tokens` after changing the palette or the roles.

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

## Pages

| Route | Component |
| --- | --- |
| `#/` | landing |
| `#/lesson-card` | `LessonCard` |
| `#/theme` | Theme lab — build the light mode against real components |

One interactive instance per page, no variant galleries or explanatory copy —
see CLAUDE.md.

Routing is a hash switch in `src/App.tsx` (`src/lib/use-hash-route.ts`), not a
real router. Vendored components that want `@tanstack/react-router` will need
one installed or stubbed.
