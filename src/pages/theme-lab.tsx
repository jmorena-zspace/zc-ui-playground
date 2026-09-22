import { RoleRail } from '@/theme-lab/role-rail'
import { SPECIMENS, type SpecimenId } from '@/theme-lab/specimens'
import { serializeTheme } from '@/theme-lab/theme-css'
import { useLightTheme } from '@/theme-lab/use-light-theme'
import clsx from 'clsx'
import { ArrowLeft, Download, Moon, RotateCcw, Sun, Upload } from 'lucide-react'
import { useRef, useState, type FC } from 'react'
import { toast } from 'sonner'

type Selection = SpecimenId | 'all'

const FILE_NAME = 'zc-light-theme.css'

export const ThemeLab: FC<{ onBack: () => void }> = ({ onBack }) => {
  const { theme, mode, setMode, setRole, resetRole, resetAll, importCss, guess } =
    useLightTheme()
  const [selection, setSelection] = useState<Selection>('all')
  const fileInput = useRef<HTMLInputElement>(null)

  const shown =
    selection === 'all'
      ? SPECIMENS
      : SPECIMENS.filter((specimen) => specimen.id === selection)

  const onExport = () => {
    const blob = new Blob([serializeTheme(theme)], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = FILE_NAME
    link.click()
    URL.revokeObjectURL(url)
    toast(`Saved ${FILE_NAME}`)
  }

  const onImport = async (file: File) => {
    const { count, unknownRoles } = importCss(await file.text())
    if (count === 0) {
      toast.error('No colour roles found in that file')
      return
    }
    toast(
      unknownRoles.length
        ? `Loaded ${count} roles · ignored ${unknownRoles.length} unknown`
        : `Loaded ${count} roles`
    )
  }

  return (
    // Chrome is painted with palette primitives, never semantic roles, so it
    // stays legible whatever the light theme does.
    <div className="flex h-full bg-dark-900">
      <RoleRail
        theme={theme}
        guess={guess}
        onChange={setRole}
        onResetRole={resetRole}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-md border-b border-dark-600 bg-dark-800 px-lg py-sm">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex cursor-pointer items-center gap-xs text-body-md text-dark-200 hover:text-dark-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <select
            value={selection}
            onChange={(e) => setSelection(e.target.value as Selection)}
            className="rounded-sm border border-dark-600 bg-dark-900 px-xs py-xxs text-body-md text-dark-50 focus:border-dark-300 focus:outline-none"
            aria-label="Elements to show"
          >
            <option value="all">All elements</option>
            {SPECIMENS.map((specimen) => (
              <option key={specimen.id} value={specimen.id}>
                {specimen.label}
              </option>
            ))}
          </select>

          <div
            role="group"
            aria-label="Colour mode"
            className="inline-flex overflow-hidden rounded-full border border-dark-600"
          >
            {(['dark', 'light'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                aria-pressed={mode === value}
                className={clsx(
                  'inline-flex cursor-pointer items-center gap-xxs px-sm py-xxs text-body-sm',
                  mode === value
                    ? 'bg-dark-400 text-neutral-white'
                    : 'text-dark-200 hover:text-dark-50'
                )}
              >
                {value === 'dark' ? (
                  <Moon className="h-3.5 w-3.5" />
                ) : (
                  <Sun className="h-3.5 w-3.5" />
                )}
                {value === 'dark' ? 'Dark (locked)' : 'Light'}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-xs">
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex cursor-pointer items-center gap-xxs rounded-full border border-dark-600 px-sm py-xxs text-body-sm text-dark-200 hover:text-dark-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="inline-flex cursor-pointer items-center gap-xxs rounded-full border border-dark-600 px-sm py-xxs text-body-sm text-dark-200 hover:text-dark-50"
            >
              <Upload className="h-3.5 w-3.5" />
              Load CSS
            </button>
            <button
              type="button"
              onClick={onExport}
              className="inline-flex cursor-pointer items-center gap-xxs rounded-full bg-dark-400 px-sm py-xxs text-body-sm text-neutral-white hover:bg-dark-300"
            >
              <Download className="h-3.5 w-3.5" />
              Save CSS
            </button>
            <input
              ref={fileInput}
              type="file"
              accept=".css,text/css"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void onImport(file)
                e.target.value = ''
              }}
            />
          </div>
        </header>

        {/* The canvas: the only part that wears the theme being edited. */}
        <div
          data-theme-lab-canvas
          data-main-scroll-container
          className="min-h-0 flex-1 overflow-y-auto bg-bg-surface-default"
        >
          <div className="mx-auto flex max-w-[1080px] flex-col gap-3xl p-xl">
            {shown.map(({ id, label, render: Specimen }) => (
              <section key={id} className="flex flex-col gap-md">
                {selection === 'all' && (
                  <h2 className="font-display text-display-xs text-content-tertiary">
                    {label}
                  </h2>
                )}
                <Specimen />
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
