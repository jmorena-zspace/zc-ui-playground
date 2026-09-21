import type { Meta, StoryObj } from '@storybook/react';
import { LessonTable } from './lesson-table';

const meta: Meta<typeof LessonTable> = {
  title: 'Features/LessonTable',
  component: LessonTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A table component for displaying lessons with columns for name, subjects, and applications. Built on TanStack Table with clickable lesson names and app launcher buttons. Features hover effects and responsive column sizing.',
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
type Story = StoryObj<typeof LessonTable>;

export const Default: Story = {
  args: {
    data: [
      {
        id: '1',
        name: 'Introduction to Algebra',
        subjects: 'Mathematics',
        apps: [
          {
            id: '1',
            name: 'Khan Academy',
            iconUrl: 'https://via.placeholder.com/20',
            appLaunchCode: 'KA',
          },
        ],
      },
    ],
  },
};
