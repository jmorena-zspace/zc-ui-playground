import type { Meta, StoryObj } from '@storybook/react';
import {
  applicationNoIcon,
  bioDigitalHuman,
  franklinsLab,
} from '@fixtures/content-items';
import { ContentPlatform } from '@zcentral-v2/types';
import { ApplicationCard } from './application-card';

const meta: Meta<typeof ApplicationCard> = {
  title: 'Cards/ApplicationCard',
  component: ApplicationCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A card component for displaying application content items. Shows application icon, name, launch code badge, content badge, and launch button. Supports compact mode and inverted hover states for different surfaces.',
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
type Story = StoryObj<typeof ApplicationCard>;

export const Default: Story = {
  args: {
    application: {
      id: '1',
      name: 'Example Application',
      launchCode: 'APP123',
      platform: ContentPlatform.DESKTOP,
      iconUrl: 'https://via.placeholder.com/96',
    },
    compact: false,
    invertedHover: false,
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

export const Compact: Story = {
  args: {
    application: franklinsLab,
    compact: true,
  },
};

export const InvertedHover: Story = {
  args: {
    application: franklinsLab,
    invertedHover: true,
  },
};

export const NoIcon: Story = {
  args: {
    application: applicationNoIcon,
  },
};

export const Mobile: Story = {
  args: {
    application: franklinsLab,
  },
  globals: {
    viewport: 'mobile',
  },
};
