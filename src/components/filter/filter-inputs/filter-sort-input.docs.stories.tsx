import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { SortDirection } from '@zcentral-v2/types';
import { FilterSortInput } from './filter-sort-input';

const meta: Meta<typeof FilterSortInput> = {
  title: 'Filter Components/FilterSortInput',
  component: FilterSortInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A sort filter input with ascending/descending toggle. Displays as accordion on mobile and dropdown on desktop. Shows arrow indicator for sort direction with smooth rotation animation.',
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
type Story = StoryObj<typeof FilterSortInput>;

export const Default: Story = {
  args: {
    title: 'Sort By',
    value: { sortBy: 'name', sortDirection: SortDirection.ASC },
    sortValueKey: 'sortBy',
    sortDirectionKey: 'sortDirection',
    options: [
      { label: 'Name', value: 'name', sortDirectionEnabled: true },
      { label: 'Date', value: 'date', sortDirectionEnabled: true },
    ],
    onFilterChange: fn(),
    isSearching: false,
  },
};
