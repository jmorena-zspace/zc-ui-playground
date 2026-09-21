import {
  faArrowRight,
  faDownload,
  faRocket,
  faSearch,
} from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Meta, StoryObj } from '@storybook/react';
import { BaseButton } from './base-button';

const iconMap = {
  none: undefined,
  rocket: <FontAwesomeIcon icon={faRocket} />,
  arrowRight: <FontAwesomeIcon icon={faArrowRight} />,
  download: <FontAwesomeIcon icon={faDownload} />,
  search: <FontAwesomeIcon icon={faSearch} />,
};

const iconOptions = Object.keys(iconMap);

const meta: Meta<typeof BaseButton> = {
  title: 'Components/BaseButton',
  component: BaseButton,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'filter'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    fullSized: { control: 'boolean' },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    leftIcon: {
      control: 'select',
      options: iconOptions,
      mapping: iconMap,
    },
    rightIcon: {
      control: 'select',
      options: iconOptions,
      mapping: iconMap,
    },
  },
};

export default meta;
type Story = StoryObj<typeof BaseButton>;

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
