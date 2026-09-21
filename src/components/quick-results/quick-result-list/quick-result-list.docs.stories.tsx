import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { ContentPlatform, ContentType } from '@zcentral-v2/types';
import { QuickResultList } from './quick-result-list';

const meta: Meta<typeof QuickResultList> = {
  title: 'Features/QuickResultList',
  component: QuickResultList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A list component for rendering quick search results. Displays compact versions of LessonCard and ApplicationCard. Supports inverted hover states for dark surfaces and compact mode for embedded use.',
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
type Story = StoryObj<typeof QuickResultList>;

export const Default: Story = {
  args: {
    results: [
      {
        id: '1',
        name: 'Example Lesson',
        contentType: ContentType.LESSON,
        subjects: [],
        apps: [],
      },
      {
        id: '2',
        name: 'Example Application',
        contentType: ContentType.APPLICATION,
        platform: ContentPlatform.DESKTOP,
        iconUrl: 'https://via.placeholder.com/96',
      },
    ],
    onLessonClick: fn(),
    compact: false,
    invertedHover: false,
  },
};
