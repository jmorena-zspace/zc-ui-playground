import {
  useCallback,
  useEffect,
  useRef,
  type FC,
  type ReactNode,
} from 'react'

const COLUMN = 160
const GAP = 16
/** Small rows so items can pack tightly whatever their height. */
const ROW = 8

/**
 * A dense grid that packs items of different widths and heights together,
 * which CSS columns cannot do — those force every column to the same width, so
 * a lesson card and a set of chips end up sharing one narrow measure.
 *
 * Items declare how many columns they want; their row span is measured from
 * their content, and `grid-auto-flow: dense` backfills the gaps.
 */
export const MosaicItem: FC<{
  cols: number
  children: ReactNode
  /** Passed through so the hover highlight can dim whole specimens. */
  specimenId: string
}> = ({ cols, children, specimenId }) => {
  const host = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)

  /**
   * The span is written straight to the node rather than held in state. Going
   * through React meant a measurement could be batched behind a re-render and
   * land stale — an item would keep a span from before its buttons rewrapped
   * and overlap whatever sat below it.
   *
   * rowGap is 0 on the board, so N rows is exactly N * ROW tall; the extra GAP
   * is the breathing room between items.
   */
  const measure = useCallback(() => {
    if (!host.current || !content.current) return
    const height = content.current.getBoundingClientRect().height
    const rows = Math.max(1, Math.ceil((height + GAP) / ROW))
    host.current.style.gridRowEnd = `span ${rows}`
  }, [])

  useEffect(() => {
    const element = content.current
    if (!element) return

    // Measured on the next frame: when the board narrows, chips and buttons
    // rewrap in the same frame the observer fires, so measuring inline reads
    // the height from before the wrap.
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    window.addEventListener('resize', update)
    // Late webfonts change text metrics after the first measurement.
    void document.fonts?.ready.then(update)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [measure])

  return (
    <div
      ref={host}
      data-specimen={specimenId}
      className="min-w-0 transition-opacity duration-200"
      style={{ gridColumn: `span ${cols}` }}
    >
      <div ref={content} className="min-w-0">
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
