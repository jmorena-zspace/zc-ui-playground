import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { FilterModal } from './filter-modal';

const meta: Meta<typeof FilterModal> = {
  title: 'Features/FilterModal',
  component: FilterModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A full-screen modal for mobile filter interface. Built on Radix UI Dialog with custom animations. Shows check icon when filters are applied, X icon otherwise. Mobile-only display (hidden on desktop).',
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
type Story = StoryObj<typeof FilterModal>;

export const Default: Story = {
  args: {
    show: true,
    onClose: fn(),
    hasFiltersApplied: false,
    header: <h2 className="text-body-lg font-semibold">Filters</h2>,
    children: <div className="p-4">Filter content goes here</div>,
  },
};
