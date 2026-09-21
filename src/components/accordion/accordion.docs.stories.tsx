import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A compound accordion component with expandable/collapsible content. Features smooth animations, chevron indicator, and flexible styling through className functions. Supports left or right arrow positioning.',
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
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion>
      <Accordion.Title className="p-4 bg-bg-surface-subtle hover:bg-bg-surface-hover rounded-t-md">
        <span className="text-body-md font-medium text-content-primary">
          Click to expand
        </span>
      </Accordion.Title>
      <Accordion.Content>
        <div className="p-4 bg-bg-surface-default">
          <p className="text-body-md text-content-secondary">
            This is the accordion content that can be toggled.
          </p>
        </div>
      </Accordion.Content>
    </Accordion>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <Accordion defaultOpen>
      <Accordion.Title className="p-4 bg-bg-surface-subtle hover:bg-bg-surface-hover rounded-md">
        <span className="text-body-md font-medium text-content-primary">
          Already expanded
        </span>
      </Accordion.Title>
      <Accordion.Content>
        <div className="p-4 bg-bg-surface-default">
          <p className="text-body-md text-content-secondary">
            This content is visible by default.
          </p>
        </div>
      </Accordion.Content>
    </Accordion>
  ),
};

export const LeftArrow: Story = {
  render: () => (
    <Accordion>
      <Accordion.Title
        className="p-4 bg-bg-surface-subtle hover:bg-bg-surface-hover rounded-md"
        arrowPosition="left"
      >
        <span className="text-body-md font-medium text-content-primary">
          Arrow on the left
        </span>
      </Accordion.Title>
      <Accordion.Content>
        <div className="p-4 bg-bg-surface-default">
          <p className="text-body-md text-content-secondary">
            Accordion with left-positioned arrow.
          </p>
        </div>
      </Accordion.Content>
    </Accordion>
  ),
};

export const WithBorder: Story = {
  render: () => (
    <Accordion className="border border-border-system-subtle rounded-md">
      <Accordion.Title
        className={(isOpen) =>
          `p-4 bg-bg-surface-subtle hover:bg-bg-surface-hover ${
            isOpen ? 'rounded-t-md border-b border-border-system-subtle' : 'rounded-md'
          }`
        }
      >
        <span className="text-body-md font-medium text-content-primary">
          Styled with border
        </span>
      </Accordion.Title>
      <Accordion.Content>
        <div className="p-4">
          <p className="text-body-md text-content-secondary">
            Accordion with border and conditional styling.
          </p>
        </div>
      </Accordion.Content>
    </Accordion>
  ),
};
