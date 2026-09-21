import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { ChevronButton } from './chevron-button';

const meta: Meta<typeof ChevronButton> = {
  title: 'Pagination Components/ChevronButton',
  component: ChevronButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A navigation button with chevron icon for pagination. Supports left/right directions, disabled state, and localized aria labels for accessibility.',
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
type Story = StoryObj<typeof ChevronButton>;

export const Default: Story = {
  args: {
    direction: 'right',
    onClick: fn(),
    disabled: false,
  },
};
