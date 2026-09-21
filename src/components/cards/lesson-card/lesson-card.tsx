import { ImagePlaceholder } from '@assets/image-placeholder';
import { AnimatedTitle } from '@components/animated-title';
import {
  ContentBadge,
  ContentBadgeType,
} from '@components/badges/content-badge';

import { LaunchCodeBadge } from '@components/badges/launch-code-badge';
import { Subject as SubjectChip } from '@components/subject';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/ui/tooltip';
import { ExternalLink } from 'lucide-react';
import { useLaunch } from '@hooks/launch';
import { ARIA_LABELS, PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
import {
  ContentItem,
  ContentPlatform,
  LessonApplication,
} from '@zcentral-v2/types';
import clsx from 'clsx';
import { FC, useMemo } from 'react';
import { toast } from 'sonner';

export type LessonCardProps = {
  lesson: ContentItem;
  /** Hides the lesson image. Defaults to false (image shown). */
  compact?: boolean;
  /** Uses a stronger hover background for dark/inverse surfaces. */
  invertedHover?: boolean;
  /** Shows a checkbox left of the title. */
  selectable?: boolean;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  onClick: () => void;
};

export const LessonCard: FC<LessonCardProps> = ({
  lesson,
  compact = false,
  invertedHover = false,
  selectable = false,
  selected = false,
  onSelectedChange,
  onClick,
}) => {
  const { subjects, name, apps, imageUrl } = lesson;
  const { canLaunchLesson, launchLesson } = useLaunch();
  const { t } = useTranslation();
  const mobileMaxSubjects = 2;
  const mobileVisibleSubjects = subjects.slice(0, mobileMaxSubjects);
  const mobileHiddenCount = subjects.length - mobileVisibleSubjects.length;

  const desktopMaxSubjects = compact ? 1 : 2;
  const desktopVisibleSubjects = subjects.slice(0, desktopMaxSubjects);
  const desktopHiddenCount = subjects.length - desktopVisibleSubjects.length;

  const lessonApps = useMemo(
    () => [...(apps ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [apps]
  );

  const deepLinkingLaunchCodes = useMemo(
    () =>
      lessonApps
        .filter((app) => !!app.deepLinkingLaunchCode)
        .map((app) => app.deepLinkingLaunchCode as string),
    [lessonApps]
  );

  const handleLaunchApp = (app: LessonApplication) => {
    launchLesson(lesson, app).catch((error) => {
      toast.error(t(PAGE_TEXTS.UI.FAILED_TO_LAUNCH_CONTENT_MESSAGE));
      console.error('Failed to launch content:', error);
    });
  };

  return (
    <div
      className={clsx(
        'group/card relative overflow-clip isolate',
        'bg-bg-surface-subtle rounded-md p-md',
        // A border is always present so selecting does not shift the layout;
        // the two colours are mutually exclusive because same-property
        // utilities resolve by stylesheet order, not by source order.
        'border',
        'transition-all duration-300 ease-out',
        // Keyboard focus only. Plain `focus-within` also matches pointer
        // focus, which left the card stuck in its focus surface after a
        // click on the checkbox and the mouse moving away.
        // The palette gives hover, selected and pressed the same surface, so
        // the press reads as a slight depression instead of a colour change.
        'cursor-pointer active:scale-[0.99] active:duration-75',
        {
          'hover:bg-bg-surface-inverse-hover focus-visible:bg-bg-surface-inverse-hover has-[:focus-visible]:bg-bg-surface-inverse-hover':
            invertedHover,
          'hover:bg-bg-surface-hover focus-visible:bg-bg-surface-hover has-[:focus-visible]:bg-bg-surface-hover':
            !invertedHover,
          'border-transparent': !selected,
          'bg-bg-action-primary-selected border-border-action-primary-selected':
            selected,
        }
      )}
      aria-label={t(ARIA_LABELS.UI.OPEN_DETAILS, { name })}
      aria-selected={selectable ? selected : undefined}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (
          (e.key === 'Enter' || e.key === ' ') &&
          e.target === e.currentTarget
        ) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Mobile layout */}
      <div className="flex flex-col gap-sm items-start md:hidden">
        <div className="flex items-start gap-xs w-full">
          {selectable && (
            <button
              type="button"
              role="checkbox"
              aria-checked={selected}
              aria-label={t(ARIA_LABELS.UI.SELECT_ITEM, { name })}
              onClick={(e) => {
                e.stopPropagation();
                onSelectedChange?.(!selected);
              }}
              className="shrink-0 cursor-pointer py-xxs"
            >
              <span
                aria-hidden="true"
                className={clsx('filter-checkbox block', {
                  'filter-checkbox-checked': selected,
                })}
              />
            </button>
          )}
          <AnimatedTitle
            className="line-clamp-2 wrap-break-word text-body-lg font-medium text-content-primary"
            as="h2"
            showIcon={false}
            hoverGroup="group/card"
          >
            {name}
          </AnimatedTitle>
          {deepLinkingLaunchCodes.map((code) => (
            <LaunchCodeBadge key={code} text={code} className="shrink-0" />
          ))}
        </div>

        {lessonApps.length > 0 && (
          <div className="flex flex-col gap-xxs w-full">
            {lessonApps.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-xs text-body-sm font-regular text-content-secondary"
              >
                <img
                  src={app.iconUrl}
                  alt={t(ARIA_LABELS.UI.APPLICATION_ICON_ALT, {
                    name: app.name,
                  })}
                  className="w-4 h-4 shrink-0"
                />
                <span>{app.name}</span>
                <LaunchCodeBadge text={app.appLaunchCode} />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-xs items-center w-full">
          <ContentBadge type={ContentBadgeType.LESSON} />
          {mobileVisibleSubjects.map((subject) => (
            <SubjectChip
              key={subject.id}
              subject={subject}
              className="min-w-0 max-w-[70%] [&>span:last-child]:truncate"
            />
          ))}
          {mobileHiddenCount > 0 && (
            <span className="shrink-0 border border-border-system-subtle px-xs py-xxs rounded-full text-body-sm font-medium text-content-secondary">
              +{mobileHiddenCount}
            </span>
          )}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex gap-md items-center">
        {!compact &&
          (imageUrl ? (
            <img
              src={imageUrl}
              alt={t(ARIA_LABELS.UI.LESSON_IMAGE_ALT, { name })}
              className="w-24 h-24 shrink-0 rounded-sm border border-border-system-subtle object-cover"
            />
          ) : (
            <ImagePlaceholder className="w-24 h-24 shrink-0 rounded-sm border border-border-system-subtle text-content-tertiary" />
          ))}
        <div className="flex flex-col gap-sm justify-center min-w-0 flex-1 relative z-10">
          <div className="flex items-start gap-xs">
            {selectable && (
              <button
                type="button"
                role="checkbox"
                aria-checked={selected}
                aria-label={t(ARIA_LABELS.UI.SELECT_ITEM, { name })}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectedChange?.(!selected);
                }}
                className="shrink-0 cursor-pointer py-xxs"
              >
                <span
                  aria-hidden="true"
                  className={clsx('filter-checkbox block', {
                    'filter-checkbox-checked': selected,
                  })}
                />
              </button>
            )}
            <AnimatedTitle
              className="line-clamp-2 wrap-break-word text-body-lg font-medium text-content-primary"
              as="h2"
              showIcon={false}
              hoverGroup="group/card"
            >
              {name}
            </AnimatedTitle>
            {deepLinkingLaunchCodes.map((code) => (
              <div
                key={code}
                className={clsx(
                  'shrink-0 overflow-hidden',
                  'transition-all duration-300 ease-in-out',
                  'opacity-100 translate-y-0',
                  'group-hover/card:opacity-0 group-hover/card:translate-y-full group-focus-visible/card:opacity-0 group-has-[:focus-visible]/card:opacity-0 group-focus-visible/card:translate-y-full group-has-[:focus-visible]/card:translate-y-full'
                )}
              >
                <LaunchCodeBadge text={code} />
              </div>
            ))}
          </div>

          <div className="flex flex-nowrap gap-xs items-center min-w-0 overflow-hidden">
            <ContentBadge type={ContentBadgeType.LESSON} />
            {desktopVisibleSubjects.map((subject) => (
              <SubjectChip
                key={subject.id}
                subject={subject}
                className="min-w-0 [&>span:last-child]:truncate"
              />
            ))}
            {desktopHiddenCount > 0 && (
              <span className="shrink-0 border border-border-system-subtle px-xs py-xxs rounded-full text-body-sm font-medium text-content-secondary">
                +{desktopHiddenCount}
              </span>
            )}
          </div>
        </div>

        {lessonApps.length > 0 && (
          <div className="shrink-0 ml-auto flex flex-col gap-xs items-end relative z-10">
            {lessonApps.map((app) => {
              const isLaunchable = canLaunchLesson(lesson, app);
              const isWeb = app.platform === ContentPlatform.WEB;

              const launchButton = (
                <button
                  aria-label={t(ARIA_LABELS.UI.LAUNCH_IN_APPLICATION_BUTTON, {
                    lessonName: name,
                    appName: app.name,
                  })}
                  disabled={!isLaunchable}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchApp(app);
                  }}
                  className={clsx(
                    '[grid-area:stack] justify-self-end',
                    'inline-flex items-center gap-xs',
                    'h-6 px-sm py-xs rounded-full',
                    'text-body-sm font-medium',
                    'transition-all duration-300 ease-in-out whitespace-nowrap',
                    'translate-y-full invisible pointer-events-none',
                    'group-hover/card:translate-y-0 group-hover/card:visible group-hover/card:pointer-events-auto group-focus-visible/card:translate-y-0 group-has-[:focus-visible]/card:translate-y-0 group-focus-visible/card:visible group-has-[:focus-visible]/card:visible group-focus-visible/card:pointer-events-auto group-has-[:focus-visible]/card:pointer-events-auto',
                    {
                      'bg-bg-action-primary-default text-content-action-on-primary-default cursor-pointer hover:bg-bg-action-primary-hover':
                        isLaunchable,
                      'bg-bg-action-primary-disabled text-content-action-on-primary-disabled cursor-not-allowed':
                        !isLaunchable,
                    }
                  )}
                >
                  {!isWeb && (
                    <img
                      src={app.iconUrl}
                      alt={t(ARIA_LABELS.UI.APPLICATION_ICON_ALT, {
                        name: app.name,
                      })}
                      className={clsx('w-3 h-3 shrink-0', {
                        grayscale: !isLaunchable,
                      })}
                    />
                  )}
                  <span>
                    {t(PAGE_TEXTS.UI.LAUNCH_IN_APP, { appName: app.name })}
                  </span>
                  {isWeb && isLaunchable && (
                    <ExternalLink className="w-3 h-3" />
                  )}
                </button>
              );

              return (
                <div
                  key={app.id}
                  className="grid [grid-template-areas:'stack'] items-center overflow-hidden"
                >
                  <div
                    className={clsx(
                      '[grid-area:stack] justify-self-end',
                      'flex items-center gap-xs',
                      'text-body-sm font-regular text-content-secondary',
                      'transition-all duration-300 ease-in-out whitespace-nowrap',
                      'translate-y-0 opacity-100',
                      'group-hover/card:opacity-0 group-hover/card:-translate-y-full group-hover/card:pointer-events-none group-focus-visible/card:opacity-0 group-has-[:focus-visible]/card:opacity-0 group-focus-visible/card:-translate-y-full group-has-[:focus-visible]/card:-translate-y-full group-focus-visible/card:pointer-events-none group-has-[:focus-visible]/card:pointer-events-none'
                    )}
                  >
                    <img
                      src={app.iconUrl}
                      alt={t(ARIA_LABELS.UI.APPLICATION_ICON_ALT, {
                        name: app.name,
                      })}
                      className="w-4 h-4 shrink-0"
                    />
                    <span>{app.name}</span>
                    <LaunchCodeBadge text={app.appLaunchCode} />
                  </div>

                  {isLaunchable ? (
                    launchButton
                  ) : (
                    // A disabled button emits no pointer events, so the
                    // tooltip hangs off a wrapper instead. The wrapper only
                    // accepts pointer events while the card has the button
                    // revealed, or the tooltip would open over a control
                    // that is not on screen.
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={clsx(
                            '[grid-area:stack] justify-self-end inline-flex',
                            'pointer-events-none',
                            'group-hover/card:pointer-events-auto group-focus-visible/card:pointer-events-auto group-has-[:focus-visible]/card:pointer-events-auto'
                          )}
                        >
                          {launchButton}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t(PAGE_TEXTS.UI.APP_NOT_INSTALLED, {
                          appName: app.name,
                        })}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
