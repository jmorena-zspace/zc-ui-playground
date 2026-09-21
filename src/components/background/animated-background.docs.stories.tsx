import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedBackground } from './animated-background';

const meta: Meta<typeof AnimatedBackground> = {
  title: 'Layout/AnimatedBackground',
  component: AnimatedBackground,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An animated background component featuring floating particles and animated gradient blobs. Creates a dynamic, visually appealing backdrop with grid overlay and noise texture. Optimized for performance with requestAnimationFrame and visibility detection.',
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
type Story = StoryObj<typeof AnimatedBackground>;

export const Default: Story = {};
