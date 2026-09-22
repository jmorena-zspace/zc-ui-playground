import { Accordion } from '@components/accordion'
import { ContentBadge, ContentBadgeType } from '@components/badges/content-badge'
import { DesktopBadge } from '@components/badges/desktop-badge/desktop-badge'
import { LaunchCodeBadge } from '@components/badges/launch-code-badge'
import { BaseButton } from '@components/buttons/base-button/base-button'
import { ApplicationCard } from '@components/cards/application-card/application-card'
import { CollectionCard } from '@components/cards/collection-card/collection-card'
import { LessonCard } from '@components/cards/lesson-card/lesson-card'
import { PageCard } from '@components/cards/page-card/page-card'
import { SubjectCard } from '@components/cards/subject-card/subject-card'
import { BadRequestError } from '@components/errors/bad-request-error/bad-request-error'
import { ForbiddenError } from '@components/errors/forbidden-error/forbidden-error'
import { InternalServerError } from '@components/errors/internal-server-error/internal-server-error'
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
  lessonSingleApp,
  physics,
} from '@fixtures/content-items'
import { ContentPlatform, type ContentItem } from '@zcentral-v2/types'
import { House, Layers, Rocket } from 'lucide-react'
import { useState, type FC, type ReactNode } from 'react'

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

/** Every specimen sits in one of these, so the canvas reads as a list. */
const Row: FC<{ children: ReactNode; wide?: boolean }> = ({
  children,
  wide = false,
}) => (
  <div
    className={
      wide
        ? 'flex flex-col gap-md'
        : 'flex flex-wrap items-center gap-md'
    }
  >
    {children}
  </div>
)

const TextSpecimen: FC = () => (
  <div className="flex flex-col gap-lg">
    <p className="font-display text-display-3xl text-content-primary">
      Display 3xl — Lexend
    </p>
    <p className="font-display text-display-2xl text-content-primary">
      Display 2xl
    </p>
    <p className="font-display text-display-xl text-content-primary">
      Display xl
    </p>
    <p className="font-display text-display-lg text-content-primary">
      Display lg
    </p>
    <p className="font-display text-display-md text-content-primary">
      Display md
    </p>
    <p className="font-display text-display-sm text-content-primary">
      Display sm
    </p>
    <p className="font-display text-display-xs text-content-primary">
      Display xs
    </p>

    <hr className="border-border-system-subtle" />

    <p className="text-body-lg text-content-primary">
      Body lg — primary. Students wire series and parallel switch circuits,
      then generalize the behavior into AND and OR truth tables.
    </p>
    <p className="text-body-md text-content-secondary">
      Body md — secondary. The quick brown fox jumps over the lazy dog.
    </p>
    <p className="text-body-sm text-content-tertiary">
      Body sm — tertiary. The quick brown fox jumps over the lazy dog.
    </p>
    <p className="text-body-md text-content-disabled">
      Body md — disabled.
    </p>

    <hr className="border-border-system-subtle" />

    <div className="flex flex-wrap gap-lg text-body-lg text-content-primary">
      <span className="font-regular">Regular</span>
      <span className="font-medium">Medium</span>
      <span className="font-semibold">Semibold</span>
      <span className="font-bold">Bold</span>
    </div>

    <p className="text-body-md text-content-primary">
      An{' '}
      <a
        href="#/theme"
        className="text-content-link-inline-default underline-grow"
      >
        inline link
      </a>{' '}
      inside a paragraph, and a{' '}
      <span className="text-content-status-negative">negative</span>,{' '}
      <span className="text-content-status-positive">positive</span>,{' '}
      <span className="text-content-status-warning">warning</span> and{' '}
      <span className="text-content-status-info">info</span> run of text.
    </p>
  </div>
)

const ButtonSpecimen: FC = () => (
  <div className="flex flex-col gap-lg">
    <Row>
      <BaseButton color="primary">Primary</BaseButton>
      <BaseButton color="secondary">Secondary</BaseButton>
      <BaseButton color="filter">Filter</BaseButton>
      <BaseButton color="primary" disabled>
        Disabled
      </BaseButton>
      <BaseButton color="primary" leftIcon={<Rocket className="h-4 w-4" />}>
        With icon
      </BaseButton>
    </Row>
    <Row>
      <BaseButton size="xs">Extra small</BaseButton>
      <BaseButton size="sm">Small</BaseButton>
      <BaseButton size="md">Medium</BaseButton>
      <BaseButton size="lg">Large</BaseButton>
      <BaseButton size="xl">Extra large</BaseButton>
    </Row>
    <Row>
      <FilterButton>Filter button</FilterButton>
      <FilterButton active>Filter active</FilterButton>
      <ClearButton>Clear all</ClearButton>
    </Row>
  </div>
)

const BadgeSpecimen: FC = () => (
  <Row>
    <ContentBadge type={ContentBadgeType.LESSON} />
    <ContentBadge type={ContentBadgeType.APPLICATION} />
    <LaunchCodeBadge text="FL-2481" />
    <DesktopBadge />
    <SubjectChip subject={physics} />
    <SubjectChip subject={biology} />
  </Row>
)

const CardSpecimen: FC = () => (
  <div className="flex flex-col gap-lg">
    <LessonCard lesson={andOrCircuits} selectable onClick={noop} />
    <LessonCard lesson={lessonSingleApp} selectable selected onClick={noop} />
    <LessonCard lesson={bioDigitalHuman} active onClick={noop} />
    <ApplicationCard application={sampleApplication} />
    <CollectionCard title="Circuits and logic" lessonsCount={12}>
      <div className="p-md">
        <LessonCard lesson={andOrCircuits} onClick={noop} compact />
      </div>
    </CollectionCard>
    <Row>
      <SubjectCard subject={physics} onClick={noop} />
      <SubjectCard subject={biology} onClick={noop} />
    </Row>
    <PageCard className="mx-0">
      <p className="text-body-md text-content-secondary">
        A page card, the container the app lays sections out inside.
      </p>
    </PageCard>
  </div>
)

const FormSpecimen: FC = () => {
  const [checked, setChecked] = useState(true)
  const [choice, setChoice] = useState('newest')

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-xs">
        <Label htmlFor="theme-lab-select">Select</Label>
        <Select defaultValue="all">
          <SelectTrigger id="theme-lab-select" className="w-[260px]">
            <SelectValue placeholder="Pick a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            <SelectItem value="physics">Physics</SelectItem>
            <SelectItem value="biology">Biology</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-xs">
        <button
          type="button"
          className="flex w-fit items-center gap-xs"
          onClick={() => setChecked((c) => !c)}
        >
          <FilterCheckbox checked={checked} label="Show only installed" />
        </button>
        {['newest', 'oldest'].map((value) => (
          <button
            key={value}
            type="button"
            className="flex w-fit items-center gap-xs"
            onClick={() => setChoice(value)}
          >
            <FilterRadio checked={choice === value} label={`Sort ${value}`} />
          </button>
        ))}
      </div>

      <Accordion className="rounded-md border border-border-system-subtle">
        <Accordion.Title className="flex items-center gap-xs bg-bg-surface-subtle p-md">
          <span className="text-body-md font-medium text-content-primary">
            An accordion
          </span>
        </Accordion.Title>
        <Accordion.Content className="p-md">
          <p className="text-body-md text-content-secondary">
            Whatever lives inside the open panel.
          </p>
        </Accordion.Content>
      </Accordion>
    </div>
  )
}

const NavigationSpecimen: FC = () => {
  const [page, setPage] = useState(3)
  const [perPage, setPerPage] = useState(25)

  return (
    <div className="flex flex-col gap-xl">
      <TabBar
        aria-label="Theme lab tabs"
        tabs={[
          { label: 'Home', to: '#/theme', icon: House },
          { label: 'Lessons', to: '#/theme', icon: Layers },
          { label: 'Applications', to: '#/theme', icon: Rocket },
        ]}
      />
      <Pagination
        currentPage={page}
        totalPages={12}
        onPageChange={setPage}
        resetScrollAfterPageChange={false}
      />
      <PaginationFooter
        currentPage={page}
        totalItems={240}
        itemsPerPage={perPage}
        onItemsPerPageChange={setPerPage}
        onPageChange={setPage}
      />
    </div>
  )
}

const FeedbackSpecimen: FC = () => (
  <div className="flex flex-col gap-xl">
    <Row>
      <Tooltip>
        <TooltipTrigger asChild>
          <BaseButton color="secondary">Hover for a tooltip</BaseButton>
        </TooltipTrigger>
        <TooltipContent>Franklin&apos;s Lab not installed</TooltipContent>
      </Tooltip>
      <Spinner className="h-6 w-6 text-content-primary" />
    </Row>
    <div className="flex flex-col gap-xs">
      <Skeleton className="h-6 w-[320px]" />
      <Skeleton className="h-6 w-[240px]" />
      <Skeleton className="h-24 w-[420px]" />
    </div>
    <div className="grid gap-xl md:grid-cols-2">
      <NotFoundError />
      <InternalServerError message="We could not load this lesson." />
      <ForbiddenError message="You do not have access to this lesson." />
      <BadRequestError />
    </div>
  </div>
)

const SelectionMenuSpecimen: FC = () => (
  <div className="relative h-[120px]">
    {/* Fixed-position in the real app; pinned into the canvas here so it can
        be inspected without covering the rail. */}
    <div className="[&>div]:!absolute [&>div]:!bottom-0 [&>div]:!left-1/2">
      <SelectionMenu
        count={3}
        onAddToClass={noop}
        onSelectAll={noop}
        onDeselectAll={noop}
      />
    </div>
  </div>
)

export type SpecimenId =
  | 'text'
  | 'buttons'
  | 'badges'
  | 'cards'
  | 'forms'
  | 'navigation'
  | 'feedback'
  | 'selection'

export const SPECIMENS: { id: SpecimenId; label: string; render: FC }[] = [
  { id: 'text', label: 'Text', render: TextSpecimen },
  { id: 'buttons', label: 'Buttons', render: ButtonSpecimen },
  { id: 'badges', label: 'Badges & chips', render: BadgeSpecimen },
  { id: 'cards', label: 'Cards', render: CardSpecimen },
  { id: 'forms', label: 'Forms', render: FormSpecimen },
  { id: 'navigation', label: 'Navigation', render: NavigationSpecimen },
  { id: 'feedback', label: 'Feedback', render: FeedbackSpecimen },
  { id: 'selection', label: 'Selection menu', render: SelectionMenuSpecimen },
]
