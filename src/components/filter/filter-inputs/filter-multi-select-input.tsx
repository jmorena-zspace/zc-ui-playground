import { NoResultsIcon } from '@assets/no-results';
import { faChevronDown } from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { handleArrowNavigation } from '@shared/utils';
import { PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
import clsx from 'clsx';
import { ClearButton } from '../buttons/clear-button';
import { FilterButton } from '../buttons/filter-button';
import { FilterAccordion } from '../inputs/accordion';
import { FilterCheckbox } from '../inputs/checkbox';
import { FilterDropdown } from '../inputs/dropdown';
import { FilterQueryInput, useFilterQuery } from '../inputs/query-input';
import {
  BaseFilterValue,
  FilterMultiSelectInputData,
  FilterMultiSelectInputType,
} from '../types';

type FilterMultiSelectInputProps<T> = Omit<
  FilterMultiSelectInputData<T>,
  'input'
> &
  Omit<FilterMultiSelectInputType<T>, 'type'> & {
    onFilterChange: (newFilterCriteria: Partial<T>) => void;
  };

export function FilterMultiSelectInput<T>({
  title,
  appliedCount,
  value = [],
  valueKey,
  options,
  onFilterChange,
}: FilterMultiSelectInputProps<T>) {
  const { t } = useTranslation();

  const filterQuery = useFilterQuery();

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(filterQuery.query.toLowerCase())
  );

  const isChecked = (optionValue: BaseFilterValue) => {
    return value.includes(optionValue);
  };

  const showClearButton = appliedCount > 0 || filterQuery.input.length > 0;

  const showFilterOptions = filteredOptions.length > 0;

  const handleClearClick = () => {
    onFilterChange({
      [valueKey]: [],
    } as Partial<T>);
    filterQuery.clear();
  };

  const handleChange = (optionValue: BaseFilterValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    onFilterChange({
      [valueKey]: newValue,
    } as Partial<T>);
  };

  return (
    <>
      <FilterAccordion title={title} appliedCount={appliedCount}>
        <div role="group" aria-label={title}>
          {options.map((option) => (
            <button
              data-nav-item
              type="button"
              className="flex w-full items-center gap-xs rounded-xs p-xxs hover:bg-bg-surface-hover focus-visible:bg-bg-surface-hover focus-visible:outline-none"
              key={option.value}
              role="checkbox"
              aria-checked={isChecked(option.value)}
              onClick={() => handleChange(option.value)}
              onKeyDown={handleArrowNavigation}
            >
              <FilterCheckbox
                checked={isChecked(option.value)}
                label={option.label}
              />
            </button>
          ))}
        </div>
      </FilterAccordion>

      <div className="hidden md:block">
        <FilterDropdown
          variant="menu"
          renderTrigger={(isOpen) => (
            <FilterButton
              rightIcon={
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={clsx(
                    'transition-transform duration-200 ease-in-out',
                    { 'rotate-180': isOpen }
                  )}
                />
              }
              active={isOpen}
            >
              <span>{title}</span>
              {appliedCount > 0 && <span> ({appliedCount})</span>}
            </FilterButton>
          )}
          fixedSection={
            showClearButton && (
              <ClearButton onClick={handleClearClick}>
                {t(PAGE_TEXTS.UI.CLEAR)}
              </ClearButton>
            )
          }
        >
          <FilterDropdown.Section>
            <FilterQueryInput
              value={filterQuery.input}
              onChange={filterQuery.onChange}
              onClear={filterQuery.clear}
            />
          </FilterDropdown.Section>
          {showFilterOptions &&
            filteredOptions.map((option, index) => (
              <FilterDropdown.Item
                key={option.value}
                first={index === 0}
                checked={isChecked(option.value)}
                onClick={() => handleChange(option.value)}
              >
                <FilterCheckbox
                  checked={isChecked(option.value)}
                  label={option.label}
                />
              </FilterDropdown.Item>
            ))}
          {!showFilterOptions && (
            <div className="flex flex-col items-center justify-center gap-xs p-xs">
              <NoResultsIcon className="w-10 h-10 text-content-inverse-tertiary" />
              <span className="text-body-md font-regular text-content-secondary">
                {t(PAGE_TEXTS.UI.NO_RESULTS_FOR, { text: filterQuery.query })}
              </span>
            </div>
          )}
        </FilterDropdown>
      </div>
    </>
  );
}
