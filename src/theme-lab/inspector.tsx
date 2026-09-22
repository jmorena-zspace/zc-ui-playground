import clsx from 'clsx'
import { X } from 'lucide-react'
import { useMemo, useState, type FC } from 'react'
import { ColorInput } from './color-input'
import {
  rolesInElement,
  STATE_LABELS,
  STATE_ORDER,
  type UiState,
} from './roles-in-element'
import type { LightTheme } from './theme-css'
import { ROLES } from './tokens.generated'

const darkByRole = new Map(ROLES.map((role) => [role.name, role.darkRef ?? '']))

export type InspectorTarget = {
  id: string
  label: string
  element: HTMLElement
  /** Where the click landed, so the panel opens near it. */
  x: number
  y: number
}

/**
 * A floating panel listing the colour roles a component paints with, split by
 * the state each one applies in, and editable in place.
 */
export const Inspector: FC<{
  target: InspectorTarget
  theme: LightTheme
  editable: boolean
  onChange: (role: string, value: string) => void
  onClose: () => void
  onHoverRole: (role: string | null) => void
}> = ({ target, theme, editable, onChange, onClose, onHoverRole }) => {
  const uses = useMemo(() => rolesInElement(target.element), [target])

  const byState = useMemo(() => {
    const map = new Map<UiState, typeof uses>()
    for (const use of uses) {
      const list = map.get(use.state) ?? []
      list.push(use)
      map.set(use.state, list)
    }
    return map
  }, [uses])

  const states = STATE_ORDER.filter((state) => byState.has(state))
  const [state, setState] = useState<UiState>(states[0] ?? 'resting')
  const active = states.includes(state) ? state : (states[0] ?? 'resting')
  const shown = byState.get(active) ?? []

  // Kept inside the viewport rather than wherever the click happened to land.
  const left = Math.min(Math.max(target.x + 16, 16), window.innerWidth - 400)
  const top = Math.min(Math.max(target.y - 40, 16), window.innerHeight - 360)

  return (
    <div
      role="dialog"
      aria-label={`Colours in ${target.label}`}
      style={{ left, top }}
      className="fixed z-50 flex max-h-[420px] w-[380px] flex-col rounded-md border border-dark-600 bg-dark-800 shadow-lg"
    >
      <header className="flex items-start justify-between gap-xs border-b border-dark-600 p-sm">
        <div className="min-w-0">
          <h2 className="truncate font-display text-body-md font-medium text-dark-50">
            {target.label}
          </h2>
          <p className="text-body-sm text-dark-200">
            {uses.length} role{uses.length === 1 ? '' : 's'} in this component
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 cursor-pointer text-dark-200 hover:text-dark-50"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex flex-wrap gap-xxs border-b border-dark-600 px-sm py-xs">
        {states.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setState(value)}
            aria-pressed={active === value}
            className={clsx(
              'cursor-pointer rounded-full px-xs py-xxs text-body-sm',
              active === value
                ? 'bg-dark-400 text-neutral-white'
                : 'text-dark-200 hover:text-dark-50'
            )}
          >
            {STATE_LABELS[value]}
            <span className="ml-xxs text-dark-200">
              {byState.get(value)?.length}
            </span>
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-sm">
        <ul className="flex flex-col gap-xs">
          {shown.map((use) => (
            <li
              key={`${use.role}-${use.state}`}
              className="flex flex-col gap-xxs"
              onMouseEnter={() => onHoverRole(use.role)}
              onMouseLeave={() => onHoverRole(null)}
            >
              <span
                className="truncate text-body-sm text-dark-100"
                title={use.className}
              >
                {use.role.replace('--color-', '')}
              </span>
              <ColorInput
                value={editable ? theme[use.role] : darkByRole.get(use.role) ?? ''}
                disabled={!editable}
                onChange={(value) => onChange(use.role, value)}
              />
            </li>
          ))}
        </ul>
        {!editable && (
          <p className="pt-xs text-body-sm text-dark-200">
            Dark is locked — switch to light to edit.
          </p>
        )}
      </div>
    </div>
  )
}
