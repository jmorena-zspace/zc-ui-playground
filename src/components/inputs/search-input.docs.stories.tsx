import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { SearchInput } from './search-input';

const meta: Meta<typeof SearchInput> = {
  title: 'Inputs/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A search input component with icon, loading state, and error handling. Supports primary and secondary variants for different surfaces. Includes ESC key hint display.',
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
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    value: '',
    variant: 'primary',
    isLoading: false,
    showEscHint: false,
    onChange: fn(),
  },
};

export const Primary: Story = {
  args: {
    value: '',
    variant: 'primary',
    onChange: fn(),
  },
};

export const Secondary: Story = {
  args: {
    value: '',
    variant: 'secondary',
    onChange: fn(),
  },
};

export const WithValue: Story = {
  args: {
    value: 'Search query',
    variant: 'primary',
    onChange: fn(),
  },
};

export const Loading: Story = {
  args: {
    value: 'Loading...',
    variant: 'primary',
    isLoading: true,
    onChange: fn(),
  },
};

export const WithEscHint: Story = {
  args: {
    value: 'Search with ESC hint',
    variant: 'primary',
    showEscHint: true,
    onChange: fn(),
  },
};

export const WithError: Story = {
  args: {
    value: 'ab',
    variant: 'primary',
    errorMessage: 'Please enter at least 3 characters',
    onChange: fn(),
  },
};

export const LoadingWithEscHint: Story = {
  args: {
    value: 'Searching...',
    variant: 'primary',
    isLoading: true,
    showEscHint: true,
    onChange: fn(),
  },
};
