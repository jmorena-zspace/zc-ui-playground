import type { Meta, StoryObj } from '@storybook/react';
import { DesktopBadge } from './desktop-badge';

const meta: Meta<typeof DesktopBadge> = {
  title: 'Badges/DesktopBadge',
  component: DesktopBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A simple badge indicating desktop platform. Displays localized "Desktop" text with teal accent styling.',
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
type Story = StoryObj<typeof DesktopBadge>;

export const Default: Story = {};
