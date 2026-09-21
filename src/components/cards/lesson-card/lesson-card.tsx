import { ImagePlaceholder } from '@assets/image-placeholder';
import { AnimatedTitle } from '@components/animated-title';
import {
  ContentBadge,
  ContentBadgeType,
} from '@components/badges/content-badge';

import { LaunchCodeBadge } from '@components/badges/launch-code-badge';
import { Subject as SubjectChip } from '@components/subject';
import { ContentItem } from '@zcentral-v2/types';
import clsx from 'clsx';
import { FC, useMemo } from 'react';

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
  /** Marks the card whose details are currently open. */
  active?: boolean;
  onClick: () => void;
};

export const LessonCard: FC<LessonCardProps> = ({
  lesson,
  compact = false,
  invertedHover = false,
  selectable = false,
  selected = false,
  onSelectedChange,
  active = false,
  onClick,
}) => {
  const { subjects, name, apps, imageUrl } = lesson;
  const mobileMaxSubjects = 2;
  const mobileVisibleSubjects = subjects.slice(0, mobileMaxSubjects);
  const mobileHiddenCount = subjects.length - mobileVisibleSubjects.length;

  // Commented out alongside the desktop badge/subject row further down;
  // restore both together.
  // const desktopMaxSubjects = compact ? 1 : 2;
  // const desktopVisibleSubjects = subjects.slice(0, desktopMaxSubjects);
  // const desktopHiddenCount = subjects.length - desktopVisibleSubjects.length;

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

  return (
    <div
      className={clsx(
        'group/card relative overflow-clip isolate',
        'bg-bg-surface-subtle rounded-md p-md',
        // A border is always present so selecting does not shift the layout;
        // the two colours are mutually exclusive because same-property
        // utilities resolve by stylesheet order, not by source order.
        'border',
        'transition-all duration-300 ease-in-out',
        // Keyboard focus only. Plain `focus-within` also matches pointer
        // focus, which left the card stuck in its focus surface after a
        // click on the checkbox and the mouse moving away.
        // The palette gives hover, selected and pressed the same surface, so
        // the press reads as a slight depression instead of a colour change.
        'cursor-pointer active:scale-[0.99] active:duration-75',
        {
          // Hover is suppressed while active: its dark-600 is darker than the
          // active surface, so hovering the open card would dim it.
          'hover:bg-bg-surface-inverse-hover focus-visible:bg-bg-surface-inverse-hover has-[:focus-visible]:bg-bg-surface-inverse-hover':
            invertedHover && !active,
          'hover:bg-bg-surface-hover focus-visible:bg-bg-surface-hover has-[:focus-visible]:bg-bg-surface-hover':
            !invertedHover && !active,
          // Borders and backgrounds are each mutually exclusive: same-property
          // utilities resolve by stylesheet order, not by source order, so
          // overlapping ones would fight.
          'border-transparent': !selected && !active,
          'border-border-action-primary-selected': selected || active,
          'bg-bg-action-primary-selected': selected && !active,
          // dark-500: one step lighter than the dark-600 shared by hover and
          // selected. The palette has no semantic bg role at this step, so
          // this reaches for the primitive.
          'bg-dark-500': active,
        }
      )}
      aria-label={`Open details for ${name}`}
      aria-selected={selectable ? selected : undefined}
      aria-current={active ? 'true' : undefined}
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
              aria-label={`Select ${name}`}
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
                  alt={`${app.name} icon`}
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
              alt={`Cover image for ${name}`}
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
                aria-label={`Select ${name}`}
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
            <div className="flex flex-wrap items-center gap-md">
              {lessonApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-xs text-body-sm font-regular text-content-secondary"
                >
                  <img
                    src={app.iconUrl}
                    alt={`${app.name} icon`}
                    className="w-4 h-4 shrink-0"
                  />
                  <span>{app.name}</span>
                  <LaunchCodeBadge text={app.appLaunchCode} />
                </div>
              ))}
            </div>
          )}

          {/* <div className="flex flex-nowrap gap-xs items-center min-w-0 overflow-hidden">
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
          </div> */}
        </div>

      </div>
    </div>
  );
};
