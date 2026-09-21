import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { NoInternetConnectionBadge } from './no-internet-connection-badge';

const meta: Meta<typeof NoInternetConnectionBadge> = {
  title: 'Badges/NoInternetConnectionBadge',
  component: NoInternetConnectionBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A clickable badge indicating offline status. Displays a disconnect icon and "Offline" text with negative status styling. Triggers an action when clicked.',
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
type Story = StoryObj<typeof NoInternetConnectionBadge>;

export const Default: Story = {
  args: {
    onClick: fn(),
  },
};
