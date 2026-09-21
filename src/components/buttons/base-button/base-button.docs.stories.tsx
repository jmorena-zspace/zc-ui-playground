import type { Meta, StoryObj } from '@storybook/react';
import {
  faArrowRight,
  faDownload,
  faRocket,
} from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BaseButton } from './base-button';

const meta: Meta<typeof BaseButton> = {
  title: 'Buttons/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The foundational button component used throughout the application. Supports multiple colors, sizes, icons, and states. Can be used standalone or as a base for specialized button components.',
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
type Story = StoryObj<typeof BaseButton>;

export const Default: Story = {
  args: {
    children: 'Button',
    color: 'primary',
    size: 'md',
  },
};

export const Primary: Story = {
  args: {
    children: 'Button',
    color: 'primary',
    size: 'sm',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    color: 'secondary',
    size: 'sm',
  },
};

export const Filter: Story = {
  args: {
    children: 'Filter',
    color: 'filter',
    size: 'sm',
  },
};

export const FilterActive: Story = {
  args: {
    children: 'Filter',
    color: 'filter',
    size: 'sm',
    active: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Button',
    color: 'primary',
    size: 'sm',
    disabled: true,
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: 'Launch',
    color: 'primary',
    size: 'md',
    leftIcon: <FontAwesomeIcon icon={faRocket} />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Next',
    color: 'primary',
    size: 'md',
    rightIcon: <FontAwesomeIcon icon={faArrowRight} />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Download',
    color: 'primary',
    size: 'md',
    leftIcon: <FontAwesomeIcon icon={faDownload} />,
    rightIcon: <FontAwesomeIcon icon={faArrowRight} />,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <BaseButton key={size} size={size}>
          {size.toUpperCase()}
        </BaseButton>
      ))}
    </div>
  ),
};
