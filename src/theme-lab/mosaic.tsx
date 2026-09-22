import { useCallback, useEffect, useRef, useState, type FC, type ReactNode } from 'react'

const COLUMN = 160
const GAP = 16
/** Small rows so items can pack tightly whatever their height. */
const ROW = 8

/**
 * A dense grid that packs items of different widths and heights together,
 * which CSS columns cannot do — those force every column to the same width, so
 * a lesson card and a set of chips end up sharing one narrow measure.
 *
 * Items declare how many columns they want; their row span is measured, so the
 * vertical packing is tight without hard-coding heights. `grid-auto-flow:
 * dense` then backfills the gaps, which is what gives the mosaic.
 */
export const MosaicItem: FC<{
  cols: number
  children: ReactNode
  /** Passed through so the hover highlight can dim whole specimens. */
  specimenId: string
}> = ({ cols, children, specimenId }) => {
  const inner = useRef<HTMLDivElement>(null)
  const [rows, setRows] = useState(1)

  const measure = useCallback(() => {
    const height = inner.current?.getBoundingClientRect().height ?? 0
    setRows(Math.max(1, Math.ceil((height + GAP) / (ROW + GAP))))
  }, [])

  useEffect(() => {
    measure()
    if (!inner.current) return
    // Content reflows when the theme changes or a control is toggled.
    const observer = new ResizeObserver(measure)
    observer.observe(inner.current)
    return () => observer.disconnect()
  }, [measure])

  return (
    <div
      data-specimen={specimenId}
      className="min-w-0 transition-opacity duration-200"
      style={{
        gridColumn: `span ${cols}`,
        gridRow: `span ${rows}`,
      }}
    >
      <div ref={inner} className="min-w-0">
        {children}
      </div>
    </div>
  )
}

export const MosaicBoard: FC<{ children: ReactNode }> = ({ children }) => (
  <div
    className="grid items-start"
    style={{
      gridTemplateColumns: `repeat(auto-fill, minmax(${COLUMN}px, 1fr))`,
      gridAutoRows: `${ROW}px`,
      gridAutoFlow: 'row dense',
      columnGap: GAP,
      rowGap: 0,
    }}
  >
    {children}
  </div>
)
