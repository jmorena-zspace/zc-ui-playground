/**
 * Finds the elements painted with a given colour role.
 *
 * Tailwind names its utilities after the token, so `--color-bg-surface-hover`
 * becomes `bg-bg-surface-hover`, `hover:bg-bg-surface-hover`,
 * `text-bg-surface-hover` and so on. Matching the class list is enough — no
 * need to diff computed styles.
 *
 * The match is anchored to the end of the class so `bg-skeleton` cannot also
 * claim `bg-skeleton-inverse`; that is the only overlapping pair in the set,
 * and an unanchored substring test would get it wrong.
 */
import { UTILITY_ROLES } from './tokens.generated'

export function elementsUsingRole(
  root: ParentNode,
  roleName: string
): HTMLElement[] {
  // Classes from the theme's own @utility blocks paint with roles without
  // naming them, so they are matched by lookup rather than by pattern.
  const customClasses = new Set(
    Object.entries(UTILITY_ROLES)
      .filter(([, uses]) => uses.some((use) => use.role === roleName))
      .map(([utility]) => utility)
  )

  const token = roleName.replace('--color-', '')
  const pattern = new RegExp(
    `(?:^|:)[a-z-]+-${token.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`
  )

  const found: HTMLElement[] = []
  for (const element of root.querySelectorAll<HTMLElement>('*')) {
    for (const className of element.classList) {
      const utility = className.slice(className.lastIndexOf(':') + 1)
      if (pattern.test(className) || customClasses.has(utility)) {
        found.push(element)
        break
      }
    }
  }
  return found
}
