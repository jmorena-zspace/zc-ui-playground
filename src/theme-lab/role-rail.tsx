import clsx from 'clsx'
import { ChevronDown, RotateCcw, Search, X } from 'lucide-react'
import { useMemo, useState, type FC } from 'react'
import { ColorInput, PaletteSuggestions } from './color-input'
import type { LightTheme } from './theme-css'
import { ROLES } from './tokens.generated'

/**
 * Everything in the rail is painted with palette primitives (dark-*, neutral-*)
 * rather than semantic roles, so it stays readable no matter what the theme
 * being edited does to those roles.
 */

const GROUP_LABELS: Record<string, string> = {
  bg: 'Backgrounds',
  content: 'Content',
  border: 'Borders',
  icon: 'Icons',
  special: 'Special',
}

type Changed = 'all' | 'changed' | 'unchanged'

const CHANGED_LABELS: Record<Changed, string> = {
  all: 'All',
  changed: 'Changed',
  unchanged: 'Untouched',
}

export const RoleRail: FC<{
  theme: LightTheme
  guess: LightTheme
  /** Dark is locked, so its rows are read-only. */
  editable: boolean
  onChange: (role: string, value: string) => void
  onResetRole: (role: string) => void
  onHoverRole: (role: string | null) => void
}> = ({ theme, guess, editable, onChange, onResetRole, onHoverRole }) => {
  const [query, setQuery] = useState('')
  const [changed, setChanged] = useState<Changed>('all')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const isEdited = (role: string) => theme[role] !== guess[role]

  const grouped = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const map = new Map<string, typeof ROLES>()
    for (const role of ROLES) {
      if (needle && !role.name.toLowerCase().includes(needle)) continue
      if (changed === 'changed' && !isEdited(role.name)) continue
      if (changed === 'unchanged' && isEdited(role.name)) continue
      const list = map.get(role.group) ?? []
      list.push(role)
      map.set(role.group, list)
    }
    return [...map.entries()]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, changed, theme, guess])

  const matches = grouped.reduce((total, [, list]) => total + list.length, 0)

  const toggleGroup = (group: string) =>
    setCollapsed((current) => {
      const next = new Set(current)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })

  return (
    <div className="flex h-full w-[360px] shrink-0 flex-col border-r border-dark-600 bg-dark-800">
      <PaletteSuggestions />

      <div className="flex flex-col gap-xs border-b border-dark-600 p-md">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-body-lg font-medium text-dark-50">
            Colour roles
          </h2>
          <span className="text-body-sm text-dark-200">
            {matches} of {ROLES.length}
          </span>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-xs top-1/2 h-4 w-4 -translate-y-1/2 text-dark-200" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter roles"
            className="w-full rounded-sm border border-dark-600 bg-dark-900 py-xs pl-[32px] pr-xs text-body-md text-dark-50 placeholder:text-dark-200 focus:border-dark-300 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear filter"
              className="absolute right-xs top-1/2 -translate-y-1/2 cursor-pointer text-dark-200 hover:text-dark-50"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label="Show"
          className="inline-flex overflow-hidden rounded-full border border-dark-600"
        >
          {(Object.keys(CHANGED_LABELS) as Changed[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setChanged(value)}
              aria-pressed={changed === value}
              className={clsx(
                'flex-1 cursor-pointer px-xs py-xxs text-body-sm',
                changed === value
                  ? 'bg-dark-400 text-neutral-white'
                  : 'text-dark-200 hover:text-dark-50'
              )}
            >
              {CHANGED_LABELS[value]}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {grouped.map(([group, roles]) => {
          const isCollapsed = collapsed.has(group)
          return (
            <section key={group}>
              <h3 className="sticky top-0 z-10 bg-dark-900">
                <button
                  type="button"
                  onClick={() => toggleGroup(group)}
                  aria-expanded={!isCollapsed}
                  className="flex w-full cursor-pointer items-center gap-xs px-md py-xs text-body-sm font-medium text-dark-200 hover:text-dark-50"
                >
                  <ChevronDown
                    className={clsx('h-3 w-3 transition-transform', {
                      '-rotate-90': isCollapsed,
                    })}
                  />
                  {GROUP_LABELS[group] ?? group}
                  <span className="ml-auto text-dark-300">{roles.length}</span>
                </button>
              </h3>

              {!isCollapsed &&
                roles.map((role) => (
                  <div
                    key={role.name}
                    className="border-b border-dark-700 px-md py-xs"
                    onMouseEnter={() => onHoverRole(role.name)}
                    onMouseLeave={() => onHoverRole(null)}
                  >
                    <div className="flex items-center gap-xs">
                      <span
                        className="min-w-0 flex-1 truncate text-body-sm text-dark-50"
                        title={role.name}
                      >
                        {role.name.replace('--color-', '')}
                      </span>
                      {isEdited(role.name) && editable && (
                        <button
                          type="button"
                          onClick={() => onResetRole(role.name)}
                          aria-label={`Reset ${role.name}`}
                          title="Reset to the generated value"
                          className="shrink-0 cursor-pointer text-dark-200 hover:text-dark-50"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <ColorInput
                      className="mt-xxs w-full"
                      value={editable ? theme[role.name] : role.darkRef ?? ''}
                      disabled={!editable}
                      onChange={(value) => onChange(role.name, value)}
                    />
                  </div>
                ))}
            </section>
          )
        })}

        {matches === 0 && (
          <p className="p-md text-body-md text-dark-200">
            Nothing matches that filter.
          </p>
        )}
      </div>
    </div>
  )
}
