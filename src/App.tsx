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

function Landing({ onOpen }: { onOpen: () => void }) {
  return (
    <main className="grid h-full place-items-center p-lg">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        whileHover={{ y: -4 }}
      >
        {/* rounded-md, not shadcn's default rounded-xl: the zSpace radius scale
            runs 8/16/24/32px, so xl reads as a pill at this size. */}
        <Card
          className="w-[360px] cursor-pointer rounded-md transition-colors hover:bg-bg-surface-hover"
          role="button"
          tabIndex={0}
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onOpen()
            }
          }}
        >
          <CardHeader>
            <CardTitle className="font-display text-display-sm">
              Card playground
            </CardTitle>
            <CardDescription>
              Drop components in here and play around.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
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
        ) : (
          <Landing onOpen={() => navigate('lesson-card')} />
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
