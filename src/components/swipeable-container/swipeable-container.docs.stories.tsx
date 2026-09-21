import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { SwipeableContainer } from './swipeable-container';

const meta: Meta<typeof SwipeableContainer> = {
  title: 'Layout/SwipeableContainer',
  component: SwipeableContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A container that detects horizontal swipe gestures on touch devices. Triggers callbacks when user swipes left or right beyond a threshold (120px). Useful for mobile navigation patterns.',
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
type Story = StoryObj<typeof SwipeableContainer>;

export const Default: Story = {
  args: {
    onSwipeLeft: fn(),
    onSwipeRight: fn(),
    children: <div className="p-8 bg-bg-surface-subtle">Swipe me left or right</div>,
  },
};
