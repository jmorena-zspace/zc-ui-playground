import { useMainScrollContainer } from '@hooks/main-scroll-container';
import { ARIA_LABELS, useTranslation } from '@zcentral-v2/i18n';
import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { ChevronButton } from './chevron-button';
import { Ellipsis } from './ellipsis';
import { PageButton } from './page-button';

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
  resetScrollAfterPageChange?: boolean;
};

type PaginationItem = number | 'ellipsis';

function normalizePagination(
  current: number | undefined,
  total: number | undefined
) {
  const pages = Math.max(1, total ?? 1);
  const page = Math.min(Math.max(1, current ?? 1), pages);
  return { page, pages };
}

function buildRange(page: number, pages: number): PaginationItem[] {
  if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
  if (page <= 3) return [1, 2, 3, 'ellipsis', pages];
  if (page >= pages - 2) return [1, 'ellipsis', pages - 2, pages - 1, pages];
  return [1, 'ellipsis', page, 'ellipsis', pages];
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  resetScrollAfterPageChange = true,
}) => {
  const { t } = useTranslation();
  const scrollContainerRef = useMainScrollContainer();
  const prevPageRef = useRef(currentPage);

  useEffect(() => {
    if (resetScrollAfterPageChange && currentPage !== prevPageRef.current) {
      (scrollContainerRef?.current ?? window).scrollTo({ top: 0 });
      prevPageRef.current = currentPage;
    }
  }, [currentPage, resetScrollAfterPageChange, scrollContainerRef]);

  const { page, pages } = useMemo(
    () => normalizePagination(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const items = useMemo(() => buildRange(page, pages), [page, pages]);

  const canGoPrev = page > 1;
  const canGoNext = page < pages;

  const handlePrev = useCallback(() => {
    if (!onPageChange || !canGoPrev) return;
    onPageChange(page - 1);
  }, [onPageChange, canGoPrev, page]);

  const handleNext = useCallback(() => {
    if (!onPageChange || !canGoNext) return;
    onPageChange(page + 1);
  }, [onPageChange, canGoNext, page]);

  return (
    <nav role="navigation" aria-label={t(ARIA_LABELS.UI.PAGINATION)}>
      <ul className="flex items-center overflow-hidden border-default border-border-system-subtle rounded-xs pagination-separators text-content-secondary">
        <li>
          <ChevronButton
            direction="left"
            onClick={handlePrev}
            disabled={!canGoPrev}
          />
        </li>

        {items.map((item, idx) => {
          if (typeof item === 'number') {
            return (
              <li key={`page-${item}`}>
                <PageButton
                  isCurrentPage={item === page}
                  onClick={() => onPageChange?.(item)}
                >
                  {item}
                </PageButton>
              </li>
            );
          }

          return (
            <li key={`ellipsis-${idx}`}>
              <Ellipsis />
            </li>
          );
        })}

        <li>
          <ChevronButton
            direction="right"
            onClick={handleNext}
            disabled={!canGoNext}
          />
        </li>
      </ul>
    </nav>
  );
};
