import type { Meta, StoryObj } from '@storybook/react';
import { NotFoundError } from './not-found-error';

const meta: Meta<typeof NotFoundError> = {
  title: 'Errors/NotFoundError',
  component: NotFoundError,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A 404 error display component showing localized "Not Found" messaging. Features centered layout with large heading and descriptive text.',
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
type Story = StoryObj<typeof NotFoundError>;

export const Default: Story = {};
