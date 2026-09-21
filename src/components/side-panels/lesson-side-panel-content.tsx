import { ImagePlaceholder } from '@assets/image-placeholder';
import { BaseButton } from '@components/buttons';
import { LessonFileCard } from '@components/cards/lesson-file-card/lesson-file-card';
import { Subject } from '@components/subject';
import { LessonSidePanelSkeleton } from './lesson-side-panel-skeleton';
import { Copy } from 'lucide-react';
import { useLaunch } from '@hooks/launch';
import { Lesson } from '@zcentral-v2/types';
import clsx from 'clsx';
import { FC, ReactNode } from 'react';
import { toast } from 'sonner';

function isNotFoundError(error: unknown): boolean {
  return (
    !!error &&
    typeof error === 'object' &&
    'response' in error &&
    (error as { response?: { status?: number } }).response?.status === 404
  );
}

type LessonSidePanelContentProps = {
  isOpen: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  lesson: Lesson | undefined;
  isOffline: boolean;
  panelHeader: ReactNode;
};

export const LessonSidePanelContent: FC<LessonSidePanelContentProps> = ({
  isOpen,
  isLoading,
  isError,
  error,
  lesson,
  isOffline,
  panelHeader,
}) => {
  const { canLaunchLesson, launchLesson } = useLaunch();

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

  if (!isOpen) return null;

  if (isLoading) return <LessonSidePanelSkeleton header={panelHeader} />;

  if (isError || !lesson) {
    const notFound = isNotFoundError(error);
    return (
      <div className="flex flex-col gap-md h-full">
        {panelHeader}
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
    <div className="flex flex-col gap-md bg-bg-surface-default p-md md:p-0">
      {panelHeader}
      <h1 className="text-lg text-content-primary font-medium">
        {lesson.name}
      </h1>

      <hr className="border-border-system-subtle" />

      {lesson.imageUrl ? (
        <img
          src={lesson.imageUrl}
          alt={`Cover image for ${lesson.name}`}
          width={428}
          height={272}
          className="w-full h-[272px] shrink-0 rounded-sm border border-border-system-subtle object-cover"
        />
      ) : (
        <ImagePlaceholder className="w-full h-[272px] shrink-0 rounded-sm border border-border-system-subtle text-content-tertiary" />
      )}

      {lesson.apps.map((app) => {
        const isLaunchable = canLaunchLesson(lesson, app);
        return (
          <button
            key={app.id}
            type="button"
            disabled={!isLaunchable}
            onClick={() => {
              launchLesson(lesson, app).catch((launchError) => {
                toast.error(
                  'Failed to launch content'
                );
                console.error('Failed to launch content:', launchError);
              });
            }}
            className={clsx(
              'hidden md:flex rounded-full px-sm py-xs items-center justify-center gap-xs',
              {
                'bg-bg-action-primary-default text-content-action-on-primary-default cursor-pointer hover:bg-bg-action-primary-hover':
                  isLaunchable,
                'bg-bg-action-primary-disabled text-content-action-on-primary-disabled cursor-not-allowed':
                  !isLaunchable,
              }
            )}
          >
            <img
              src={app.iconUrl}
              alt={`${app.name} icon`}
              className="w-4 h-4 shrink-0"
            />
            <span>
              {`Launch in ${app.name}`}
            </span>
          </button>
        );
      })}

      {deepLinkingLaunchCodes &&
        deepLinkingLaunchCodes.length > 0 &&
        deepLinkingLaunchCodes.map((code) => (
          <BaseButton
            key={code}
            color="secondary"
            size="sm"
            fullSized={true}
            aria-label="Copy launch code"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(code);
              } catch (copyError) {
                toast.error(
                  'Failed to copy launch code'
                );
                console.error('Failed to copy launch code:', copyError);
              }
            }}
            leftIcon={<Copy className="w-4 h-4" />}
          >
            {code}
          </BaseButton>
        ))}

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
        </>
      )}
    </div>
  );
};
