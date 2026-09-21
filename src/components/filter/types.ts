import { SortDirection } from '@zcentral-v2/types';

export type BaseFilterValue = string | number;

export type SortValue = {
  sortBy?: string;
  sortDirection?: SortDirection;
};

type BaseFilterInputData = {
  title: string;
};

export type FilterMultiSelectInputData<T> = BaseFilterInputData & {
  value?: BaseFilterValue[];
  input: FilterMultiSelectInputType<T>;
  appliedCount: number;
};

export type FilterSortInputData<T> = BaseFilterInputData & {
  value?: SortValue;
  input: FilterSortInputType<T>;
};

export type FilterInputData<T> =
  | FilterMultiSelectInputData<T>
  | FilterSortInputData<T>;

export type FilterMultiSelectInputType<T> = {
  type: FilterInputType.MULTI_SELECT;
  valueKey: keyof T;
  options: {
    label: string;
    value: BaseFilterValue;
  }[];
};

export type FilterSortInputType<T> = {
  type: FilterInputType.SORT;
  sortValueKey: keyof T;
  sortDirectionKey: keyof T;
  options: {
    label: string;
    value: BaseFilterValue;
    sortDirectionEnabled: boolean;
  }[];
};

export enum FilterInputType {
  MULTI_SELECT = 'MULTI_SELECT',
  SORT = 'SORT',
}

export type FiltersData<T> = Record<string, FilterInputData<T>>;
