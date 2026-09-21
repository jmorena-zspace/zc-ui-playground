import { ApplicationCard, LessonCard } from '@components/cards';
import { ArrowNavigableContainer } from '@components/ui/arrow-navigable-container';
import { ARIA_LABELS, useTranslation } from '@zcentral-v2/i18n';
import { ContentItem, ContentType } from '@zcentral-v2/types';
import { FC, useCallback } from 'react';

export type SearchResultsProps = {
  results: ContentItem[];
  onLessonClick: (lessonId: string) => void;
};

export const SearchResults: FC<SearchResultsProps> = ({
  results,
  onLessonClick,
}) => {
  const { t } = useTranslation();
  const keyExtractor = useCallback((result: ContentItem) => {
    return result.id;
  }, []);

  const searchResult = useCallback(
    (result: ContentItem) => {
      switch (result.contentType) {
        case ContentType.LESSON: {
          return (
            <LessonCard
              lesson={result}
              onClick={() => onLessonClick(result.id)}
            />
          );
        }
        case ContentType.APPLICATION: {
          return <ApplicationCard application={result} />;
        }
      }
    },
    [onLessonClick]
  );

  return (
    <ArrowNavigableContainer>
      <ul
        className="flex flex-col gap-md"
        aria-label={t(ARIA_LABELS.SEARCH.RESULTS_LIST)}
      >
        {results.map((result) => (
          <li key={keyExtractor(result)} data-nav-item>
            {searchResult(result)}
          </li>
        ))}
      </ul>
    </ArrowNavigableContainer>
  );
};
