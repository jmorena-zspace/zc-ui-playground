import type { Meta, StoryObj } from '@storybook/react';
import { BackButton } from './back-button';

const meta: Meta<typeof BackButton> = {
  title: 'Buttons/BackButton',
  component: BackButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A navigation button that allows users to go back to the previous page. Integrates with TanStack Router and only displays when navigation history is available, unless alwaysShow is true.',
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
type Story = StoryObj<typeof BackButton>;

export const Default: Story = {
  args: {
    alwaysShow: true,
  },
};
