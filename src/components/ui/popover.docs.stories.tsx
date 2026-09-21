import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const PopoverExample = () => (
  <Popover>
    <PopoverTrigger className="px-4 py-2 bg-bg-action-primary-default text-content-action-on-primary-default rounded-sm">
      Open Popover
    </PopoverTrigger>
    <PopoverContent>
      <div className="p-4">
        <p className="text-body-md text-content-primary">Popover content</p>
      </div>
    </PopoverContent>
  </Popover>
);

const meta: Meta<typeof Popover> = {
  title: 'UI Primitives/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A popover component built on Radix UI with custom animations. Used for displaying floating content anchored to a trigger element.',
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
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => <PopoverExample />,
};
