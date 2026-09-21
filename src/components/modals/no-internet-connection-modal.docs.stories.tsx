import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { NoInternetConnectionModal } from './no-internet-connection-modal';

const meta: Meta<typeof NoInternetConnectionModal> = {
  title: 'Modals/NoInternetConnectionModal',
  component: NoInternetConnectionModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal displayed when internet connection is lost. Provides information about offline functionality, retry button with loading state, and option to continue offline. Non-dismissible to ensure user acknowledgment.',
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
type Story = StoryObj<typeof NoInternetConnectionModal>;

export const Default: Story = {
  args: {
    show: true,
    onClose: fn(),
    onRetry: fn(),
  },
};
