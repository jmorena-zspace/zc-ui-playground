import type { Meta, StoryObj } from '@storybook/react';
import { LaunchCodeBadge } from './launch-code-badge';

const meta: Meta<typeof LaunchCodeBadge> = {
  title: 'Badges/LaunchCodeBadge',
  component: LaunchCodeBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A badge displaying a launch code for quick application or lesson access. Shows the code in a subtle bordered container with neutral styling.',
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
type Story = StoryObj<typeof LaunchCodeBadge>;

export const Default: Story = {
  args: {
    text: 'APP123',
  },
};

export const Short: Story = {
  args: {
    text: 'APP',
  },
};

export const Medium: Story = {
  args: {
    text: 'APP123',
  },
};

export const Long: Story = {
  args: {
    text: 'LONGCODE123',
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="flex gap-xs">
      <LaunchCodeBadge text="APP1" />
      <LaunchCodeBadge text="APP2" />
      <LaunchCodeBadge text="APP3" />
    </div>
  ),
};
