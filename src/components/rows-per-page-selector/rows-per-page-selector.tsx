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
import { ARIA_LABELS, PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
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
  const { t } = useTranslation();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn('flex items-center gap-sm', className)}>
      <Label htmlFor="rows-per-page">{t(PAGE_TEXTS.UI.ROWS_PER_PAGE)}</Label>
      <Select
        value={String(itemsPerPage)}
        onValueChange={(value) => onItemsPerPageChange(Number(value))}
      >
        <SelectTrigger
          id="rows-per-page"
          className="min-w-fit"
          aria-label={t(ARIA_LABELS.UI.ROWS_PER_PAGE_SELECTOR)}
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
        {t(PAGE_TEXTS.UI.START_ITEM_END_ITEM_OF_TOTAL_ITEMS, {
          startItem,
          endItem,
          totalItems,
        })}
      </span>
    </div>
  );
};
