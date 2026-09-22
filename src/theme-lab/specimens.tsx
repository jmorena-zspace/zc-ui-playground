import { AnimatedTitle } from '@components/animated-title'
import { LessonCard } from '@components/cards/lesson-card/lesson-card'
import { Filter } from '@components/filter/filter'
import { FilterInputType, type FiltersData } from '@components/filter/types'
import { SearchInput } from '@components/inputs/search-input'
import { Pagination } from '@components/pagination/pagination'
import { QuickResults } from '@components/quick-results/quick-results'
import { TabBar } from '@components/tab-bar/tab-bar'
import {
  andOrCircuits,
  bioDigitalHuman,
  lessonSingleApp,
} from '@fixtures/content-items'
import { ContentType, SortDirection } from '@zcentral-v2/types'
import { House, Layers, Rocket } from 'lucide-react'
import { useState, type FC } from 'react'

const noop = () => {}

type LessonFilters = {
  subjects: string[]
  sortBy: string
  sortDirection: SortDirection
}

const FILTERS: FiltersData<LessonFilters> = {
  subjects: {
    title: 'Subjects',
    value: ['physics'],
    appliedCount: 1,
    input: {
      type: FilterInputType.MULTI_SELECT,
      valueKey: 'subjects',
      options: [
        { label: 'Physics', value: 'physics' },
        { label: 'Biology', value: 'biology' },
        { label: 'Chemistry', value: 'chemistry' },
        { label: 'Engineering & Technology', value: 'engineering' },
        { label: 'Mathematics', value: 'mathematics' },
      ],
    },
  },
  sort: {
    title: 'Sort',
    value: { sortBy: 'name', sortDirection: SortDirection.ASC },
    input: {
      type: FilterInputType.SORT,
      sortValueKey: 'sortBy',
      sortDirectionKey: 'sortDirection',
      options: [
        { label: 'Name', value: 'name', sortDirectionEnabled: true },
        { label: 'Recently added', value: 'created', sortDirectionEnabled: true },
        { label: 'Relevance', value: 'relevance', sortDirectionEnabled: false },
      ],
    },
  },
}

/** Search results are hardcoded — the lab never talks to an API. */
const SEARCH_RESULTS = [
  { ...andOrCircuits, contentType: ContentType.LESSON },
  { ...lessonSingleApp, contentType: ContentType.LESSON },
  { ...bioDigitalHuman, contentType: ContentType.LESSON },
]

/** Hover it: the underline grows in and the arrow slides out. */
const AnimatedTitleSpecimen: FC = () => (
  <AnimatedTitle as="h2" className="w-fit text-display-sm font-medium text-content-primary">
    Circuits and logic
  </AnimatedTitle>
)

const LessonCardSpecimen: FC = () => (
  <LessonCard lesson={andOrCircuits} selectable onClick={noop} />
)

const FilterSpecimen: FC = () => (
  <Filter<LessonFilters>
    filtersData={FILTERS}
    onFilterChange={noop}
    onClearAllFilters={noop}
  />
)

/** The search box and its results together, as the modal composes them. */
const GlobalSearchSpecimen: FC = () => {
  const [query, setQuery] = useState('circuits')
  const results = SEARCH_RESULTS.filter((result) =>
    result.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="flex flex-col gap-md">
      <SearchInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        showEscHint
      />
      <QuickResults
        inline
        compact={false}
        showResults
        resultsHaveHits={results.length > 0}
        results={results}
        total={results.length}
        search={query}
        onViewAllSearchResults={noop}
        onLessonClick={noop}
      />
    </div>
  )
}

const PaginationSpecimen: FC = () => {
  const [page, setPage] = useState(3)
  return (
    <Pagination
      currentPage={page}
      totalPages={12}
      onPageChange={setPage}
      resetScrollAfterPageChange={false}
    />
  )
}

const TabBarSpecimen: FC = () => (
  <TabBar
    aria-label="Theme lab tabs"
    tabs={[
      { label: 'Home', to: '#/theme', icon: House },
      { label: 'Lessons', to: '#/theme', icon: Layers },
      { label: 'Applications', to: '#/theme', icon: Rocket },
    ]}
  />
)

export type Specimen = {
  id: string
  label: string
  /** Keeps the component at its natural width instead of filling the column. */
  fit?: boolean
  render: FC
}

export const SPECIMENS: Specimen[] = [
  {
    id: 'animated-title',
    label: 'Animated title',
    fit: true,
    render: AnimatedTitleSpecimen,
  },
  { id: 'lesson-card', label: 'Lesson card', render: LessonCardSpecimen },
  { id: 'filter', label: 'Filter', render: FilterSpecimen },
  { id: 'global-search', label: 'Global search', render: GlobalSearchSpecimen },
  { id: 'pagination', label: 'Pagination', fit: true, render: PaginationSpecimen },
  { id: 'tab-bar', label: 'Tab bar', render: TabBarSpecimen },
]
