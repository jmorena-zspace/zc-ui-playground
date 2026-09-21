import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { SubjectCard } from './subject-card';

const meta: Meta<typeof SubjectCard> = {
  title: 'Cards/SubjectCard',
  component: SubjectCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A card component for displaying subject categories. Shows subject icon and name with hover effects. Responsive layout adapts between mobile (horizontal) and desktop (vertical) orientations.',
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
type Story = StoryObj<typeof SubjectCard>;

export const Default: Story = {
  args: {
    subject: {
      id: '1',
      name: 'Mathematics',
      iconUrl: 'https://via.placeholder.com/64',
    },
    onClick: fn(),
  },
};
