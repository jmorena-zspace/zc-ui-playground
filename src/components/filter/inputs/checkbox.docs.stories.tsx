import type { Meta, StoryObj } from '@storybook/react';
import { FilterCheckbox } from './checkbox';

const meta: Meta<typeof FilterCheckbox> = {
  title: 'Filter Components/FilterCheckbox',
  component: FilterCheckbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A custom checkbox input for filter selections. Features custom styling with checkmark indicator and label. Read-only with checked state controlled by parent.',
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
type Story = StoryObj<typeof FilterCheckbox>;

export const Default: Story = {
  args: {
    checked: false,
    label: 'Option Label',
  },
};
