import type { Meta, StoryObj } from '@storybook/react';
import { andOrCircuits, lessonSingleApp } from '@fixtures/content-items';
import { fn } from 'storybook/test';
import { ContentPlatform } from '@zcentral-v2/types';
import { LessonCard } from './lesson-card';

const meta: Meta<typeof LessonCard> = {
  title: 'Cards/LessonCard',
  component: LessonCard,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          'A comprehensive card for displaying lesson content items. Shows lesson image, title, subjects, associated applications with launch buttons, and content badge. Supports compact mode and inverted hover states. Features animated launch buttons that appear on hover.',
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
type Story = StoryObj<typeof LessonCard>;

export const Placeholder: Story = {
  args: {
    lesson: {
      id: '1',
      name: 'Introduction to Algebra',
      imageUrl: 'https://via.placeholder.com/96',
      subjects: [
        { id: '1', name: 'Mathematics', iconUrl: 'https://via.placeholder.com/32' },
        { id: '2', name: 'Science', iconUrl: 'https://via.placeholder.com/32' },
      ],
      apps: [
        {
          id: '1',
          name: 'Khan Academy',
          iconUrl: 'https://via.placeholder.com/16',
          appLaunchCode: 'KA',
          deepLinkingLaunchCode: 'MATH101',
          platform: ContentPlatform.WEB,
        },
      ],
    },
    compact: false,
    invertedHover: false,
    onClick: fn(),
  },
};

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
