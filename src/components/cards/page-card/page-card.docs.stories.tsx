import type { Meta, StoryObj } from '@storybook/react';
import { PageCard } from './page-card';

const meta: Meta<typeof PageCard> = {
  title: 'Cards/PageCard',
  component: PageCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A simple container card component for page content. Provides consistent padding, background, border, and border radius for page-level content sections.',
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
type Story = StoryObj<typeof PageCard>;

export const Default: Story = {
  args: {
    children: <div>Page content goes here</div>,
  },
};
