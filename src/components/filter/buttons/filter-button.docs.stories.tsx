import type { Meta, StoryObj } from '@storybook/react';
import { FilterButton } from './filter-button';

const meta: Meta<typeof FilterButton> = {
  title: 'Filter Components/FilterButton',
  component: FilterButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A specialized button for filter controls. Built on BaseButton with filter color variant and extra-small size. Includes dropdown trigger data attribute.',
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
type Story = StoryObj<typeof FilterButton>;

export const Default: Story = {
  args: {
    children: 'Filter',
  },
};
