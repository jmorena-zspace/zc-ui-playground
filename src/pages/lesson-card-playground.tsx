import { LessonCard } from '@components/cards/lesson-card/lesson-card';
import { SelectionMenu } from '@components/selection-menu';
import { LessonSidePanel } from '@components/side-panels/lesson-side-panel';
import {
  andOrCircuits,
  bioDigitalHuman,
  lessonSingleApp,
} from '@fixtures/content-items';
import { useRouterState } from '@tanstack/react-router';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useState, type FC } from 'react';
import { toast } from 'sonner';

const lessons = [andOrCircuits, lessonSingleApp, bioDigitalHuman];

/**
 * The side panel reads the lesson from the `lesson` search param and closes
 * itself by clearing it, so opening one means writing that param. Mirrors
 * `removeLessonParam` in lesson-side-panel.tsx, including the synthetic
 * popstate that tells the router something moved.
 */
function setLessonParam(id: string | undefined) {
  const url = new URL(window.location.href);
  if (id) {
    url.searchParams.set('lesson', id);
  } else {
    url.searchParams.delete('lesson');
  }
  window.history.replaceState(window.history.state, '', url.toString());
  window.dispatchEvent(
    new PopStateEvent('popstate', { state: window.history.state })
  );
}

export const LessonCardPlayground: FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(
    new Set()
  );

  const openLessonId = useRouterState({
    select: (state) =>
      new URLSearchParams(state.location.searchStr).get('lesson') ?? undefined,
  });

  const toggleSelected = (id: string, selected: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  return (
    <div className="flex h-full">
      {/* The drawer is fixed so its contents can slide without reflowing, so
          the list reserves the space itself. Same duration and easing, so the
          cards shrink in step with the drawer coming in. */}
      <div
        className={clsx(
          'flex-1 overflow-y-auto transition-[padding] duration-300 ease-in-out',
          { 'md:pr-[460px]': openLessonId != null }
        )}
      >
        <div className="mx-auto flex max-w-[1080px] flex-col gap-lg p-lg">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-fit cursor-pointer items-center gap-xs text-body-md text-content-link-action-default hover:text-content-link-action-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-col gap-xs">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                selectable
                selected={selectedIds.has(lesson.id)}
                active={openLessonId === lesson.id}
                onSelectedChange={(selected) =>
                  toggleSelected(lesson.id, selected)
                }
                onClick={() =>
                  setLessonParam(
                    openLessonId === lesson.id ? undefined : lesson.id
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>

      <LessonSidePanel />

      <SelectionMenu
        count={selectedIds.size}
        allSelected={selectedIds.size === lessons.length}
        onAddToClass={() => toast(`Added ${selectedIds.size} to class`)}
        onSelectAll={() =>
          setSelectedIds(new Set(lessons.map((lesson) => lesson.id)))
        }
        onDeselectAll={() => setSelectedIds(new Set())}
      />
    </div>
  );
};
