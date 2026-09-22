import clsx from 'clsx'
import { RotateCcw, Search, X } from 'lucide-react'
import { useMemo, useState, type FC } from 'react'
import { PRIMITIVES, ROLES, type Primitive } from './tokens.generated'
import type { LightTheme } from './theme-css'

/**
 * Everything in the rail is painted with palette primitives (dark-*, neutral-*)
 * rather than semantic roles, so it stays readable no matter what the light
 * theme being edited does to those roles.
 */

const byName = new Map(PRIMITIVES.map((p) => [p.name, p]))

const GROUP_LABELS: Record<string, string> = {
  bg: 'Backgrounds',
  content: 'Content',
  border: 'Borders',
  icon: 'Icons',
  special: 'Special',
}

const families = (() => {
  const map = new Map<string, Primitive[]>()
  for (const p of PRIMITIVES) {
    const list = map.get(p.family) ?? []
    list.push(p)
    map.set(p.family, list)
  }
  for (const list of map.values()) {
    list.sort((a, b) => {
      const an = Number(a.shade)
      const bn = Number(b.shade)
      if (Number.isNaN(an) || Number.isNaN(bn)) return a.shade.localeCompare(b.shade)
      return an - bn
    })
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
})()

/** A colour chip. Checkerboard shows through anything translucent. */
const Swatch: FC<{ hex?: string; className?: string; title?: string }> = ({
  hex,
  className,
  title,
}) => (
  <span
    title={title}
    className={clsx(
      'inline-block shrink-0 rounded-xs border border-dark-500',
      '[background-image:linear-gradient(45deg,#8883_25%,transparent_25%,transparent_75%,#8883_75%),linear-gradient(45deg,#8883_25%,transparent_25%,transparent_75%,#8883_75%)]',
      '[background-size:8px_8px] [background-position:0_0,4px_4px]',
      className
    )}
  >
    <span
      className="block h-full w-full rounded-[3px]"
      style={{ backgroundColor: hex }}
    />
  </span>
)

const PalettePicker: FC<{
  selected?: string
  onPick: (name: string) => void
}> = ({ selected, onPick }) => (
  <div className="flex flex-col gap-sm rounded-sm bg-dark-900 p-sm">
    {families.map(([family, entries]) => (
      <div key={family} className="flex flex-col gap-xxs">
        <span className="text-body-sm text-dark-200">{family}</span>
        <div className="flex flex-wrap gap-xxs">
          {entries.map((entry) => (
            <button
              key={entry.name}
              type="button"
              title={`${entry.name.replace(/^--(color|overlay)-/, '')} · ${entry.hex}`}
              onClick={() => onPick(entry.name)}
              className={clsx(
                'h-6 w-6 rounded-xs border transition-transform hover:scale-110 cursor-pointer',
                entry.name === selected
                  ? 'border-neutral-white ring-2 ring-neutral-white'
                  : 'border-dark-500'
              )}
              style={{ backgroundColor: entry.hex }}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
)

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
  const [openRole, setOpenRole] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const map = new Map<string, typeof ROLES>()
    for (const role of ROLES) {
      if (needle && !role.name.toLowerCase().includes(needle)) continue
      const list = map.get(role.group) ?? []
      list.push(role)
      map.set(role.group, list)
    }
    return [...map.entries()]
  }, [query])

  const matches = grouped.reduce((total, [, list]) => total + list.length, 0)

  return (
    <div className="flex h-full w-[360px] shrink-0 flex-col border-r border-dark-600 bg-dark-800">
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
        <p className="text-body-sm text-dark-200">
          {editable
            ? 'Hover a role to find it in the canvas. Click to recolour.'
            : 'Dark is locked — switch to light to edit.'}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {grouped.map(([group, roles]) => (
          <section key={group}>
            <h3 className="sticky top-0 z-10 bg-dark-900 px-md py-xxs text-body-sm font-medium text-dark-200">
              {GROUP_LABELS[group] ?? group}
            </h3>
            {roles.map((role) => {
              const value = editable ? theme[role.name] : role.darkRef ?? ''
              const hex = editable
                ? byName.get(theme[role.name])?.hex ?? theme[role.name]
                : role.darkHex
              const isOpen = openRole === role.name
              const isEdited = editable && theme[role.name] !== guess[role.name]

              return (
                <div
                  key={role.name}
                  className="border-b border-dark-700"
                  onMouseEnter={() => onHoverRole(role.name)}
                  onMouseLeave={() => onHoverRole(null)}
                >
                  <div className="flex items-center gap-xs px-md py-xs">
                    <button
                      type="button"
                      disabled={!editable}
                      onClick={() => setOpenRole(isOpen ? null : role.name)}
                      onFocus={() => onHoverRole(role.name)}
                      onBlur={() => onHoverRole(null)}
                      className={clsx(
                        'flex min-w-0 flex-1 items-center gap-xs text-left',
                        editable ? 'cursor-pointer' : 'cursor-default'
                      )}
                    >
                      <Swatch
                        hex={hex}
                        title={value}
                        className="h-5 w-5"
                      />
                      <span className="min-w-0 flex-1 truncate text-body-sm text-dark-50">
                        {role.name.replace('--color-', '')}
                        {isEdited && (
                          <span
                            title="Changed from the generated starting point"
                            className="ml-xxs text-dark-300"
                          >
                            •
                          </span>
                        )}
                      </span>
                    </button>
                    {isEdited && (
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
                  {isOpen && editable && (
                    <div className="px-md pb-sm">
                      <PalettePicker
                        selected={value}
                        onPick={(name) => {
                          onChange(role.name, name)
                          setOpenRole(null)
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </section>
        ))}
        {matches === 0 && (
          <p className="p-md text-body-md text-dark-200">
            No roles match “{query}”.
          </p>
        )}
      </div>
    </div>
  )
}
