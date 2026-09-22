import { Label } from '@components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { cn } from '@shared/utils';
import { PAGINATION_ITEMS_PER_PAGE_OPTIONS } from '@zcentral-v2/constants';
import { FC } from 'react';

export type RowsPerPageSelectorProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  options?: number[];
  className?: string;
};

export const RowsPerPageSelector: FC<RowsPerPageSelectorProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  options = PAGINATION_ITEMS_PER_PAGE_OPTIONS,
  className,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn('flex items-center gap-sm', className)}>
      <Label htmlFor="rows-per-page">Rows per page</Label>
      <Select
        value={String(itemsPerPage)}
        onValueChange={(value) => onItemsPerPageChange(Number(value))}
      >
        <SelectTrigger
          id="rows-per-page"
          className="min-w-fit"
          aria-label="Rows per page selector"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-body-md font-normal text-content-tertiary">
        {`${startItem}–${endItem} of ${totalItems}`}
      </span>
    </div>
  );
};
