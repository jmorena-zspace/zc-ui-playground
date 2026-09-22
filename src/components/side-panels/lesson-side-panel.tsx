import { LessonSidePanelContent } from './lesson-side-panel-content';
import { getLessonByIdOfflineAware } from '@services/lessons';
import { useQuery } from '@tanstack/react-query';
import { useRouterState } from '@tanstack/react-router';
import clsx from 'clsx';
import type { Lesson } from '@zcentral-v2/types';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

function removeLessonParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete('lesson');
  window.history.replaceState(window.history.state, '', url.toString());
  window.dispatchEvent(
    new PopStateEvent('popstate', { state: window.history.state })
  );
}

export const LessonSidePanel: FC = () => {

  const lessonId = useRouterState({
    select: (state) => {
      const params = new URLSearchParams(state.location.searchStr);
      return params.get('lesson') ?? undefined;
    },
  });

  const isOpen = lessonId != null;
  const panelRef = useRef<HTMLDivElement>(null);

  // Suppresses the transition on first paint only: a panel that mounts
  // closed should not animate, but every open and close after that should,
  // however the close was triggered.
  const hasBeenOpenRef = useRef(false);
  if (isOpen) hasBeenOpenRef.current = true;
  const shouldAnimate = hasBeenOpenRef.current;

  // A drawer slides out with its contents still in it. `isOpen` alone
  // unmounted them the moment the param cleared, so the panel emptied and
  // only then moved. This keeps it rendered until the slide finishes.
  const [isSlidingShut, setIsSlidingShut] = useState(false);
  const wasOpenRef = useRef(isOpen);
  useEffect(() => {
    if (wasOpenRef.current && !isOpen) setIsSlidingShut(true);
    if (isOpen) setIsSlidingShut(false);
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  const onSlideEnd = useCallback(() => setIsSlidingShut(false), []);

  const onClose = useCallback(() => {
    removeLessonParam();
  }, []);

  useEffect(() => {
    if (!lessonId) return;

    panelRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lessonId, onClose]);

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: ({ signal }) =>
      getLessonByIdOfflineAware(lessonId as string, signal),
    enabled: !!lessonId,
  });

  // The query is disabled as soon as the param clears, so hold on to the last
  // lesson for the closing slide to render.
  const lastLoadedRef = useRef<{ lesson: Lesson; isOffline: boolean } | null>(
    null
  );
  if (data?.lesson) {
    lastLoadedRef.current = { lesson: data.lesson, isOffline: data.isOffline };
  }

  const shown = isOpen ? data : lastLoadedRef.current;
  const lesson = shown?.lesson;
  const isOffline = shown?.isOffline ?? false;

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      aria-label={
        lesson
          ? `Details for ${lesson.name}`
          : 'Loading lesson details'
      }
      aria-hidden={!isOpen}
      inert={!isOpen}
      onTransitionEnd={onSlideEnd}
      className={clsx(
        'outline-none',
        'overflow-y-scroll right-0 top-0 fixed bg-bg-surface-inverse-default md:bg-bg-surface-default h-dvh md:h-screen z-2',
        // Width and padding never change: the drawer is always laid out at its
        // full size and slides on the transform, so nothing inside it reflows
        // and the contents are legible the whole way in and out. Animating
        // width instead makes the panel push the list, but then the contents
        // cannot slide with it — the shell's 460px and the contents' 428px do
        // not cancel, which left a gap of empty drawer on the way open.
        'w-full md:w-[460px] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] md:p-md',
        {
          'translate-x-0 pointer-events-auto': isOpen,
          'translate-x-full pointer-events-none': !isOpen,
          'transition-transform duration-300 ease-in-out': shouldAnimate,
          'transition-none': !shouldAnimate,
        }
      )}
    >
      <div>
        <LessonSidePanelContent
          isOpen={isOpen || isSlidingShut}
          isLoading={isOpen && isLoading}
          isError={isOpen && isError}
          error={error}
          lesson={lesson}
          isOffline={isOffline}
          onClose={onClose}
        />
      </div>
    </aside>
  );
};
