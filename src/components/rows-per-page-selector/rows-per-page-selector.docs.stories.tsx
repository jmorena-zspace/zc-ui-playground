import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { RowsPerPageSelector } from './rows-per-page-selector';

const meta: Meta<typeof RowsPerPageSelector> = {
  title: 'Features/RowsPerPageSelector',
  component: RowsPerPageSelector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A selector for changing the number of items displayed per page. Shows current range (e.g., "1-10 of 100") and provides dropdown to adjust page size. Used in conjunction with pagination controls.',
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
type Story = StoryObj<typeof RowsPerPageSelector>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalItems: 100,
    itemsPerPage: 10,
    onItemsPerPageChange: fn(),
    options: [10, 25, 50, 100],
  },
};
