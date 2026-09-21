import type { Meta, StoryObj } from '@storybook/react';
import { DesktopNavbar } from './desktop-navbar';

const meta: Meta<typeof DesktopNavbar> = {
  title: 'Layout/DesktopNavbar',
  component: DesktopNavbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The desktop navigation bar with logo, search trigger, settings, help, language switcher, and desktop badge. Features global search modal integration, internet connection monitoring with modal, and keyboard shortcut support (Cmd+K/Ctrl+K).',
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
type Story = StoryObj<typeof DesktopNavbar>;

export const Default: Story = {};
