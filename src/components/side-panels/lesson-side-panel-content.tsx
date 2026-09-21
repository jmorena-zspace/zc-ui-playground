import { ImagePlaceholder } from '@assets/image-placeholder';
import { faCopy } from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { BaseButton } from '@components/buttons';
import { LessonFileCard } from '@components/cards/lesson-file-card/lesson-file-card';
import { Subject } from '@components/subject';
import { LessonSidePanelSkeleton } from './lesson-side-panel-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLaunch } from '@hooks/launch';
import { ARIA_LABELS, PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
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
  const { t } = useTranslation();
  const { canLaunchLesson, launchLesson } = useLaunch();

  const deepLinkingLaunchCodes = lesson?.apps
    .map((a) => a.deepLinkingLaunchCode)
    .filter((code): code is string => !!code);

  const lessonPlansSection = lesson?.lessonPlans &&
    lesson.lessonPlans.length > 0 && (
      <section
        aria-label={t(ARIA_LABELS.LESSONS.LESSON_PLAN_FILES_LIST)}
        className="flex flex-col gap-md"
      >
        <h2 className="text-content-primary font-medium">
          {t(PAGE_TEXTS.LESSONS.LESSON_PLAN_HEADING)}
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
        aria-label={t(ARIA_LABELS.LESSONS.SUPPORTING_FILES_LIST)}
        className="flex flex-col gap-md"
      >
        <h2 className="text-content-primary font-medium">
          {t(PAGE_TEXTS.LESSONS.LESSON_SUPPORTING_FILES_HEADING)}
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
              ? t(PAGE_TEXTS.UI.NOT_FOUND_ERROR_TITLE)
              : error instanceof Error
              ? error.message
              : t(PAGE_TEXTS.UI.INTERNAL_SERVER_ERROR_TITLE)}
          </h1>
          <p className="text-content-secondary">
            {notFound
              ? t(PAGE_TEXTS.UI.NOT_FOUND_ERROR_MESSAGE)
              : t(PAGE_TEXTS.UI.INTERNAL_SERVER_ERROR_MESSAGE)}
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
          alt={t(ARIA_LABELS.UI.LESSON_IMAGE_ALT, { name: lesson.name })}
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
                  t(PAGE_TEXTS.UI.FAILED_TO_LAUNCH_CONTENT_MESSAGE)
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
              alt={t(ARIA_LABELS.UI.APPLICATION_ICON_ALT, {
                name: app.name,
              })}
              className="w-4 h-4 shrink-0"
            />
            <span>
              {t(PAGE_TEXTS.UI.LAUNCH_IN_APP, {
                appName: app.name,
              })}
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
            aria-label={t(ARIA_LABELS.UI.COPY_LAUNCH_CODE, {
              launchCode: code,
            })}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(code);
              } catch (copyError) {
                toast.error(
                  t(PAGE_TEXTS.UI.FAILED_TO_COPY_LAUNCH_CODE_MESSAGE)
                );
                console.error('Failed to copy launch code:', copyError);
              }
            }}
            leftIcon={<FontAwesomeIcon icon={faCopy} className="w-4 h-4" />}
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
        {t(PAGE_TEXTS.LESSONS.LESSON_SUMMARY_HEADING)}
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
