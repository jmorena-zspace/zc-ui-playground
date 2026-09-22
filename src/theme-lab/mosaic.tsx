import type { FC, ReactNode } from 'react'

const COLUMN = 160
const GAP = 16

/**
 * Wrapped rows of fixed-width items.
 *
 * The obvious approach — a dense grid with row spans measured from each item's
 * content — does not survive contact with this content. The span decides where
 * dense packing puts an item, which decides how wide it is, which rewraps its
 * chips and changes its height, which changes the span. That loop is bistable
 * here: it flips between two layouts on every resize, one of which overlaps.
 *
 * Wrapping instead gives up tight vertical packing, and leaves ragged bottoms
 * where a row's items differ in height. In exchange nothing is measured, so
 * items cannot overlap: each row is laid out by the browser from widths that
 * never depend on height.
 */
export const MosaicItem: FC<{
  cols: number
  children: ReactNode
  /** Passed through so the hover highlight can dim whole specimens. */
  specimenId: string
}> = ({ cols, children, specimenId }) => (
  <div
    data-specimen={specimenId}
    className="min-w-0 transition-opacity duration-200"
    style={{
      width: `min(100%, ${cols * COLUMN + (cols - 1) * GAP}px)`,
      flex: '0 1 auto',
    }}
  >
    {children}
  </div>
)

export const MosaicBoard: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-wrap items-start gap-md">{children}</div>
)
