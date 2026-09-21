import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { RescanContentModal } from './rescan-content-modal';

const meta: Meta<typeof RescanContentModal> = {
  title: 'Modals/RescanContentModal',
  component: RescanContentModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal for rescanning available content. Shows progress bar during scan, success/error states with icons, and retry functionality. Integrates with desktop native app store and tracks last scanned date.',
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
type Story = StoryObj<typeof RescanContentModal>;

export const Default: Story = {
  args: {
    show: true,
    onClose: fn(),
  },
};
