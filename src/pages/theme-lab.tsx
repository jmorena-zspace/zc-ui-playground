import { elementsUsingRole } from '@/theme-lab/highlight'
import { RoleRail } from '@/theme-lab/role-rail'
import { ALL_ELEMENTS } from '@/theme-lab/all-elements'
import { MosaicBoard, MosaicItem } from '@/theme-lab/mosaic'
import { SPECIMENS } from '@/theme-lab/specimens'
import { serializeTheme } from '@/theme-lab/theme-css'
import { useLightTheme } from '@/theme-lab/use-light-theme'
import clsx from 'clsx'
import {
  ArrowLeft,
  Download,
  Moon,
  RotateCcw,
  Sun,
  Target,
  Upload,
} from 'lucide-react'
import { useEffect, useRef, useState, type FC } from 'react'
import { toast } from 'sonner'

const FILE_NAME = 'zc-light-theme.css'

export const ThemeLab: FC<{ onBack: () => void }> = ({ onBack }) => {
  const { theme, mode, setMode, setRole, resetRole, resetAll, importCss, guess } =
    useLightTheme()
  const [view, setView] = useState<'components' | 'all'>('components')
  const [isolate, setIsolate] = useState(true)
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  /**
   * Hovering a role dims every card that does not paint with it and rings the
   * exact elements that do. Done straight on the DOM rather than through
   * state, so hovering does not re-render the whole canvas.
   */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const cards = [...canvas.querySelectorAll<HTMLElement>('[data-specimen]')]
    const clear = () => {
      for (const card of cards) card.style.opacity = ''
      for (const el of canvas.querySelectorAll<HTMLElement>('[data-role-hit]')) {
        el.style.outline = ''
        el.style.outlineOffset = ''
        el.removeAttribute('data-role-hit')
      }
    }

    clear()
    if (!isolate || !hoveredRole) return

    const matches = new Set(elementsUsingRole(canvas, hoveredRole))
    for (const card of cards) {
      const used = [...matches].some(
        (element) => card === element || card.contains(element)
      )
      card.style.opacity = used ? '' : '0.3'
    }
    for (const element of matches) {
      element.setAttribute('data-role-hit', '')
      element.style.outline = '2px solid var(--color-z-blue-400)'
      element.style.outlineOffset = '2px'
    }

    return clear
  }, [hoveredRole, isolate, view, theme, mode])

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
    // stays legible whatever the theme being edited does.
    <div className="flex h-full bg-dark-900">
      <RoleRail
        theme={theme}
        guess={guess}
        editable={mode === 'light'}
        onChange={setRole}
        onResetRole={resetRole}
        onHoverRole={setHoveredRole}
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

          <div
            role="group"
            aria-label="View"
            className="inline-flex overflow-hidden rounded-full border border-dark-600"
          >
            {(
              [
                ['components', 'Components'],
                ['all', 'All UI elements'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setView(value)}
                aria-pressed={view === value}
                className={clsx(
                  'cursor-pointer px-sm py-xxs text-body-sm',
                  view === value
                    ? 'bg-dark-400 text-neutral-white'
                    : 'text-dark-200 hover:text-dark-50'
                )}
              >
                {label}
              </button>
            ))}
          </div>

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

          <button
            type="button"
            onClick={() => setIsolate((on) => !on)}
            aria-pressed={isolate}
            title="Dim everything that does not use the role you are hovering"
            className={clsx(
              'inline-flex cursor-pointer items-center gap-xxs rounded-full border px-sm py-xxs text-body-sm',
              isolate
                ? 'border-dark-400 bg-dark-400 text-neutral-white'
                : 'border-dark-600 text-dark-200 hover:text-dark-50'
            )}
          >
            <Target className="h-3.5 w-3.5" />
            Isolate on hover
          </button>

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

        {/* The canvas: the only part wearing the theme being edited. */}
        <div
          ref={canvasRef}
          data-theme-lab-canvas
          data-main-scroll-container
          // overflow-y-scroll, not auto: the mosaic's height depends on the
          // measured spans, so a scrollbar that comes and goes changes the
          // available width, rewraps the content, changes the spans again —
          // a loop that leaves items overlapping. Reserving the gutter
          // permanently keeps the width fixed.
          className="min-h-0 flex-1 overflow-x-auto overflow-y-scroll bg-bg-surface-default p-lg"
        >
          {view === 'components' ? (
            // Stacked at the same measure as the card playground, so the
            // components get the width they were designed for.
            <div className="mx-auto flex max-w-[1080px] flex-col items-stretch gap-xxl">
              {SPECIMENS.map((specimen) => (
                <div
                  key={specimen.id}
                  data-specimen={specimen.id}
                  className={clsx('transition-opacity duration-200', {
                    'self-start': specimen.fit,
                  })}
                >
                  <specimen.render />
                </div>
              ))}
            </div>
          ) : (
            <MosaicBoard>
              {ALL_ELEMENTS.map((element) => (
                <MosaicItem
                  key={element.id}
                  cols={element.cols}
                  specimenId={element.id}
                >
                  <element.render />
                </MosaicItem>
              ))}
            </MosaicBoard>
          )}
        </div>
      </div>
    </div>
  )
}
