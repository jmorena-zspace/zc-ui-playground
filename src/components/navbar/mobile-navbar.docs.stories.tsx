import type { Meta, StoryObj } from '@storybook/react';
import { MobileNavbar } from './mobile-navbar';

const meta: Meta<typeof MobileNavbar> = {
  title: 'Layout/MobileNavbar',
  component: MobileNavbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The mobile navigation bar with logo, expandable search input, settings, help, and language switcher. Features animated search icon that transitions to close icon when search is active. Mobile-only display (hidden on desktop).',
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
type Story = StoryObj<typeof MobileNavbar>;

export const Default: Story = {};
