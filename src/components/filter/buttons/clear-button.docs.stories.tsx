import type { Meta, StoryObj } from '@storybook/react';
import { ClearButton } from './clear-button';

const meta: Meta<typeof ClearButton> = {
  title: 'Filter Components/ClearButton',
  component: ClearButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A text button for clearing filters. Features negative status color with hover effect to emphasize the destructive action.',
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
type Story = StoryObj<typeof ClearButton>;

export const Default: Story = {
  args: {
    children: 'Clear All',
  },
};
