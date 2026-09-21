import type { Meta, StoryObj } from '@storybook/react';
import { UnauthorizedError } from './unauthorized-error';

const meta: Meta<typeof UnauthorizedError> = {
  title: 'Errors/UnauthorizedError',
  component: UnauthorizedError,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A 401 error display component that handles authentication errors. Routes to RedirectToLogin when authUrl is provided, NotAllowedDomain when domain is not allowed, or shows generic auth error otherwise.',
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
type Story = StoryObj<typeof UnauthorizedError>;

export const Default: Story = {
  args: {
    authUrl: undefined,
    isNotAllowedDomain: false,
  },
};
