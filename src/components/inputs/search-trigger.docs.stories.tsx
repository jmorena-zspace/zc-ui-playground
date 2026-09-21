import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { SearchTrigger } from './search-trigger';

const meta: Meta<typeof SearchTrigger> = {
  title: 'Inputs/SearchTrigger',
  component: SearchTrigger,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A button that triggers the global search modal. Displays a search icon, placeholder text, and keyboard shortcut (Cmd+K or Ctrl+K). Features an animated glow effect on hover.',
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
type Story = StoryObj<typeof SearchTrigger>;

export const Default: Story = {
  args: {
    onClick: fn(),
    variant: 'primary',
  },
};

export const Primary: Story = {
  args: {
    onClick: fn(),
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    onClick: fn(),
    variant: 'secondary',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#242424' }],
    },
  },
};
