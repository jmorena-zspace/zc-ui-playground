import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import clsx from 'clsx'
import {
  ArrowRight,
  Filter,
  FolderClosed,
  LayoutGrid,
  type LucideIcon,
  Palette,
  PanelRight,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Toaster } from 'sonner'

import { TooltipProvider } from '@components/ui/tooltip'

const queryClient = new QueryClient()
import { useHashRoute } from '@/lib/use-hash-route'
import { CollectionsPage } from '@pages/collections'
import { LessonCardPlayground } from '@pages/lesson-card-playground'
import { FacetedFilters } from '@pages/faceted-filters'
import { LessonPanelPreview } from '@pages/lesson-panel-preview'
import { ThemeLab } from '@pages/theme-lab'

const ENTRIES: {
  route: string
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    route: 'lesson-card',
    title: 'Card playground',
    description: 'Drop components in here and play around.',
    icon: LayoutGrid,
  },
  {
    route: 'theme',
    title: 'Theme lab',
    description: 'Build the light mode against the real components.',
    icon: Palette,
  },
  {
    route: 'faceted-filters',
    title: 'Faceted filters',
    description: 'Drill into a three-level Subject/Pathway filter.',
    icon: Filter,
  },
  {
    route: 'lesson-panel',
    title: 'Lesson side panel',
    description: 'The drawer alone, centered on a dark canvas.',
    icon: PanelRight,
  },
  {
    route: 'collections',
    title: 'Collection folders',
    description: 'Career pathways as folders that tip open on hover.',
    icon: FolderClosed,
  },
]

function Landing({ onOpen }: { onOpen: (route: string) => void }) {
  return (
    <main className="grid h-full place-items-center p-lg">
      <div className="flex flex-wrap items-stretch justify-center gap-md">
        {ENTRIES.map((entry, index) => (
          <motion.div
            key={entry.route}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 24,
              delay: index * 0.05,
            }}
            whileHover={{ y: -4 }}
            className="h-full"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => onOpen(entry.route)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onOpen(entry.route)
                }
              }}
              className={clsx(
                'group flex h-full w-[320px] cursor-pointer flex-col gap-lg rounded-lg p-lg',
                'border border-border-system-subtle bg-bg-surface-subtle',
                'transition-all duration-200 ease-out',
                'hover:border-border-system-default hover:bg-bg-surface-hover hover:shadow-lg',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-system-strong'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-bg-surface-strong text-content-primary">
                  <entry.icon className="h-5 w-5" />
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 -translate-x-1 text-content-tertiary opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                />
              </div>
              <div className="flex flex-col gap-xxs">
                <h2 className="font-display text-display-xs text-content-primary">
                  {entry.title}
                </h2>
                <p className="text-body-md text-content-secondary">
                  {entry.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}

function App() {
  const [route, navigate] = useHashRoute()

  return (
    // Radix tooltips need a provider above every Tooltip; zCentral mounts it
    // at the app root, so do the same here.
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {route === 'lesson-card' ? (
          <LessonCardPlayground onBack={() => navigate('')} />
        ) : route === 'theme' ? (
          <ThemeLab onBack={() => navigate('')} />
        ) : route === 'faceted-filters' ? (
          <FacetedFilters onBack={() => navigate('')} />
        ) : route === 'lesson-panel' ? (
          <LessonPanelPreview onBack={() => navigate('')} />
        ) : route === 'collections' ? (
          <CollectionsPage onBack={() => navigate('')} />
        ) : (
          <Landing onOpen={navigate} />
        )}
        {/* theme="dark": the zSpace theme only restyles sonner's success and
          error variants, so a default toast would render light-on-dark.
          top-center keeps it clear of the floating selection menu. */}
        <Toaster theme="dark" position="top-center" />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
