import type { Meta, StoryObj } from '@storybook/react';
import { Ellipsis } from './ellipsis';

const meta: Meta<typeof Ellipsis> = {
  title: 'Pagination Components/Ellipsis',
  component: Ellipsis,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An ellipsis indicator for pagination. Displays "…" character to indicate skipped pages. Non-interactive with aria-hidden for screen readers.',
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
type Story = StoryObj<typeof Ellipsis>;

export const Default: Story = {};
