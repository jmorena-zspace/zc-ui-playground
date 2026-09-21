import type { Meta, StoryObj } from '@storybook/react';
import { DesktopPromptModal } from './desktop-prompt-modal';

const meta: Meta<typeof DesktopPromptModal> = {
  title: 'Modals/DesktopPromptModal',
  component: DesktopPromptModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal prompting users to launch the zCentral Desktop app. Appears automatically after a delay when not running in the desktop app. Non-dismissible with options to launch desktop app or continue in browser.',
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
type Story = StoryObj<typeof DesktopPromptModal>;

export const Default: Story = {};
