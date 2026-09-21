import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { PageButton } from './page-button';

const meta: Meta<typeof PageButton> = {
  title: 'Pagination Components/PageButton',
  component: PageButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A button for selecting a specific page in pagination. Highlights the current page with active styling and bold font. Includes aria-current attribute for accessibility.',
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
type Story = StoryObj<typeof PageButton>;

export const Default: Story = {
  args: {
    isCurrentPage: false,
    onClick: fn(),
    children: '1',
  },
};
