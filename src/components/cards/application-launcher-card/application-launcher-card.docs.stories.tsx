import type { Meta, StoryObj } from '@storybook/react';
import { bioDigitalHuman, franklinsLab } from '@fixtures/content-items';
import { fn } from 'storybook/test';
import { ContentPlatform } from '@zcentral-v2/types';
import { ApplicationLauncherCard } from './application-launcher-card';

const meta: Meta<typeof ApplicationLauncherCard> = {
  title: 'Cards/ApplicationLauncherCard',
  component: ApplicationLauncherCard,
  tags: ['autodocs'],
  args: {
    onLaunch: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          'A specialized card for launching applications from the app launcher. Features application icon in a circular badge, animated title with external link icon for web apps, and platform indicator. Includes tooltip for truncated names.',
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
type Story = StoryObj<typeof ApplicationLauncherCard>;

export const Default: Story = {
  args: {
    application: {
      id: '1',
      name: 'Example Application',
      iconUrl: 'https://via.placeholder.com/40',
      platform: ContentPlatform.DESKTOP,
    },
    disabled: false,
    onLaunch: fn(),
  },
};

export const DesktopApp: Story = {
  args: {
    application: franklinsLab,
  },
};

export const WebApp: Story = {
  args: {
    application: bioDigitalHuman,
  },
};

export const Disabled: Story = {
  args: {
    application: franklinsLab,
    disabled: true,
  },
};
