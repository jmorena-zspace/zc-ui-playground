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
export function elementsUsingRole(
  root: ParentNode,
  roleName: string
): HTMLElement[] {
  const token = roleName.replace('--color-', '')
  const pattern = new RegExp(
    `(?:^|:)[a-z-]+-${token.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`
  )

  const found: HTMLElement[] = []
  for (const element of root.querySelectorAll<HTMLElement>('*')) {
    for (const className of element.classList) {
      if (pattern.test(className)) {
        found.push(element)
        break
      }
    }
  }
  return found
}
