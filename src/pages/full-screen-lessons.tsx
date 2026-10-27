import { BaseButton } from '@components/buttons/base-button/base-button'
import { removeLessonParam, type LessonWindowTab } from '@components/side-panels/lesson-param'
import { LessonSidePanel } from '@components/side-panels/lesson-side-panel'
import { LessonWindow } from '@components/side-panels/lesson-window'
import { andOrCircuits } from '@fixtures/content-items'
import { useRouterState } from '@tanstack/react-router'
import { ArrowLeft, PanelRight } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { useEffect, useState, type FC } from 'react'

/** Same open/close protocol the panel itself uses — see lesson-side-panel.tsx. */
function setLessonParam(id: string | undefined) {
  const url = new URL(window.location.href)
  if (id) url.searchParams.set('lesson', id)
  else url.searchParams.delete('lesson')
  window.history.replaceState(window.history.state, '', url.toString())
  window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }))
}

export const FullScreenLessons: FC<{ onBack: () => void }> = ({ onBack }) => {
  const [maximized, setMaximized] = useState(false)
  const [initialTab, setInitialTab] = useState<LessonWindowTab>('lesson-plan')
  const lessonId = useRouterState({
    select: (state) =>
      new URLSearchParams(state.location.searchStr).get('lesson') ?? undefined,
  })

  // Starts closed (clearing any stale param) and cleans the query param up on
  // the way out, so it does not leak into whatever page you land on next.
  useEffect(() => {
    setLessonParam(undefined)
    return () => setLessonParam(undefined)
  }, [])

  return (
    <div className="flex h-full flex-col bg-bg-global-deep">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit cursor-pointer items-center gap-xs p-lg text-body-md text-neutral-300 hover:text-neutral-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="flex flex-1 items-center justify-center">
        <BaseButton
          color="primary"
          size="lg"
          leftIcon={<PanelRight className="h-5 w-5" />}
          onClick={() => setLessonParam(andOrCircuits.id)}
        >
          Open side panel
        </BaseButton>
      </div>

      <LessonSidePanel hidden={maximized} onMaximize={(tab = 'lesson-plan') => {
          setInitialTab(tab)
          setMaximized(true)
        }} />

      <AnimatePresence>
        {maximized && lessonId && (
          <LessonWindow
            key={lessonId}
            lessonId={lessonId}
            initialTab={initialTab}
            onRestore={() => setMaximized(false)}
            onClose={() => {
              setMaximized(false)
              removeLessonParam()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
