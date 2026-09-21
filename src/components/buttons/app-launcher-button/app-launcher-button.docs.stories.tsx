import type { Meta, StoryObj } from '@storybook/react';
import { AppLauncherButton } from './app-launcher-button';

const meta: Meta<typeof AppLauncherButton> = {
  title: 'Buttons/AppLauncherButton',
  component: AppLauncherButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A specialized button for launching applications. Displays the application icon, launch code, and a dropdown indicator. Built on top of BaseButton.',
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
type Story = StoryObj<typeof AppLauncherButton>;

export const Default: Story = {
  args: {
    iconUrl: 'https://via.placeholder.com/18',
    launchCode: 'APP123',
  },
};
