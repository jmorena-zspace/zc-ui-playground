import { LessonCard } from '@components/cards/lesson-card/lesson-card'
import { Filter } from '@components/filter/filter'
import { FilterInputType, type FiltersData } from '@components/filter/types'
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

const GlobalSearchSpecimen: FC = () => (
  <QuickResults
    inline
    showResults
    resultsHaveHits
    results={SEARCH_RESULTS}
    total={SEARCH_RESULTS.length}
    search="circuits"
    onViewAllSearchResults={noop}
    onLessonClick={noop}
  />
)

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

export type Specimen = { id: string; render: FC }

export const SPECIMENS: Specimen[] = [
  { id: 'lesson-card', render: LessonCardSpecimen },
  { id: 'filter', render: FilterSpecimen },
  { id: 'global-search', render: GlobalSearchSpecimen },
  { id: 'pagination', render: PaginationSpecimen },
  { id: 'tab-bar', render: TabBarSpecimen },
]
