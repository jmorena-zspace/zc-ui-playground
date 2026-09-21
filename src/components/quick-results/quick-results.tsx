import { NoResultsIcon } from '@assets/no-results';
import { faArrowRight } from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { AnimatedTitle } from '@components/animated-title';
import { ArrowNavigableContainer } from '@components/ui/arrow-navigable-container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FitToViewportOptions,
  useFitToViewport,
} from '@hooks/use-fit-to-viewport';
import { ARIA_LABELS, PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
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
      transparent = false,
      ...fitOptions
    },
    ref
  ) => {
    const { t } = useTranslation();
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
                  compact={inline}
                  invertedHover={transparent}
                  onLessonClick={onLessonClick}
                />
                <div
                  className={clsx({
                    'px-sm pb-xs': inline,
                    'px-lg pb-md pt-0': !inline,
                  })}
                >
                  <button
                    data-nav-item
                    aria-label={t(ARIA_LABELS.HOME.VIEW_ALL_RESULTS_BUTTON)}
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
                        {t(PAGE_TEXTS.HOME.VIEW_ALL_RESULTS, { count: total })}
                      </span>
                    </AnimatedTitle>
                    <FontAwesomeIcon
                      className={clsx({
                        'text-content-inverse-primary': transparent,
                        'text-content-link-inline-default': !transparent,
                      })}
                      icon={faArrowRight}
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
                  {t(PAGE_TEXTS.UI.NO_RESULTS_FOR, { text: search.trim() })}
                </span>
              </div>
            )}
          </>
        )}
      </ArrowNavigableContainer>
    );
  }
);
