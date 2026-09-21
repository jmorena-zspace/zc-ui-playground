import type { Meta, StoryObj } from '@storybook/react';
import { faArrowRight, faExternalLink } from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { AnimatedTitle } from './animated-title';

const meta: Meta<typeof AnimatedTitle> = {
  title: 'Components/AnimatedTitle',
  component: AnimatedTitle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A title component with animated underline and icon on hover. Supports multiple heading levels and can respond to its own hover or an ancestor group hover (e.g., card hover). Features smooth transitions and customizable icons.',
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
type Story = StoryObj<typeof AnimatedTitle>;

export const Default: Story = {
  args: {
    children: 'Hover to see animation',
    showIcon: true,
    animated: true,
    as: 'h2',
  },
};

export const WithoutIcon: Story = {
  args: {
    children: 'Title without icon',
    showIcon: false,
    animated: true,
    as: 'h2',
  },
};

export const NotAnimated: Story = {
  args: {
    children: 'Static title',
    showIcon: false,
    animated: false,
    as: 'h2',
  },
};

export const CustomIcon: Story = {
  args: {
    children: 'Custom icon example',
    showIcon: true,
    icon: faExternalLink,
    animated: true,
    as: 'h2',
  },
};

export const AsHeading1: Story = {
  args: {
    children: 'H1 Heading',
    showIcon: true,
    animated: true,
    as: 'h1',
  },
};

export const AsParagraph: Story = {
  args: {
    children: 'Paragraph text',
    showIcon: true,
    animated: true,
    as: 'p',
  },
};

export const InCard: Story = {
  render: () => (
    <div className="group/card p-6 bg-bg-surface-subtle rounded-md hover:bg-bg-surface-hover">
      <AnimatedTitle hoverGroup="group/card" as="h3">
        Card title with animation
      </AnimatedTitle>
      <p className="text-body-md text-content-secondary mt-2">
        Hover over the card to see the title animate
      </p>
    </div>
  ),
};
