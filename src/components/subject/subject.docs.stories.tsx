import type { Meta, StoryObj } from '@storybook/react';
import { Subject } from './subject';

const meta: Meta<typeof Subject> = {
  title: 'Components/Subject',
  component: Subject,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A chip component for displaying subject tags. Shows subject icon and name in a compact, rounded pill format. Used to categorize lessons and content.',
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
type Story = StoryObj<typeof Subject>;

export const Default: Story = {
  args: {
    subject: {
      id: '1',
      name: 'Mathematics',
      iconUrl: 'https://via.placeholder.com/12',
    },
  },
};
