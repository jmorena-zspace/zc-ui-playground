import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { FilterQueryInput } from './query-input';

const meta: Meta<typeof FilterQueryInput> = {
  title: 'Filter Components/FilterQueryInput',
  component: FilterQueryInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A search input for filtering options within the filter modal. Features magnifying glass icon, clear button when value exists, and keyboard event handling to prevent conflicts with parent components.',
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
type Story = StoryObj<typeof FilterQueryInput>;

export const Default: Story = {
  args: {
    value: '',
    onChange: fn(),
    onClear: fn(),
  },
};
