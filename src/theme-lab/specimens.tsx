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
  lessonSingleApp,
  physics,
} from '@fixtures/content-items'
import { ContentPlatform, type ContentItem } from '@zcentral-v2/types'
import { House, Layers, Rocket } from 'lucide-react'
import { useState, type FC } from 'react'

const noop = () => {}

const sampleApplication: ContentItem = {
  id: 'app-franklins-lab-item',
  name: "Franklin's Lab",
  iconUrl: andOrCircuits.apps[0].iconUrl,
  imageUrl: andOrCircuits.imageUrl,
  launchCode: 'FL',
  platform: ContentPlatform.DESKTOP,
  subjects: [physics],
}

export type SpecimenGroup =
  | 'cards'
  | 'buttons'
  | 'badges'
  | 'forms'
  | 'navigation'
  | 'feedback'

export type Specimen = {
  id: string
  label: string
  group: SpecimenGroup
  render: FC
}

export const GROUP_LABELS: Record<SpecimenGroup, string> = {
  cards: 'Cards',
  buttons: 'Buttons',
  badges: 'Badges & chips',
  forms: 'Forms',
  navigation: 'Navigation',
  feedback: 'Feedback',
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

export const SPECIMENS: Specimen[] = [
  {
    id: 'lesson-card',
    label: 'Lesson card',
    group: 'cards',
    render: () => <LessonCard lesson={andOrCircuits} selectable onClick={noop} />,
  },
  {
    id: 'lesson-card-selected',
    label: 'Lesson card — selected',
    group: 'cards',
    render: () => (
      <LessonCard lesson={lessonSingleApp} selectable selected onClick={noop} />
    ),
  },
  {
    id: 'lesson-card-active',
    label: 'Lesson card — open',
    group: 'cards',
    render: () => <LessonCard lesson={bioDigitalHuman} active onClick={noop} />,
  },
  {
    id: 'application-card',
    label: 'Application card',
    group: 'cards',
    render: () => <ApplicationCard application={sampleApplication} />,
  },
  {
    id: 'collection-card',
    label: 'Collection card',
    group: 'cards',
    render: () => (
      <CollectionCard title="Circuits and logic" lessonsCount={12}>
        <div className="p-md">
          <LessonCard lesson={andOrCircuits} compact onClick={noop} />
        </div>
      </CollectionCard>
    ),
  },
  {
    id: 'subject-cards',
    label: 'Subject cards',
    group: 'cards',
    render: () => (
      <div className="flex flex-wrap gap-sm">
        <SubjectCard subject={physics} onClick={noop} />
        <SubjectCard subject={biology} onClick={noop} />
      </div>
    ),
  },
  {
    id: 'lesson-file-card',
    label: 'Lesson file',
    group: 'cards',
    render: () => (
      <LessonFileCard
        name="AND & OR Circuits — Lesson Plan.pdf"
        link={{ url: 'https://example.com/plan.pdf' }}
      />
    ),
  },
  {
    id: 'buttons-colours',
    label: 'Buttons',
    group: 'buttons',
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
    id: 'buttons-sizes',
    label: 'Button sizes',
    group: 'buttons',
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
    id: 'buttons-filter',
    label: 'Filter buttons',
    group: 'buttons',
    render: () => (
      <div className="flex flex-wrap items-center gap-sm">
        <FilterButton>Subjects</FilterButton>
        <FilterButton active>Physics</FilterButton>
        <ClearButton>Clear all</ClearButton>
      </div>
    ),
  },
  {
    id: 'buttons-icon',
    label: 'Button with icon',
    group: 'buttons',
    render: () => (
      <BaseButton color="primary" leftIcon={<Rocket className="h-4 w-4" />}>
        Launch in BioDigital Human
      </BaseButton>
    ),
  },
  {
    id: 'content-badges',
    label: 'Content badges',
    group: 'badges',
    render: () => (
      <div className="flex flex-wrap items-center gap-sm">
        <ContentBadge type={ContentBadgeType.LESSON} />
        <ContentBadge type={ContentBadgeType.APPLICATION} />
        <DesktopBadge />
      </div>
    ),
  },
  {
    id: 'launch-codes',
    label: 'Launch codes',
    group: 'badges',
    render: () => (
      <div className="flex flex-wrap items-center gap-sm">
        <LaunchCodeBadge text="FL-2481" />
        <LaunchCodeBadge text="BD" />
        <LaunchCodeBadge text="ZS-0097" />
      </div>
    ),
  },
  {
    id: 'subject-chips',
    label: 'Subject chips',
    group: 'badges',
    render: () => (
      <div className="flex flex-wrap items-center gap-sm">
        <SubjectChip subject={physics} />
        <SubjectChip subject={biology} />
        <SubjectChip subject={chemistry} />
      </div>
    ),
  },
  {
    id: 'select',
    label: 'Select',
    group: 'forms',
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
    id: 'checkbox-radio',
    label: 'Checkbox & radio',
    group: 'forms',
    render: FormControls,
  },
  {
    id: 'accordion',
    label: 'Accordion',
    group: 'forms',
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
    id: 'tab-bar',
    label: 'Tab bar',
    group: 'navigation',
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
    id: 'pagination',
    label: 'Pagination',
    group: 'navigation',
    render: PaginationSpecimen,
  },
  {
    id: 'pagination-footer',
    label: 'Pagination footer',
    group: 'navigation',
    render: PaginationFooterSpecimen,
  },
  {
    id: 'selection-menu',
    label: 'Selection menu',
    group: 'navigation',
    render: () => (
      <div className="relative h-[60px]">
        {/* Fixed in the app; pinned here so it sits inside its card. */}
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
    id: 'tooltip',
    label: 'Tooltip',
    group: 'feedback',
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
    id: 'skeleton',
    label: 'Skeleton',
    group: 'feedback',
    render: () => (
      <div className="flex flex-col gap-xs">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    ),
  },
  {
    id: 'spinner',
    label: 'Spinner',
    group: 'feedback',
    render: () => (
      <div className="flex items-center gap-sm">
        <Spinner className="h-6 w-6 text-content-primary" />
        <span className="text-body-md text-content-secondary">Loading…</span>
      </div>
    ),
  },
  {
    id: 'error-not-found',
    label: 'Not found',
    group: 'feedback',
    render: () => <NotFoundError />,
  },
  {
    id: 'error-bad-request',
    label: 'Bad request',
    group: 'feedback',
    render: () => <BadRequestError />,
  },
]
