import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { andOrCircuits, franklinsLab, bioDigitalHuman } from '@fixtures/content-items';
import { QuickResults } from './quick-results';

const mockResults = [andOrCircuits, franklinsLab, bioDigitalHuman];

const meta: Meta<typeof QuickResults> = {
  title: 'Features/QuickResults',
  component: QuickResults,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A dropdown component showing quick search results with glassmorphism effect. Displays results in a scrollable list, "View All" button, and handles empty states. Automatically fits to viewport with configurable boundary and offset.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-[1280px] px-4">
          <div className="relative">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof QuickResults>;

export const Default: Story = {
  args: {
    showResults: true,
    resultsHaveHits: true,
    results: mockResults,
    total: 10,
    search: 'science',
    onViewAllSearchResults: fn(),
    onLessonClick: fn(),
    inline: false,
    transparent: false,
  },
};

export const NoResults: Story = {
  args: {
    showResults: true,
    resultsHaveHits: false,
    results: [],
    total: 0,
    search: 'xyz123notfound',
    onViewAllSearchResults: fn(),
    onLessonClick: fn(),
    inline: false,
    transparent: false,
  },
};

export const InlineVariant: Story = {
  args: {
    showResults: true,
    resultsHaveHits: true,
    results: mockResults,
    total: 15,
    search: 'circuits',
    onViewAllSearchResults: fn(),
    onLessonClick: fn(),
    inline: true,
    transparent: false,
  },
};

export const TransparentVariant: Story = {
  args: {
    showResults: true,
    resultsHaveHits: true,
    results: mockResults,
    total: 8,
    search: 'lab',
    onViewAllSearchResults: fn(),
    onLessonClick: fn(),
    inline: false,
    transparent: true,
  },
};
