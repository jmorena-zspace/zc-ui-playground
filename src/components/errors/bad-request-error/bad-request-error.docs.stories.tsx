import type { Meta, StoryObj } from '@storybook/react';
import { BadRequestError } from './bad-request-error';

const meta: Meta<typeof BadRequestError> = {
  title: 'Errors/BadRequestError',
  component: BadRequestError,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A 400 error display component showing bad request messaging. Features centered layout with large heading and descriptive text.',
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
type Story = StoryObj<typeof BadRequestError>;

export const Default: Story = {};
