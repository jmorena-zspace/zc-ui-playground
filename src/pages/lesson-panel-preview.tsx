import { LessonSidePanel } from '@components/side-panels/lesson-side-panel'
import { andOrCircuits } from '@fixtures/content-items'
import { ArrowLeft } from 'lucide-react'
import { useEffect, type FC } from 'react'

/** Same open/close protocol the panel itself uses — see lesson-side-panel.tsx. */
function setLessonParam(id: string | undefined) {
  const url = new URL(window.location.href)
  if (id) url.searchParams.set('lesson', id)
  else url.searchParams.delete('lesson')
  window.history.replaceState(window.history.state, '', url.toString())
  window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }))
}

export const LessonPanelPreview: FC<{ onBack: () => void }> = ({ onBack }) => {
  // Opens on arrival and cleans the query param up on the way out, so it
  // does not leak into whatever page you land on next.
  useEffect(() => {
    setLessonParam(andOrCircuits.id)
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

      <div className="flex min-h-0 flex-1 items-center justify-center p-lg pt-0">
        {/*
          The panel is `fixed right-0 top-0 h-dvh` by design — it is a drawer
          docked to the app shell, not a component meant to sit mid-page. A
          `transform` on this frame gives fixed-position descendants a new
          containing block (per the CSS spec), so the drawer docks to the
          frame's own edges instead of the viewport's. That is what makes it
          possible to center it here at all without touching the component.
        */}
        <div
          className="relative h-full w-full max-w-[470px] overflow-hidden rounded-lg border border-dark-600 bg-bg-surface-default shadow-2xl"
          style={{ transform: 'translateZ(0)' }}
        >
          <LessonSidePanel />
        </div>
      </div>
    </div>
  )
}
