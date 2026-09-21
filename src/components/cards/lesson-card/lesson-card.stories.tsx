import type { Meta, StoryObj } from '@storybook/react';
import { andOrCircuits, lessonSingleApp } from '@fixtures/content-items';
import { fn } from 'storybook/test';
import { LessonCard } from './lesson-card';

const meta: Meta<typeof LessonCard> = {
  title: 'Components/LessonCard',
  component: LessonCard,
  argTypes: {
    compact: { control: 'boolean' },
    invertedHover: { control: 'boolean' },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof LessonCard>;

export const Default: Story = {
  args: {
    lesson: andOrCircuits,
  },
};

export const Compact: Story = {
  args: {
    lesson: andOrCircuits,
    compact: true,
  },
};

export const InvertedHover: Story = {
  args: {
    lesson: andOrCircuits,
    invertedHover: true,
  },
};

export const SingleApp: Story = {
  args: {
    lesson: lessonSingleApp,
  },
};

export const MobileDefault: Story = {
  args: {
    lesson: andOrCircuits,
  },
  globals: {
    viewport: 'mobile',
  },
};
