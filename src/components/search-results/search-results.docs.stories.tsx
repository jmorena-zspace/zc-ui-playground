import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { ContentPlatform, ContentType } from '@zcentral-v2/types';
import { SearchResults } from './search-results';

const meta: Meta<typeof SearchResults> = {
  title: 'Features/SearchResults',
  component: SearchResults,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A component for displaying search results as a list. Renders different card types (LessonCard, ApplicationCard) based on content type. Handles lesson click navigation.',
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
type Story = StoryObj<typeof SearchResults>;

export const Default: Story = {
  args: {
    results: [
      {
        id: '1',
        name: 'Example Lesson',
        contentType: ContentType.LESSON,
        imageUrl: 'https://via.placeholder.com/96',
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
  },
};
