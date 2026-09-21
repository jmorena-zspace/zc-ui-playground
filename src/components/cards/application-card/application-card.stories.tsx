import type { Meta, StoryObj } from '@storybook/react';
import {
  applicationNoIcon,
  bioDigitalHuman,
  franklinsLab,
} from '@fixtures/content-items';
import { ApplicationCard } from './application-card';

const meta: Meta<typeof ApplicationCard> = {
  title: 'Components/ApplicationCard',
  component: ApplicationCard,
  argTypes: {
    compact: { control: 'boolean' },
    invertedHover: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ApplicationCard>;

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
