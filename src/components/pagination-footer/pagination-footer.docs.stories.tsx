import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { PaginationFooter } from './pagination-footer';

const meta: Meta<typeof PaginationFooter> = {
  title: 'Layout/PaginationFooter',
  component: PaginationFooter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A composite footer component combining pagination controls and rows-per-page selector. Responsive layout shows selector only on desktop. Automatically calculates total pages based on items and page size.',
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
type Story = StoryObj<typeof PaginationFooter>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalItems: 100,
    itemsPerPage: 10,
    onPageChange: fn(),
    onItemsPerPageChange: fn(),
    options: [10, 25, 50, 100],
  },
};
