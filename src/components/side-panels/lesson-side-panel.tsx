import { faXmark } from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import {
  ContentBadge,
  ContentBadgeType,
} from '@components/badges/content-badge';
import { LessonSidePanelContent } from './lesson-side-panel-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getLessonByIdOfflineAware } from '@services/lessons';
import { useQuery } from '@tanstack/react-query';
import { useRouterState } from '@tanstack/react-router';
import { ARIA_LABELS, useTranslation } from '@zcentral-v2/i18n';
import clsx from 'clsx';
import { FC, useCallback, useEffect, useRef } from 'react';

function removeLessonParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete('lesson');
  window.history.replaceState(window.history.state, '', url.toString());
  window.dispatchEvent(
    new PopStateEvent('popstate', { state: window.history.state })
  );
}

export const LessonSidePanel: FC = () => {
  const { t } = useTranslation();

  const lessonId = useRouterState({
    select: (state) => {
      const params = new URLSearchParams(state.location.searchStr);
      return params.get('lesson') ?? undefined;
    },
  });

  const isOpen = lessonId != null;
  const manualCloseRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const shouldAnimate = isOpen || manualCloseRef.current;

  const onClose = useCallback(() => {
    manualCloseRef.current = true;
    removeLessonParam();
  }, []);

  const onTransitionEnd = useCallback(() => {
    manualCloseRef.current = false;
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

  const lesson = data?.lesson;
  const isOffline = data?.isOffline ?? false;

  const panelHeader = (
    <div className="flex items-center justify-between">
      <ContentBadge type={ContentBadgeType.LESSON} />
      <button
        className="icon-btn icon-btn-on-surface text-content-primary"
        aria-label={t(ARIA_LABELS.UI.CLOSE_BUTTON)}
        type="button"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      aria-label={
        lesson
          ? t(ARIA_LABELS.LESSONS.LESSON_DETAILS, { lessonName: lesson.name })
          : t(ARIA_LABELS.LESSONS.LESSON_DETAILS_LOADING)
      }
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={clsx(
        'outline-none',
        'overflow-y-scroll right-0 top-0 fixed md:sticky bg-bg-surface-inverse-default md:bg-bg-surface-default h-dvh md:h-screen z-2',
        {
          'w-full md:w-[460px] opacity-100 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] md:p-md pointer-events-auto':
            isOpen,
          'w-0 opacity-0 pointer-events-none': !isOpen,
          'transition-[width,opacity] duration-300 ease-in': shouldAnimate,
          'transition-none': !shouldAnimate,
        }
      )}
      onTransitionEnd={onTransitionEnd}
    >
      <LessonSidePanelContent
        isOpen={isOpen}
        isLoading={isLoading}
        isError={isError}
        error={error}
        lesson={lesson}
        isOffline={isOffline}
        panelHeader={panelHeader}
      />
    </aside>
  );
};
