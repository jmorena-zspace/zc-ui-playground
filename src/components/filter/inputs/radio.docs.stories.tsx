import type { Meta, StoryObj } from '@storybook/react';
import { FilterRadio } from './radio';

const meta: Meta<typeof FilterRadio> = {
  title: 'Filter Components/FilterRadio',
  component: FilterRadio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A custom radio input for filter selections. Features custom styling with circular indicator and label. Read-only with checked state controlled by parent.',
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
type Story = StoryObj<typeof FilterRadio>;

export const Default: Story = {
  args: {
    checked: false,
    label: 'Option Label',
    name: 'filter-option',
  },
};
