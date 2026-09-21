import type { Meta, StoryObj } from '@storybook/react';
import { CollectionCard } from './collection-card';

const meta: Meta<typeof CollectionCard> = {
  title: 'Cards/CollectionCard',
  component: CollectionCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An accordion-style card for displaying collections of lessons. Shows collection title, lesson count, and expandable content area. Built on the Accordion component.',
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
type Story = StoryObj<typeof CollectionCard>;

export const Default: Story = {
  args: {
    title: 'Collection Title',
    lessonsCount: 5,
    children: <div className="p-4">Collection content goes here</div>,
  },
};
