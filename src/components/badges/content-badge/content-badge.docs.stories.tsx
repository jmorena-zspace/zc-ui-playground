import type { Meta, StoryObj } from '@storybook/react';
import { ContentBadge, ContentBadgeType } from './content-badge';

const meta: Meta<typeof ContentBadge> = {
  title: 'Badges/ContentBadge',
  component: ContentBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A badge component for indicating content type (lesson or application). Displays an icon and localized label with color-coded styling based on the content type.',
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
type Story = StoryObj<typeof ContentBadge>;

export const Default: Story = {
  args: {
    type: ContentBadgeType.LESSON,
  },
};

export const Lesson: Story = {
  args: {
    type: ContentBadgeType.LESSON,
  },
};

export const Application: Story = {
  args: {
    type: ContentBadgeType.APPLICATION,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex gap-md">
      <ContentBadge type={ContentBadgeType.LESSON} />
      <ContentBadge type={ContentBadgeType.APPLICATION} />
    </div>
  ),
};
