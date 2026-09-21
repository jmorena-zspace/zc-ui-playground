import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { Filter } from './filter';
import {
  FilterInputType,
  FilterMultiSelectInputData,
  FiltersData,
} from './types';

type MockFilterCriteria = {
  type: string[];
  application: string[];
  subject: string[];
  sortBy: string;
  sortDirection?: string;
};

type SimpleCriteria = {
  category: string[];
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

const minimalFiltersData: FiltersData<SimpleCriteria> = {
  category: {
    title: 'Category',
    appliedCount: 0,
    value: [],
    input: {
      type: FilterInputType.MULTI_SELECT,
      valueKey: 'category',
      options: [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' },
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
        { label: 'Name', value: 'name', sortDirectionEnabled: false },
        { label: 'Date', value: 'date', sortDirectionEnabled: true },
      ],
    },
  },
};

const meta: Meta<typeof FilterStory> = {
  title: 'Features/Filter',
  component: FilterStory,
  tags: ['autodocs'],
  args: {
    onFilterChange: fn(),
    onClearAllFilters: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          'A comprehensive filtering component with modal interface. Supports multi-select filters, sort options, and search within filters. Displays active filter count and provides clear all functionality.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-[1280px] px-4">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Minimal: Story = {
  render: () => (
    <Filter<SimpleCriteria>
      filtersData={minimalFiltersData}
      onFilterChange={fn()}
      onClearAllFilters={fn()}
      isSearching={false}
    />
  ),
};

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
