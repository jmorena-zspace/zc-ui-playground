import { Pagination, PaginationProps } from '@components/pagination';
import {
  RowsPerPageSelector,
  RowsPerPageSelectorProps,
} from '@components/rows-per-page-selector';
import clsx from 'clsx';
import { FC, useMemo } from 'react';

type PaginationFooterProps = RowsPerPageSelectorProps &
  Omit<PaginationProps, 'totalPages'>;

export const PaginationFooter: FC<PaginationFooterProps> = ({
  currentPage,
  totalItems,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  options,
  className,
  resetScrollAfterPageChange = true,
}) => {
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  return (
    <div
      className={clsx(
        'flex flex-col md:flex-row justify-center md:justify-between items-center gap-md md:gap-none',
        className
      )}
    >
      <div className="hidden md:flex md:w-auto">
        <RowsPerPageSelector
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          options={options}
        />
      </div>
      <div className="w-fit md:w-auto">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          resetScrollAfterPageChange={resetScrollAfterPageChange}
        />
      </div>
    </div>
  );
};
