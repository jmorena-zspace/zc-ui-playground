import { ImagePlaceholder } from '@assets/image-placeholder';
import { LaunchCodeBadge } from '@components/badges/launch-code-badge';
import { BaseButton } from '@components/buttons/base-button/base-button';
import { LessonFileCard } from '@components/cards/lesson-file-card/lesson-file-card';
import { RelatedCollectionCard } from '@components/cards/related-collection-card/related-collection-card';
import { BlurredModal } from '@components/modals/blurred-modal';
import { Subject } from '@components/subject';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/ui/tooltip';
import { LessonSidePanelSkeleton } from './lesson-side-panel-skeleton';
import { Copy, Rocket, X } from 'lucide-react';
import { useLaunch } from '@hooks/launch';
import { Lesson, LessonApplication } from '@zcentral-v2/types';
import clsx from 'clsx';
import { FC, useState } from 'react';
import { toast } from 'sonner';

function isNotFoundError(error: unknown): boolean {
  return (
    !!error &&
    typeof error === 'object' &&
    'response' in error &&
    (error as { response?: { status?: number } }).response?.status === 404
  );
}

/**
 * One "Launch in <app>" pill: icon, name, and the action together. Used both
 * in the row below the cover image and in the launch-options modal, so the
 * two never drift apart.
 */
const LaunchOption: FC<{
  lesson: Lesson;
  app: LessonApplication;
  className?: string;
}> = ({ lesson, app, className }) => {
  const { canLaunchLesson, launchLesson } = useLaunch();
  const isLaunchable = canLaunchLesson(lesson, app);

  const button = (
    <BaseButton
      color="secondary"
      size="sm"
      disabled={!isLaunchable}
      onClick={() => {
        launchLesson(lesson, app).catch((launchError) => {
          toast.error('Failed to launch content');
          console.error('Failed to launch content:', launchError);
        });
      }}
      // Applied here only when there is no wrapping span below to carry it
      // instead — `hidden md:flex` on both the span and this button would
      // duplicate the same display classes on nested elements. When wrapped,
      // the span carries the visibility classes but is a flex container, so
      // the button still needs `w-full` itself to stretch instead of
      // hugging its content.
      className={isLaunchable ? className : 'w-full'}
      leftIcon={
        <img
          src={app.iconUrl}
          alt={`${app.name} icon`}
          className="h-4 w-4 shrink-0"
        />
      }
    >
      {`Launch in ${app.name}`}
    </BaseButton>
  );

  if (isLaunchable) return button;

  return (
    // A disabled <button> emits no pointer events at all, so hover has to be
    // read off a wrapper around it instead — the button itself never sees it.
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={className}>{button}</span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {`${app.name} not installed`}
      </TooltipContent>
    </Tooltip>
  );
};

type LessonSidePanelContentProps = {
  isOpen: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  lesson: Lesson | undefined;
  isOffline: boolean;
  onClose: () => void;
};

export const LessonSidePanelContent: FC<LessonSidePanelContentProps> = ({
  isOpen,
  isLoading,
  isError,
  error,
  lesson,
  isOffline,
  onClose,
}) => {
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const { canLaunchLesson } = useLaunch();

  // Enabled apps first, disabled (not-installed) ones pushed to the end —
  // same order in both the row below the cover image and the modal.
  const sortedApps = lesson?.apps
    ? [...lesson.apps].sort((a, b) => {
        const aLaunchable = canLaunchLesson(lesson, a);
        const bLaunchable = canLaunchLesson(lesson, b);
        return aLaunchable === bLaunchable ? 0 : aLaunchable ? -1 : 1;
      })
    : [];

  const deepLinkingLaunchCodes = lesson?.apps
    .map((a) => a.deepLinkingLaunchCode)
    .filter((code): code is string => !!code);

  const lessonPlansSection = lesson?.lessonPlans &&
    lesson.lessonPlans.length > 0 && (
      <section
        aria-label="Lesson plan files"
        className="flex flex-col gap-md"
      >
        <h2 className="text-content-primary font-medium">
          Lesson plan
        </h2>
        {lesson.lessonPlans.map((file) => (
          <LessonFileCard
            key={file.id}
            name={file.name}
            link={{ url: file.fileUrl }}
          />
        ))}
      </section>
    );

  const supportingFilesSection = lesson?.supportingFiles &&
    lesson.supportingFiles.length > 0 && (
      <section
        aria-label="Supporting files"
        className="flex flex-col gap-md"
      >
        <h2 className="text-content-primary font-medium">
          Supporting files
        </h2>
        {lesson.supportingFiles.map((file) => (
          <LessonFileCard
            key={file.id}
            name={file.name}
            link={{ url: file.fileUrl }}
          />
        ))}
      </section>
    );

  const relatedCollectionsSection = lesson?.relatedCollections &&
    lesson.relatedCollections.length > 0 && (
      <section
        aria-label="Related collections"
        className="flex flex-col gap-md"
      >
        <h2 className="text-content-primary font-medium">
          Related collections
        </h2>
        {lesson.relatedCollections.map((collection) => (
          <RelatedCollectionCard
            key={collection.id}
            name={collection.name}
            lessonsCount={collection.lessonsCount}
            // No collections page exists in the playground to navigate to,
            // so the click is just a toast — same "care about the
            // interaction, not the destination" treatment as the copy
            // launch-code button above.
            onClick={() => toast(`Opening ${collection.name}`)}
          />
        ))}
      </section>
    );

  if (!isOpen) return null;

  // Absolutely positioned rather than a header row above the title: with no
  // row of its own, `top-0 right-0` puts it exactly level with the title's
  // top edge in the branches below. The skeleton renders the same button
  // itself (see lesson-side-panel-skeleton.tsx) so it stays inside the same
  // padded box as its own title placeholder, rather than a wrapper with
  // different padding around it.
  const closeButton = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="icon-btn icon-btn-on-surface absolute right-0 top-0 z-1 text-content-primary"
    >
      <X className="h-4 w-4" />
    </button>
  );

  if (isLoading) {
    return <LessonSidePanelSkeleton onClose={onClose} />;
  }

  if (isError || !lesson) {
    const notFound = isNotFoundError(error);
    return (
      <div className="relative flex flex-col gap-md h-full">
        {closeButton}
        <div className="flex flex-1 flex-col items-center justify-center gap-sm text-center">
          <h1 className="text-lg text-content-primary font-medium">
            {notFound
              ? 'Lesson not found'
              : error instanceof Error
              ? error.message
              : 'Something went wrong'}
          </h1>
          <p className="text-content-secondary">
            {notFound
              ? 'This lesson may have been moved or removed.'
              : 'We could not load this lesson. Try again in a moment.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-md bg-bg-surface-default p-md md:p-0">
      {closeButton}
      <h1 className="pr-xl text-lg text-content-primary font-medium">
        {lesson.name}
        {deepLinkingLaunchCodes && deepLinkingLaunchCodes.length > 0 && (
          // Plain text-node siblings inside the h1, not a flex row: an
          // inline-flex button is an atomic inline box, so it flows in the
          // wrapped title's line box like a word and lands right after
          // wherever the text ends, whether that is line 1 or line 2.
          <span className="inline-flex flex-wrap items-center gap-xxs align-middle">
            {deepLinkingLaunchCodes.map((code) => (
              <button
                key={code}
                type="button"
                aria-label="Copy launch code"
                onClick={() => toast('Copied to clipboard')}
                className="group/copy ml-xs inline-flex cursor-pointer items-center gap-xxs align-middle"
              >
                <LaunchCodeBadge text={code} />
                <Copy
                  className={clsx(
                    'h-3 w-3 shrink-0 text-content-tertiary',
                    'opacity-0 -translate-x-1 transition-all duration-200 ease-out',
                    'group-hover/copy:opacity-100 group-hover/copy:translate-x-0'
                  )}
                />
              </button>
            ))}
          </span>
        )}
      </h1>

{/*       <hr className="border-border-system-subtle" /> */}

      {/*
        group/cover carries the hover state for both the darken scrim and the
        launch icon; the click opens the same launch options as the row of
        buttons below, just reachable from the image too.
      */}
      <button
        type="button"
        onClick={() => setShowLaunchModal(true)}
        aria-label={`Launch options for ${lesson.name}`}
        className="group/cover relative block w-full shrink-0 cursor-pointer overflow-hidden rounded-sm border border-border-system-subtle outline-none"
      >
        {lesson.imageUrl ? (
          <img
            src={lesson.imageUrl}
            alt={`Cover image for ${lesson.name}`}
            width={428}
            height={272}
            className="h-[272px] w-full object-cover"
          />
        ) : (
          <ImagePlaceholder className="h-[272px] w-full text-content-tertiary" />
        )}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-bg-overlay-modal opacity-0 transition-opacity duration-200 ease-out group-hover/cover:opacity-100"
        >
          <Rocket className="h-8 w-8 text-neutral-white" />
        </span>
      </button>

      {sortedApps.map((app) => (
        <LaunchOption
          key={app.id}
          lesson={lesson}
          app={app}
          className="hidden md:flex"
        />
      ))}

      <BlurredModal
        show={showLaunchModal}
        onClose={() => setShowLaunchModal(false)}
        centered
        ariaLabel={`Launch ${lesson.name}`}
      >
        <div className="mx-auto flex w-[360px] flex-col gap-md rounded-sm border border-border-system-subtle bg-bg-surface-default p-md shadow-lg outline-none">
          <div className="flex items-center justify-between border-b border-border-system-subtle pb-md">
            <div className="flex items-center gap-sm">
              <Rocket className="h-5 w-5 text-content-primary" />
              <h2 className="text-body-lg font-bold text-content-primary">
                Launch
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowLaunchModal(false)}
              className="icon-btn icon-btn-on-surface text-content-secondary"
              aria-label="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col items-stretch gap-xs">
            {sortedApps.map((app) => (
              <LaunchOption key={app.id} lesson={lesson} app={app} />
            ))}
          </div>
        </div>
      </BlurredModal>

      {lesson.subjects.length > 0 && (
        <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-xxs">
          {lesson.subjects.map((subject) => (
            <Subject key={subject.id} subject={subject} />
          ))}
        </div>
      )}

      <h2 className="text-content-primary font-medium">
        Summary
      </h2>
      <p className="text-content-secondary">{lesson.summary}</p>

      {!isOffline && (
        <>
          {lessonPlansSection}
          {supportingFilesSection}
          {relatedCollectionsSection}
        </>
      )}
    </div>
  );
};
