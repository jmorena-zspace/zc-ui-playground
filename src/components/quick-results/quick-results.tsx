import { ArrowRight } from 'lucide-react';
import { NoResultsIcon } from '@assets/no-results';
import { AnimatedTitle } from '@components/animated-title';
import { ArrowNavigableContainer } from '@components/ui/arrow-navigable-container';
import {
  FitToViewportOptions,
  useFitToViewport,
} from '@hooks/use-fit-to-viewport';
import { ContentItem } from '@zcentral-v2/types';
import clsx from 'clsx';
import { forwardRef, useRef } from 'react';
import { QuickResultList } from './quick-result-list/quick-result-list';

export type QuickResultsProps = {
  showResults: boolean;
  resultsHaveHits: boolean;
  onViewAllSearchResults: () => void;
  onLessonClick: (lessonId: string) => void;
  results?: ContentItem[];
  total?: number;
  search: string;
  inline?: boolean;
  /**
   * Drops the list's horizontal padding. Defaults to `inline`, which is how
   * the spotlight embeds it; pass `false` to keep the padding while still
   * rendering in flow.
   */
  compact?: boolean;
  transparent?: boolean;
} & FitToViewportOptions;

export const QuickResults = forwardRef<HTMLDivElement, QuickResultsProps>(
  (
    {
      showResults,
      resultsHaveHits,
      results,
      total = 0,
      search,
      onViewAllSearchResults,
      onLessonClick,
      inline = false,
      compact = inline,
      transparent = false,
      ...fitOptions
    },
    ref
  ) => {
      const containerRef = useRef<HTMLDivElement>(null);

    useFitToViewport(containerRef, results?.length ?? 0, fitOptions);

    return (
      <ArrowNavigableContainer
        ref={(node: HTMLDivElement | null) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={clsx({
          'w-full': inline,
          'bg-bg-overlay-default backdrop-blur-sm rounded-lg shadow-sm':
            inline && !transparent,
          'hidden w-full absolute top-9 left-0 mt-xs z-10 rounded-lg bg-bg-overlay-default backdrop-blur-sm border border-border-system-subtle shadow-sm md:block':
            !inline,
          invisible: !showResults,
        })}
      >
        {showResults && (
          <>
            {resultsHaveHits && results && (
              <>
                <QuickResultList
                  results={results}
                  compact={compact}
                  invertedHover={transparent}
                  onLessonClick={onLessonClick}
                />
                <div
                  className={clsx({
                    'px-md pb-md': compact || inline,
                    'px-lg pb-md pt-0': !inline && !compact,
                  })}
                >
                  <button
                    data-nav-item
                    aria-label={`View all ${total} results`}
                    className="group relative inline-flex items-center gap-xs cursor-pointer"
                    onClick={onViewAllSearchResults}
                  >
                    <AnimatedTitle showIcon={false}>
                      <span
                        className={clsx('text-body-md font-medium', {
                          'text-content-inverse-primary': transparent,
                          'text-content-link-inline-default': !transparent,
                        })}
                      >
                        {`View all ${total} results`}
                      </span>
                    </AnimatedTitle>
                    <ArrowRight
                      className={clsx('h-4 w-4', {
                        'text-content-inverse-primary': transparent,
                        'text-content-link-inline-default': !transparent,
                      })}
                    />
                  </button>
                </div>
              </>
            )}
            {!resultsHaveHits && (
              <div
                className={clsx(
                  'p-xl flex flex-col items-center gap-xs break-all',
                  {
                    'bg-bg-surface-default rounded-lg': !transparent,
                  }
                )}
              >
                <NoResultsIcon
                  className={clsx('w-20 h-20 md:w-30 md:h-30', {
                    'text-content-inverse-secondary': transparent,
                    'text-content-inverse-tertiary': !transparent,
                  })}
                />
                <span
                  className={clsx('text-display-sm font-medium', {
                    'text-content-inverse-primary': transparent,
                    'text-content-secondary': !transparent,
                  })}
                >
                  {`No results for "${search.trim()}"`}
                </span>
              </div>
            )}
          </>
        )}
      </ArrowNavigableContainer>
    );
  }
);
