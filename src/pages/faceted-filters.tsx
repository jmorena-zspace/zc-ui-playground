import {
  FacetedSelectInput,
  type FacetNode,
} from '@components/filter/filter-inputs/faceted-select-input'
import { ArrowLeft } from 'lucide-react'
import { useState, type FC } from 'react'

/**
 * Three levels deep, with the same children repeated under every option — the
 * point is the drill-down interaction, not the taxonomy.
 */
const THIRD_LEVEL = [
  'Building and Moving',
  'Caring for Communities',
  'Creating and Experiencing',
  'Cultivating Resources',
  'Career Exploration',
]

const SECOND_LEVEL = [
  'Agriculture, Food and Natural Resources',
  'Architecture and Construction',
  'Arts, A/V Technology, and Communications',
  'Career Awareness',
  'Career Exploration',
]

const TOP_LEVEL = ['STEM', 'CTE']

const slug = (...parts: string[]) =>
  parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const SUBJECT_PATHWAY: FacetNode[] = TOP_LEVEL.map((top) => ({
  value: slug(top),
  label: top,
  children: SECOND_LEVEL.map((second) => ({
    value: slug(top, second),
    label: second,
    children: THIRD_LEVEL.map((third) => ({
      value: slug(top, second, third),
      label: third,
    })),
  })),
}))

export const FacetedFilters: FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <div className="h-full overflow-y-auto bg-bg-surface-default">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-lg p-lg">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit cursor-pointer items-center gap-xs text-body-md text-content-link-action-default hover:text-content-link-action-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-wrap items-center gap-sm">
          <FacetedSelectInput
            title="Subject/Pathway"
            tree={SUBJECT_PATHWAY}
            selected={selected}
            onSelectedChange={setSelected}
          />
        </div>
      </div>
    </div>
  )
}
