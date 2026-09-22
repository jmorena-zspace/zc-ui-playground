import { ArrowUp, ArrowUpDown, ChevronDown } from 'lucide-react';
import { handleArrowNavigation } from '@shared/utils';
import { SortDirection } from '@zcentral-v2/types';
import clsx from 'clsx';
import { FilterButton } from '../buttons/filter-button';
import { FilterAccordion } from '../inputs/accordion';
import { FilterDropdown } from '../inputs/dropdown';
import { FilterRadio } from '../inputs/radio';
import {
  BaseFilterValue,
  FilterSortInputData,
  FilterSortInputType,
} from '../types';

type FilterSortInputProps<T> = Omit<FilterSortInputData<T>, 'input'> &
  Omit<FilterSortInputType<T>, 'type'> & {
    onFilterChange: (newFilterCriteria: Partial<T>) => void;
  };

export function FilterSortInput<T>({
  title,
  value,
  sortValueKey,
  sortDirectionKey,
  options,
  onFilterChange,
}: FilterSortInputProps<T>) {
  const currentSortBy =
    value?.sortBy === '' || value?.sortBy === undefined ? '' : value?.sortBy;

  const currentSortDirection = value?.sortDirection ?? SortDirection.ASC;

  const isDescending = currentSortDirection === SortDirection.DESC;

  const handleSortClick = (optionValue: BaseFilterValue) => {
    let newSortBy;
    let newSortDirection;

    if (optionValue && optionValue !== '') {
      const isSameSort = currentSortBy === optionValue;

      newSortBy = optionValue;
      newSortDirection = isSameSort
        ? isDescending
          ? SortDirection.ASC
          : SortDirection.DESC
        : SortDirection.ASC;
    }

    onFilterChange({
      [sortValueKey]: newSortBy,
      [sortDirectionKey]: newSortDirection,
    } as Partial<T>);
  };

  const renderSortArrow = (
    option: FilterSortInputType<T>['options'][number]
  ) => {
    const isSelected = currentSortBy === option.value;
    const showDescending = isSelected && isDescending;

    if (!option.sortDirectionEnabled) {
      return null;
    }

    return (
      <ArrowUp
        className={clsx(
          'h-4 w-4 text-content-primary transition-transform duration-200 ease-in-out',
          {
            'rotate-180': showDescending,
            'rotate-0': !showDescending,
            'opacity-100': isSelected,
            'opacity-0': !isSelected,
          }
        )}
      />
    );
  };

  return (
    <>
      <FilterAccordion title={title}>
        <div role="listbox" aria-label={title} tabIndex={-1} onKeyDown={handleArrowNavigation}>
          {options.map((option) => (
            <button
              data-nav-item
              key={option.value}
              className="flex w-full items-center gap-xs rounded-xs p-xxs hover:bg-bg-surface-hover focus-visible:bg-bg-surface-hover focus-visible:outline-none"
              role="option"
              aria-selected={currentSortBy === option.value}
              onClick={() => handleSortClick(option.value)}
            >
              <FilterRadio
                checked={currentSortBy === option.value}
                label={option.label}
              />
              {renderSortArrow(option)}
            </button>
          ))}
        </div>
      </FilterAccordion>

      <div className="hidden md:block">
        <FilterDropdown
          align="end"
          variant="menu"
          renderTrigger={(isOpen) => (
            <FilterButton
              leftIcon={<ArrowUpDown className="h-4 w-4" />}
              rightIcon={
                <ChevronDown
                  className={clsx(
                    'h-4 w-4 transition-transform duration-200 ease-in-out',
                    { 'rotate-180': isOpen }
                  )}
                />
              }
              active={isOpen}
            >
              <span>{title}</span>
            </FilterButton>
          )}
        >
          {options.map((option, index) => (
            <FilterDropdown.Item
              key={option.value}
              first={index === 0}
              checked={currentSortBy === option.value}
              exclusive
              onClick={() => handleSortClick(option.value)}
            >
              <FilterRadio
                className="cursor-pointer"
                checked={currentSortBy === option.value}
                label={option.label}
              />
              {renderSortArrow(option)}
            </FilterDropdown.Item>
          ))}
        </FilterDropdown>
      </div>
    </>
  );
}
