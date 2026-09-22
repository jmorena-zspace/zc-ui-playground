import { ROLES } from './tokens.generated'

/** The interaction states a utility can be scoped to. */
export type UiState =
  | 'resting'
  | 'hover'
  | 'focus'
  | 'active'
  | 'disabled'
  | 'other'

export const STATE_ORDER: UiState[] = [
  'resting',
  'hover',
  'focus',
  'active',
  'disabled',
  'other',
]

export const STATE_LABELS: Record<UiState, string> = {
  resting: 'Resting',
  hover: 'Hover',
  focus: 'Focus',
  active: 'Active',
  disabled: 'Disabled',
  other: 'Other',
}

const TOKENS = new Map(
  ROLES.map((role) => [role.name.replace('--color-', ''), role.name])
)

/** `hover:bg-bg-surface-hover` -> variants ['hover'], utility the rest. */
function splitVariants(className: string): {
  variants: string[]
  utility: string
} {
  const parts: string[] = []
  let depth = 0
  let current = ''
  for (const char of className) {
    if (char === '[') depth++
    else if (char === ']') depth--
    if (char === ':' && depth === 0) {
      parts.push(current)
      current = ''
      continue
    }
    current += char
  }
  return { variants: parts, utility: current }
}

function stateFor(variants: string[]): UiState {
  if (variants.length === 0) return 'resting'
  const joined = variants.join(' ')
  if (joined.includes('disabled')) return 'disabled'
  if (joined.includes('focus')) return 'focus'
  if (joined.includes('hover')) return 'hover'
  if (joined.includes('active')) return 'active'
  return 'other'
}

export type RoleUse = {
  role: string
  state: UiState
  /** The class it came from, so a surprising hit can be traced back. */
  className: string
}

/**
 * Every colour role painted anywhere inside `root`, tagged with the state its
 * utility is scoped to.
 *
 * Reads class names rather than computed styles: Tailwind names utilities
 * after the token, and a computed colour cannot say which role produced it —
 * several roles resolve to the same value in this palette.
 */
export function rolesInElement(root: ParentNode): RoleUse[] {
  const seen = new Map<string, RoleUse>()

  const visit = (element: Element) => {
    for (const className of element.classList) {
      const { variants, utility } = splitVariants(className)
      const dash = utility.indexOf('-')
      if (dash < 0) continue
      const token = utility.slice(dash + 1)
      const role = TOKENS.get(token)
      if (!role) continue
      const state = stateFor(variants)
      const key = `${role}::${state}`
      if (!seen.has(key)) seen.set(key, { role, state, className })
    }
  }

  if (root instanceof Element) visit(root)
  for (const element of root.querySelectorAll('*')) visit(element)

  return [...seen.values()].sort(
    (a, b) =>
      STATE_ORDER.indexOf(a.state) - STATE_ORDER.indexOf(b.state) ||
      a.role.localeCompare(b.role)
  )
}
