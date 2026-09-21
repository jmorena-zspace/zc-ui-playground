import { ApplicationCard, LessonCard } from '@components/cards';
import { ContentItem, ContentType } from '@zcentral-v2/types';
import clsx from 'clsx';
import { FC, useCallback } from 'react';

export type QuickResultListProps = {
  results: ContentItem[];
  /** Removes horizontal padding for embedded use (e.g. spotlight). */
  compact?: boolean;
  onLessonClick: (lessonId: string) => void;
  /** Uses a stronger hover background for cards on dark/inverse surfaces. */
  invertedHover?: boolean;
};

export const QuickResultList: FC<QuickResultListProps> = ({
  results,
  onLessonClick,
  invertedHover = false,
  compact = false,
}) => {
  const keyExtractor = useCallback((result: ContentItem) => {
    return result.id;
  }, []);

  const quickResult = useCallback(
    (result: ContentItem) => {
      switch (result.contentType) {
        case ContentType.LESSON: {
          return (
            <LessonCard
              lesson={result}
              compact
              invertedHover={invertedHover}
              onClick={() => onLessonClick(result.id)}
            />
          );
        }
        case ContentType.APPLICATION: {
          return (
            <ApplicationCard
              application={result}
              compact
              invertedHover={invertedHover}
            />
          );
        }
      }
    },
    [invertedHover, onLessonClick]
  );

  return (
    <ul
      className={clsx('flex flex-col gap-3', {
        'pt-xs pb-xs': compact,
        'pt-sm px-sm pb-md': !compact,
      })}
      aria-label="Quick results list"
    >
      {results.map((result) => (
        <li key={keyExtractor(result)} data-nav-item>
          {quickResult(result)}
        </li>
      ))}
    </ul>
  );
};
