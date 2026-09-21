import type { Meta, StoryObj } from '@storybook/react';
import { bioDigitalHuman, franklinsLab } from '@fixtures/content-items';
import { fn } from 'storybook/test';
import { ApplicationLauncherCard } from './application-launcher-card';

const meta: Meta<typeof ApplicationLauncherCard> = {
  title: 'Components/ApplicationLauncherCard',
  component: ApplicationLauncherCard,
  argTypes: {
    disabled: { control: 'boolean' },
    hidden: { control: 'boolean' },
  },
  args: {
    onLaunch: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ApplicationLauncherCard>;

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
