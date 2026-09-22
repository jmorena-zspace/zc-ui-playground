import clsx from 'clsx'
import { useId, useState, type FC } from 'react'
import { PRIMITIVES } from './tokens.generated'

const byName = new Map(PRIMITIVES.map((p) => [p.name, p]))

/** `--color-neutral-100` <-> `neutral-100`, which is what you type. */
const shortName = (name: string) => name.replace(/^--(color|overlay)-/, '')
const longName = (short: string) => {
  const trimmed = short.trim()
  if (!trimmed) return ''
  for (const prefix of ['--color-', '--overlay-']) {
    if (byName.has(prefix + trimmed)) return prefix + trimmed
  }
  return trimmed
}

const SUGGESTION_LIST_ID = 'theme-lab-palette'

/** One shared datalist, rather than one per input. */
export const PaletteSuggestions: FC = () => (
  <datalist id={SUGGESTION_LIST_ID}>
    {PRIMITIVES.map((primitive) => (
      <option key={primitive.name} value={shortName(primitive.name)}>
        {primitive.hex}
      </option>
    ))}
  </datalist>
)

/**
 * A chip plus a text field. Typing beats a palette grid here: the palette is
 * 184 swatches, which fills the screen and buries whatever you were looking
 * at. The browser's own datalist does the completion.
 */
export const ColorInput: FC<{
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}> = ({ value, onChange, disabled = false, className }) => {
  const [draft, setDraft] = useState<string | null>(null)
  const id = useId()
  const hex = byName.get(value)?.hex ?? value
  const shown = draft ?? shortName(value)

  const commit = (raw: string) => {
    const resolved = longName(raw)
    // A hex typed by hand is allowed; anything else has to name a palette
    // entry, otherwise the field snaps back rather than storing a typo.
    if (byName.has(resolved) || /^#[0-9a-fA-F]{3,8}$/.test(resolved)) {
      onChange(resolved)
    }
    setDraft(null)
  }

  return (
    <span className={clsx('inline-flex min-w-0 items-center gap-xs', className)}>
      <span
        aria-hidden="true"
        className="inline-block h-4 w-4 shrink-0 rounded-xs border border-dark-500"
        style={{ backgroundColor: hex }}
      />
      <input
        id={id}
        list={SUGGESTION_LIST_ID}
        value={shown}
        disabled={disabled}
        spellCheck={false}
        aria-label="Palette colour"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commit(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') commit(event.currentTarget.value)
          if (event.key === 'Escape') setDraft(null)
        }}
        className={clsx(
          'min-w-0 flex-1 rounded-xs border border-dark-600 bg-dark-900 px-xs py-xxs',
          'font-mono text-body-sm text-dark-50 placeholder:text-dark-300',
          'focus:border-dark-300 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-60'
        )}
      />
    </span>
  )
}
