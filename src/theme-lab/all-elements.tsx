import { Accordion } from '@components/accordion'
import { ContentBadge, ContentBadgeType } from '@components/badges/content-badge'
import { DesktopBadge } from '@components/badges/desktop-badge/desktop-badge'
import { LaunchCodeBadge } from '@components/badges/launch-code-badge'
import { BaseButton } from '@components/buttons/base-button/base-button'
import { ApplicationCard } from '@components/cards/application-card/application-card'
import { CollectionCard } from '@components/cards/collection-card/collection-card'
import { LessonCard } from '@components/cards/lesson-card/lesson-card'
import { LessonFileCard } from '@components/cards/lesson-file-card/lesson-file-card'
import { SubjectCard } from '@components/cards/subject-card/subject-card'
import { BadRequestError } from '@components/errors/bad-request-error/bad-request-error'
import { NotFoundError } from '@components/errors/not-found-error/not-found-error'
import { ClearButton } from '@components/filter/buttons/clear-button'
import { FilterButton } from '@components/filter/buttons/filter-button'
import { FilterCheckbox } from '@components/filter/inputs/checkbox'
import { FilterRadio } from '@components/filter/inputs/radio'
import { PaginationFooter } from '@components/pagination-footer/pagination-footer'
import { Pagination } from '@components/pagination/pagination'
import { SelectionMenu } from '@components/selection-menu'
import { Subject as SubjectChip } from '@components/subject'
import { TabBar } from '@components/tab-bar/tab-bar'
import { Label } from '@components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { Skeleton } from '@components/ui/skeleton'
import { Spinner } from '@components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/ui/tooltip'
import {
  andOrCircuits,
  biology,
  bioDigitalHuman,
  chemistry,
  franklinsLab,
  lessonSingleApp,
  physics,
} from '@fixtures/content-items'
import { ContentPlatform, type ContentItem } from '@zcentral-v2/types'
import { House, Layers, Rocket } from 'lucide-react'
import { useState, type FC } from 'react'

const noop = () => {}

const webApplication: ContentItem = {
  id: 'app-biodigital-item',
  name: 'BioDigital Human',
  iconUrl: lessonSingleApp.apps[0].iconUrl,
  imageUrl: lessonSingleApp.imageUrl,
  launchCode: 'BD',
  platform: ContentPlatform.WEB,
  subjects: [biology],
}

const sampleApplication: ContentItem = {
  id: 'app-franklins-lab-item',
  name: "Franklin's Lab",
  iconUrl: andOrCircuits.apps[0].iconUrl,
  imageUrl: andOrCircuits.imageUrl,
  launchCode: 'FL',
  platform: ContentPlatform.DESKTOP,
  subjects: [physics],
}

export type Element = {
  id: string
  label: string
  /** Mosaic columns to span. A lesson card needs room; chips do not. */
  cols: number
  render: FC
}

const FormControls: FC = () => {
  const [checked, setChecked] = useState(true)
  const [choice, setChoice] = useState('newest')
  return (
    <div className="flex flex-col gap-sm">
      <button
        type="button"
        className="flex w-fit cursor-pointer items-center gap-xs"
        onClick={() => setChecked((c) => !c)}
      >
        <FilterCheckbox checked={checked} label="Show only installed" />
      </button>
      {['newest', 'oldest'].map((value) => (
        <button
          key={value}
          type="button"
          className="flex w-fit cursor-pointer items-center gap-xs"
          onClick={() => setChoice(value)}
        >
          <FilterRadio checked={choice === value} label={`Sort ${value}`} />
        </button>
      ))}
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

const PaginationFooterSpecimen: FC = () => {
  const [page, setPage] = useState(3)
  const [perPage, setPerPage] = useState(25)
  return (
    <PaginationFooter
      currentPage={page}
      totalItems={240}
      itemsPerPage={perPage}
      onItemsPerPageChange={setPerPage}
      onPageChange={setPage}
    />
  )
}

export const ALL_ELEMENTS: Element[] = [
  // Ordered so repeats of the same component land far apart in the mosaic.
  {
    id: 'lesson-card',
    label: 'Lesson card',
    cols: 4,
    render: () => <LessonCard lesson={andOrCircuits} selectable onClick={noop} />,
  },
  {
    id: 'buttons-colours',
    label: 'Buttons',
    cols: 2,
    render: () => (
      <div className="flex flex-wrap gap-sm">
        <BaseButton color="primary">Primary</BaseButton>
        <BaseButton color="secondary">Secondary</BaseButton>
        <BaseButton color="filter">Filter</BaseButton>
        <BaseButton color="primary" disabled>
          Disabled
        </BaseButton>
      </div>
    ),
  },
  {
    id: 'select',
    label: 'Select',
    cols: 2,
    render: () => (
      <div className="flex flex-col gap-xs">
        <Label htmlFor="theme-lab-select">Subject</Label>
        <Select defaultValue="all">
          <SelectTrigger id="theme-lab-select" className="w-full">
            <SelectValue placeholder="Pick a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            <SelectItem value="physics">Physics</SelectItem>
            <SelectItem value="biology">Biology</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
  },
  {
    id: 'content-badges',
    label: 'Content badges',
    cols: 2,
    render: () => (
      <div className="flex flex-wrap items-center gap-sm">
        <ContentBadge type={ContentBadgeType.LESSON} />
        <ContentBadge type={ContentBadgeType.APPLICATION} />
        <DesktopBadge />
      </div>
    ),
  },
  {
    id: 'application-card',
    label: 'Application card',
    cols: 3,
    render: () => <ApplicationCard application={sampleApplication} />,
  },
  {
    id: 'checkbox-radio',
    label: 'Checkbox & radio',
    cols: 2,
    render: FormControls,
  },
  {
    id: 'lesson-card-selected',
    label: 'Lesson card — selected',
    cols: 4,
    render: () => (
      <LessonCard lesson={lessonSingleApp} selectable selected onClick={noop} />
    ),
  },
  {
    id: 'launch-codes',
    label: 'Launch codes',
    cols: 2,
    render: () => (
      <div className="flex flex-wrap items-center gap-sm">
        <LaunchCodeBadge text="FL-2481" />
        <LaunchCodeBadge text="BD" />
        <LaunchCodeBadge text="ZS-0097" />
      </div>
    ),
  },
  {
    id: 'tab-bar',
    label: 'Tab bar',
    cols: 2,
    render: () => (
      <TabBar
        aria-label="Theme lab tabs"
        tabs={[
          { label: 'Home', to: '#/theme', icon: House },
          { label: 'Lessons', to: '#/theme', icon: Layers },
          { label: 'Apps', to: '#/theme', icon: Rocket },
        ]}
      />
    ),
  },
  {
    id: 'spinner',
    label: 'Spinner',
    cols: 2,
    render: () => (
      <div className="flex items-center gap-sm">
        <Spinner className="h-6 w-6 text-content-primary" />
        <span className="text-body-md text-content-secondary">Loading…</span>
      </div>
    ),
  },
  {
    id: 'collection-card',
    label: 'Collection card',
    cols: 3,
    render: () => (
      <CollectionCard title="Circuits and logic" lessonsCount={12}>
        <div className="p-md">
          <LessonCard lesson={andOrCircuits} compact onClick={noop} />
        </div>
      </CollectionCard>
    ),
  },
  {
    id: 'subject-chips',
    label: 'Subject chips',
    cols: 2,
    render: () => (
      <div className="flex flex-wrap items-center gap-sm">
        <SubjectChip subject={physics} />
        <SubjectChip subject={biology} />
        <SubjectChip subject={chemistry} />
      </div>
    ),
  },
  {
    id: 'pagination',
    label: 'Pagination',
    cols: 2,
    render: PaginationSpecimen,
  },
  {
    id: 'tooltip',
    label: 'Tooltip',
    cols: 1,
    render: () => (
      <Tooltip>
        <TooltipTrigger asChild>
          <BaseButton color="secondary">Hover me</BaseButton>
        </TooltipTrigger>
        <TooltipContent>Franklin&apos;s Lab not installed</TooltipContent>
      </Tooltip>
    ),
  },
  {
    id: 'lesson-card-active',
    label: 'Lesson card — open',
    cols: 4,
    render: () => <LessonCard lesson={bioDigitalHuman} active onClick={noop} />,
  },
  {
    id: 'buttons-sizes',
    label: 'Button sizes',
    cols: 2,
    render: () => (
      <div className="flex flex-wrap items-center gap-sm">
        <BaseButton size="xs">Extra small</BaseButton>
        <BaseButton size="sm">Small</BaseButton>
        <BaseButton size="md">Medium</BaseButton>
        <BaseButton size="lg">Large</BaseButton>
      </div>
    ),
  },
  {
    id: 'accordion',
    label: 'Accordion',
    cols: 2,
    render: () => (
      <Accordion className="rounded-md border border-border-system-subtle">
        <Accordion.Title className="flex items-center gap-xs bg-bg-surface-subtle p-md">
          <span className="text-body-md font-medium text-content-primary">
            Subjects
          </span>
        </Accordion.Title>
        <Accordion.Content className="p-md">
          <p className="text-body-md text-content-secondary">
            Physics, Biology, Chemistry
          </p>
        </Accordion.Content>
      </Accordion>
    ),
  },
  {
    id: 'skeleton',
    label: 'Skeleton',
    cols: 2,
    render: () => (
      <div className="flex flex-col gap-xs">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    ),
  },
  {
    id: 'lesson-file-card',
    label: 'Lesson file',
    cols: 2,
    render: () => (
      <LessonFileCard
        name="AND & OR Circuits — Lesson Plan.pdf"
        link={{ url: 'https://example.com/plan.pdf' }}
      />
    ),
  },
  {
    id: 'error-not-found',
    label: 'Not found',
    cols: 2,
    render: () => <NotFoundError />,
  },
  {
    id: 'lesson-card-no-image',
    label: 'Lesson card — no cover',
    cols: 4,
    render: () => <LessonCard lesson={franklinsLab} selectable onClick={noop} />,
  },
  {
    id: 'buttons-filter',
    label: 'Filter buttons',
    cols: 2,
    render: () => (
      <div className="flex flex-wrap items-center gap-sm">
        <FilterButton>Subjects</FilterButton>
        <FilterButton active>Physics</FilterButton>
        <ClearButton>Clear all</ClearButton>
      </div>
    ),
  },
  {
    id: 'subject-cards',
    label: 'Subject cards',
    cols: 2,
    render: () => (
      <div className="flex flex-wrap gap-sm">
        <SubjectCard subject={physics} onClick={noop} />
        <SubjectCard subject={biology} onClick={noop} />
      </div>
    ),
  },
  {
    id: 'pagination-footer',
    label: 'Pagination footer',
    cols: 3,
    render: PaginationFooterSpecimen,
  },
  {
    id: 'application-card-web',
    label: 'Application card — web',
    cols: 3,
    render: () => <ApplicationCard application={webApplication} />,
  },
  {
    id: 'buttons-icon',
    label: 'Button with icon',
    cols: 2,
    render: () => (
      <BaseButton color="primary" leftIcon={<Rocket className="h-4 w-4" />}>
        Launch in BioDigital Human
      </BaseButton>
    ),
  },
  {
    id: 'select-sort',
    label: 'Select — sort',
    cols: 2,
    render: () => (
      <div className="flex flex-col gap-xs">
        <Label htmlFor="theme-lab-sort">Sort by</Label>
        <Select defaultValue="recent">
          <SelectTrigger id="theme-lab-sort" className="w-full">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="name">Name A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
  },
  {
    id: 'lesson-card-compact',
    label: 'Lesson card — compact',
    cols: 3,
    render: () => (
      <LessonCard lesson={lessonSingleApp} compact selectable onClick={noop} />
    ),
  },
  {
    id: 'selection-menu',
    label: 'Selection menu',
    cols: 3,
    render: () => (
      <div className="relative h-[52px]">
        {/* Fixed in the app; pinned here so it sits in its own cell. */}
        <div className="[&>div]:!absolute [&>div]:!bottom-0 [&>div]:!left-1/2">
          <SelectionMenu
            count={3}
            onAddToClass={noop}
            onSelectAll={noop}
            onDeselectAll={noop}
          />
        </div>
      </div>
    ),
  },
  {
    id: 'error-bad-request',
    label: 'Bad request',
    cols: 2,
    render: () => <BadRequestError />,
  },
  {
    id: 'lesson-file-card-doc',
    label: 'Lesson file — doc',
    cols: 2,
    render: () => (
      <LessonFileCard
        name="Truth Table Worksheet.docx"
        link={{ url: 'https://docs.google.com/document/d/abc123' }}
      />
    ),
  },
]
