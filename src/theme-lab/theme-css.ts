import { PRIMITIVES, ROLES } from './tokens.generated'

/** role name -> palette entry name */
export type LightTheme = Record<string, string>

const HEADER = `/*
 * zc-ui-playground — light theme
 * Generated ${'${date}'} from the theme lab.
 *
 * Each role points at a palette entry from src/index.css rather than a raw
 * hex, so the palette stays the single source of colour. Drop this into
 * src/index.css (or keep it here and load it back into the lab later).
 */`

export function serializeTheme(theme: LightTheme): string {
  const known = new Set(PRIMITIVES.map((p) => p.name))
  const lines = ROLES.filter((role) => theme[role.name])
    .map((role) => {
      const value = theme[role.name]
      // A palette entry becomes a var() reference; anything else (a hex typed
      // in by hand) is emitted literally.
      return known.has(value)
        ? `  ${role.name}: var(${value});`
        : `  ${role.name}: ${value};`
    })
    .sort()

  return [
    HEADER.replace('${date}', new Date().toISOString().slice(0, 10)),
    '',
    "[data-theme='light'] {",
    ...lines,
    '}',
    '',
  ].join('\n')
}

/**
 * Accepts what `serializeTheme` writes, and is forgiving about the rest: any
 * `--color-x: var(--color-y)` or `--color-x: #hex` pair is picked up whatever
 * selector it sits under, so a block copied out of index.css imports too.
 */
export function parseTheme(css: string): {
  theme: LightTheme
  unknownRoles: string[]
} {
  const roleNames = new Set(ROLES.map((r) => r.name))
  const theme: LightTheme = {}
  const unknownRoles: string[] = []

  for (const [, role, value] of css.matchAll(
    /(--color-[a-z0-9-]+)\s*:\s*(var\(\s*(--[a-z0-9-]+)\s*\)|#[0-9a-fA-F]{3,8})\s*;/g
  )) {
    const resolved = value.startsWith('var(')
      ? value.replace(/var\(\s*|\s*\)/g, '')
      : value
    if (roleNames.has(role)) theme[role] = resolved
    else unknownRoles.push(role)
  }

  return { theme, unknownRoles }
}

/** The CSS custom properties to apply for a theme, ready for a <style> body. */
export function themeToDeclarations(theme: LightTheme): string {
  const known = new Set(PRIMITIVES.map((p) => p.name))
  return Object.entries(theme)
    .map(([role, value]) =>
      known.has(value) ? `${role}: var(${value});` : `${role}: ${value};`
    )
    .join('\n')
}
