import type { Meta, StoryObj } from '@storybook/react';
import { LaunchingAppModal } from './launching-app-modal';

const meta: Meta<typeof LaunchingAppModal> = {
  title: 'Modals/LaunchingAppModal',
  component: LaunchingAppModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A loading modal displayed while launching content. Shows a spinner and the name of the content being launched. Auto-closes after 15 seconds. Integrates with desktop native app store.',
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
type Story = StoryObj<typeof LaunchingAppModal>;

export const Default: Story = {};
