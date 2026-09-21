import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { FilterMultiSelectInput } from './filter-multi-select-input';

const meta: Meta<typeof FilterMultiSelectInput> = {
  title: 'Filter Components/FilterMultiSelectInput',
  component: FilterMultiSelectInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A multi-select filter input with search functionality. Displays as accordion on mobile and dropdown on desktop. Features query input for filtering options, clear button, and applied count badge. Shows no results state when search yields no matches.',
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
type Story = StoryObj<typeof FilterMultiSelectInput>;

export const Default: Story = {
  args: {
    title: 'Category',
    appliedCount: 0,
    value: [],
    valueKey: 'category',
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
      { label: 'Option 3', value: 'opt3' },
    ],
    onFilterChange: fn(),
    isSearching: false,
  },
};
