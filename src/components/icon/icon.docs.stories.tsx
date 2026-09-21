import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A flexible icon component that displays either an image icon or a placeholder circle. Automatically falls back to placeholder when no source is provided. Useful for subject and category icons.',
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
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    src: 'https://via.placeholder.com/64',
    alt: 'Example Icon',
    width: 64,
    height: 64,
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://via.placeholder.com/64',
    alt: 'Example Icon',
    width: 64,
    height: 64,
  },
};

export const Placeholder: Story = {
  args: {
    src: null,
    alt: 'Placeholder',
    width: 64,
    height: 64,
  },
};

export const Small: Story = {
  args: {
    src: 'https://via.placeholder.com/32',
    alt: 'Small Icon',
    width: 32,
    height: 32,
  },
};

export const Large: Story = {
  args: {
    src: 'https://via.placeholder.com/96',
    alt: 'Large Icon',
    width: 96,
    height: 96,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      <Icon src="https://via.placeholder.com/16" alt="16px" width={16} height={16} />
      <Icon src="https://via.placeholder.com/32" alt="32px" width={32} height={32} />
      <Icon src="https://via.placeholder.com/64" alt="64px" width={64} height={64} />
      <Icon src="https://via.placeholder.com/96" alt="96px" width={96} height={96} />
    </div>
  ),
};
