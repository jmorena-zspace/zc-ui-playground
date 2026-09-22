import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { Toaster } from 'sonner'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TooltipProvider } from '@components/ui/tooltip'

const queryClient = new QueryClient()
import { useHashRoute } from '@/lib/use-hash-route'
import { LessonCardPlayground } from '@pages/lesson-card-playground'
import { FacetedFilters } from '@pages/faceted-filters'
import { ThemeLab } from '@pages/theme-lab'

const ENTRIES = [
  {
    route: 'lesson-card',
    title: 'Card playground',
    description: 'Drop components in here and play around.',
  },
  {
    route: 'theme',
    title: 'Theme lab',
    description: 'Build the light mode against the real components.',
  },
  {
    route: 'faceted-filters',
    title: 'Faceted filters',
    description: 'Drill into a three-level Subject/Pathway filter.',
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
          >
            {/* rounded-md, not shadcn's default rounded-xl: the zSpace radius
                scale runs 8/16/24/32px, so xl reads as a pill at this size. */}
            <Card
              className="h-full w-[360px] cursor-pointer rounded-md transition-colors hover:bg-bg-surface-hover"
              role="button"
              tabIndex={0}
              onClick={() => onOpen(entry.route)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onOpen(entry.route)
                }
              }}
            >
              <CardHeader>
                <CardTitle className="font-display text-display-sm">
                  {entry.title}
                </CardTitle>
                <CardDescription>{entry.description}</CardDescription>
              </CardHeader>
            </Card>
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
