import type { Meta, StoryObj } from '@storybook/react';
import { LessonFileCard } from './lesson-file-card';

const meta: Meta<typeof LessonFileCard> = {
  title: 'Cards/LessonFileCard',
  component: LessonFileCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A compact card for displaying lesson file attachments. Shows file name and download options. Supports Google Drive files with multiple export formats (Drive, Word, PDF) and direct PDF downloads.',
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
type Story = StoryObj<typeof LessonFileCard>;

export const Default: Story = {
  args: {
    name: 'Lesson Document.pdf',
    link: {
      url: 'https://example.com/file.pdf',
    },
  },
};
