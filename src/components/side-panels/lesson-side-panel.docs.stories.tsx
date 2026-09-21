import type { Meta, StoryObj } from '@storybook/react';
import { LessonSidePanel } from './lesson-side-panel';

const meta: Meta<typeof LessonSidePanel> = {
  title: 'Features/LessonSidePanel',
  component: LessonSidePanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A slide-in side panel for displaying lesson details. Fetches lesson data based on URL query parameter, shows lesson image, title, subjects, description, files, and launch buttons. Features smooth slide animations and loading/error states.',
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
type Story = StoryObj<typeof LessonSidePanel>;

export const Default: Story = {};
