import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { BlurredModal } from './blurred-modal';

const meta: Meta<typeof BlurredModal> = {
  title: 'Modals/BlurredModal',
  component: BlurredModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal component with blurred backdrop built on Radix UI Dialog. Supports multiple sizes, dismissible/non-dismissible modes, and centered positioning. Hidden on mobile devices. Features smooth enter/exit animations.',
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
type Story = StoryObj<typeof BlurredModal>;

export const Default: Story = {
  args: {
    show: true,
    onClose: fn(),
    size: 'xl',
    dismissible: true,
    centered: false,
    ariaLabel: 'Example Modal',
    children: (
      <div className="p-6 bg-bg-surface-default rounded-md">
        <h2 className="text-display-md font-semibold text-content-primary mb-4">
          Modal Content
        </h2>
        <p className="text-body-md text-content-secondary">
          This is an example modal content.
        </p>
      </div>
    ),
  },
};
