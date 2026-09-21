import { faFilter } from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { ClearButton } from './buttons/clear-button';
import { FilterButton } from './buttons/filter-button';
import { FilterMultiSelectInput } from './filter-inputs/filter-multi-select-input';
import { FilterSortInput } from './filter-inputs/filter-sort-input';
import { FilterQueryInput, useFilterQuery } from './inputs/query-input';
import { FilterModal } from './modal/filter-modal';
import {
  FilterInputType,
  FilterMultiSelectInputData,
  FiltersData,
  FilterSortInputData,
} from './types';

type FilterProps<T> = {
  filtersData: FiltersData<T>;
  onFilterChange: (newFilterCriteria: Partial<T>) => void;
  onClearAllFilters?: () => void;
};

export function Filter<T>({
  filtersData,
  onFilterChange,
  onClearAllFilters,
}: FilterProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filterQuery = useFilterQuery();

  const hasFiltersApplied = Object.values(filtersData).some(
    (filter) =>
      filter.input.type === FilterInputType.MULTI_SELECT &&
      (filter as FilterMultiSelectInputData<T>).appliedCount > 0
  );

  const filteredFiltersData = Object.values(filtersData)
    .map((filter) => {
      if (filter.input.type === FilterInputType.MULTI_SELECT) {
        const multiSelectFilter = filter as FilterMultiSelectInputData<T>;
        const filteredOptions = multiSelectFilter.input.options.filter(
          (option) =>
            option.label.toLowerCase().includes(filterQuery.query.toLowerCase())
        );
        return {
          ...multiSelectFilter,
          input: {
            ...multiSelectFilter.input,
            options: filteredOptions,
          },
        };
      }
      return filter;
    })
    .filter((filter) => {
      if (filter.input.type === FilterInputType.MULTI_SELECT) {
        const multiSelectFilter = filter as FilterMultiSelectInputData<T>;
        return multiSelectFilter.input.options.length > 0;
      }
      return true;
    });

  const totalFiltersApplied = Object.values(filteredFiltersData).reduce(
    (acc, filter) =>
      filter.input.type === FilterInputType.MULTI_SELECT
        ? acc + (filter as FilterMultiSelectInputData<T>).appliedCount
        : acc,
    0
  );

  const onClearAllFiltersModalHandler = () => {
    filterQuery.clear();
    onClearAllFilters?.();
  };

  const multiSelectFilters = filteredFiltersData.filter(
    (f) => f.input.type === FilterInputType.MULTI_SELECT
  ) as FilterMultiSelectInputData<T>[];

  const sortFilters = filteredFiltersData.filter(
    (f) => f.input.type === FilterInputType.SORT
  ) as FilterSortInputData<T>[];

  const renderAllFilters = () => {
    return filteredFiltersData.map((filter) => {
      switch (filter.input.type) {
        case FilterInputType.MULTI_SELECT: {
          const multiSelectFilter = filter as FilterMultiSelectInputData<T>;
          return (
            <FilterMultiSelectInput
              key={multiSelectFilter.title}
              title={multiSelectFilter.title}
              appliedCount={multiSelectFilter.appliedCount}
              value={multiSelectFilter.value}
              valueKey={multiSelectFilter.input.valueKey}
              options={multiSelectFilter.input.options}
              onFilterChange={onFilterChange}
            />
          );
        }
        case FilterInputType.SORT: {
          const sortFilter = filter as FilterSortInputData<T>;
          return (
            <FilterSortInput
              key={sortFilter.title}
              title={sortFilter.title}
              value={sortFilter.value}
              sortValueKey={sortFilter.input.sortValueKey}
              sortDirectionKey={sortFilter.input.sortDirectionKey}
              options={sortFilter.input.options}
              onFilterChange={onFilterChange}
            />
          );
        }
        default: {
          return null;
        }
      }
    });
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-xxs md:gap-none">
      <div className="flex w-full md:hidden">
        <FilterButton fullSized onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faFilter} className="h-3 w-3" />
          <span>Filter</span>
          {totalFiltersApplied > 0 && <span> ({totalFiltersApplied})</span>}
        </FilterButton>

        <FilterModal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          hasFiltersApplied={hasFiltersApplied}
          header={
            <FilterQueryInput
              value={filterQuery.input}
              onChange={filterQuery.onChange}
              onClear={filterQuery.clear}
            />
          }
        >
          {renderAllFilters()}
          {hasFiltersApplied && (
            <div className="flex justify-end">
              <ClearButton
                className="py-xxs"
                onClick={onClearAllFiltersModalHandler}
              >
                Clear all
              </ClearButton>
            </div>
          )}
        </FilterModal>
      </div>

      <div className="hidden md:flex items-center gap-sm w-full md:flex-wrap">
        <div className="flex items-center gap-sm">
          {multiSelectFilters.map((filter) => (
            <FilterMultiSelectInput
              key={filter.title}
              title={filter.title}
              appliedCount={filter.appliedCount}
              value={filter.value}
              valueKey={filter.input.valueKey}
              options={filter.input.options}
              onFilterChange={onFilterChange}
            />
          ))}
          {hasFiltersApplied && (
            <ClearButton onClick={onClearAllFilters} className="px-sm py-xxs">
              Clear all
            </ClearButton>
          )}
        </div>

        <div className="flex items-center gap-sm flex-1 justify-end">
          {sortFilters.map((filter) => (
            <FilterSortInput
              key={filter.title}
              title={filter.title}
              value={filter.value}
              sortValueKey={filter.input.sortValueKey}
              sortDirectionKey={filter.input.sortDirectionKey}
              options={filter.input.options}
              onFilterChange={onFilterChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
