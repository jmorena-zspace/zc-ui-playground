import type { Meta, StoryObj } from '@storybook/react';
import { ForbiddenError } from './forbidden-error';

const meta: Meta<typeof ForbiddenError> = {
  title: 'Errors/ForbiddenError',
  component: ForbiddenError,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A 403 error display component showing forbidden access messaging. Displays detailed error message in development mode only. Features centered layout with large heading.',
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
type Story = StoryObj<typeof ForbiddenError>;

export const Default: Story = {
  args: {
    message: 'You do not have permission to access this resource',
  },
};
