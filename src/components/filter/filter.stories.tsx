import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import {
  FilterInputType,
  FilterMultiSelectInputData,
  FiltersData,
} from './types';
import { Filter } from './filter';

type MockFilterCriteria = {
  type: string[];
  application: string[];
  subject: string[];
  sortBy: string;
  sortDirection?: string;
};

const FilterStory = (props: {
  filtersData: FiltersData<MockFilterCriteria>;
  onFilterChange: (criteria: Partial<MockFilterCriteria>) => void;
  onClearAllFilters?: () => void;
  isSearching?: boolean;
}) => <Filter<MockFilterCriteria> {...props} />;

const defaultFiltersData: FiltersData<MockFilterCriteria> = {
  type: {
    title: 'Type',
    appliedCount: 0,
    value: [],
    input: {
      type: FilterInputType.MULTI_SELECT,
      valueKey: 'type',
      options: [
        { label: 'Lesson', value: 'lesson' },
        { label: 'Application', value: 'application' },
      ],
    },
  },
  application: {
    title: 'Application',
    appliedCount: 0,
    value: [],
    input: {
      type: FilterInputType.MULTI_SELECT,
      valueKey: 'application',
      options: [
        { label: "Franklin's Lab", value: "Franklin's Lab" },
        { label: 'BioDigital Human zSpace', value: 'BioDigital Human zSpace' },
        { label: 'Leopoly', value: 'Leopoly' },
        { label: 'zSpace Inspire', value: 'zSpace Inspire' },
        { label: 'Geogebra', value: 'Geogebra' },
      ],
    },
  },
  subject: {
    title: 'Subject',
    appliedCount: 0,
    value: [],
    input: {
      type: FilterInputType.MULTI_SELECT,
      valueKey: 'subject',
      options: [
        { label: 'Science', value: 'Science' },
        { label: 'Technology', value: 'Technology' },
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Mathematics', value: 'Mathematics' },
        {
          label: 'Agriculture, Food and Natural Resources',
          value: 'Agriculture, Food and Natural Resources',
        },
        {
          label: 'Architecture and Construction',
          value: 'Architecture and Construction',
        },
      ],
    },
  },
  sort: {
    title: 'Sort',
    appliedCount: 0,
    value: { sortBy: '', sortDirection: undefined },
    input: {
      type: FilterInputType.SORT,
      sortValueKey: 'sortBy',
      sortDirectionKey: 'sortDirection',
      options: [
        {
          label: 'Relevance',
          value: '',
          sortDirectionEnabled: false,
        },
        {
          label: 'Alphabetical',
          value: 'name',
          sortDirectionEnabled: true,
        },
      ],
    },
  },
};

const filtersWithApplied: FiltersData<MockFilterCriteria> = {
  ...defaultFiltersData,
  type: {
    ...defaultFiltersData.type,
    appliedCount: 1,
    value: ['lesson'],
  } as FilterMultiSelectInputData<MockFilterCriteria>,
  subject: {
    ...defaultFiltersData.subject,
    appliedCount: 2,
    value: ['Science', 'Technology'],
  } as FilterMultiSelectInputData<MockFilterCriteria>,
};

const meta: Meta<typeof FilterStory> = {
  title: 'Components/Filter',
  component: FilterStory,
  args: {
    onFilterChange: fn(),
    onClearAllFilters: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filtersData: defaultFiltersData,
  },
};

export const WithFiltersApplied: Story = {
  args: {
    filtersData: filtersWithApplied,
  },
};

export const MobileDefault: Story = {
  args: {
    filtersData: defaultFiltersData,
  },
  globals: {
    viewport: 'mobile',
  },
};

export const MobileWithFiltersApplied: Story = {
  args: {
    filtersData: filtersWithApplied,
  },
  globals: {
    viewport: 'mobile',
  },
};
