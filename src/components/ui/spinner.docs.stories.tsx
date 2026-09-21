import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './spinner';

const meta: Meta<typeof Spinner> = {
  title: 'UI Primitives/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A loading spinner component with rotating animation. Used to indicate loading states throughout the application.',
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
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    className: 'w-6 h-6',
  },
};

export const Small: Story = {
  args: {
    className: 'w-4 h-4',
  },
};

export const Medium: Story = {
  args: {
    className: 'w-6 h-6',
  },
};

export const Large: Story = {
  args: {
    className: 'w-8 h-8',
  },
};

export const ExtraLarge: Story = {
  args: {
    className: 'w-16 h-16',
  },
};

export const CustomColor: Story = {
  args: {
    className: 'w-6 h-6 text-content-status-info',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      <Spinner className="w-4 h-4" />
      <Spinner className="w-6 h-6" />
      <Spinner className="w-8 h-8" />
      <Spinner className="w-12 h-12" />
      <Spinner className="w-16 h-16" />
    </div>
  ),
};
