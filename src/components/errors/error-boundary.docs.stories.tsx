import type { Meta, StoryObj } from '@storybook/react';
import { AppErrorType } from '@shared/types';
import { ErrorBoundary } from './error-boundary';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Errors/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A centralized error boundary component that handles different error types (Unauthorized, Forbidden, Not Found, Bad Request, Internal Server Error). Transforms Axios errors and routes to appropriate error display components.',
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
type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {
  args: {
    error: {
      type: AppErrorType.NOT_FOUND,
      message: 'Resource not found',
    },
  },
};
