import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { PrepareOfflineModal } from './prepare-offline-modal';

const meta: Meta<typeof PrepareOfflineModal> = {
  title: 'Modals/PrepareOfflineModal',
  component: PrepareOfflineModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal for downloading offline content cache. Shows progress bar during sync, success/error states with icons, and retry functionality. Integrates with offline search API and tracks last download date.',
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
type Story = StoryObj<typeof PrepareOfflineModal>;

export const Default: Story = {
  args: {
    show: true,
    onClose: fn(),
  },
};
