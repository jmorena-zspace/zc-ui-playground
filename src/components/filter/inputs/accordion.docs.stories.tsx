import type { Meta, StoryObj } from '@storybook/react';
import { FilterAccordion } from './accordion';

const meta: Meta<typeof FilterAccordion> = {
  title: 'Filter Components/FilterAccordion',
  component: FilterAccordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An accordion wrapper for filter sections in mobile view. Shows filter title, applied count badge, and optional loading spinner. Mobile-only display (hidden on desktop).',
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
type Story = StoryObj<typeof FilterAccordion>;

export const Default: Story = {
  args: {
    title: 'Category',
    appliedCount: 2,
    isSearching: false,
    children: <div className="p-4">Filter options go here</div>,
  },
};
