import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { SearchInput } from '@components/inputs';
import { QuickResults } from '@components/quick-results';
import { BlurredModal } from './blurred-modal';
import { andOrCircuits, franklinsLab, bioDigitalHuman } from '@fixtures/content-items';
import { useState } from 'react';

const QUICK_RESULTS_VIEWPORT_PADDING = 40;

const mockResults = [andOrCircuits, franklinsLab, bioDigitalHuman];

function MockGlobalSearchModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    if (value.length > 0) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim().length > 0) {
      fn()();
    }
  };

  const showResults = search.length >= 3;
  const resultsHaveHits = showResults && mockResults.length > 0;

  return (
    <BlurredModal show={show} onClose={onClose} size="2xl">
      <div className="relative flex flex-col w-full gap-sm">
        <SearchInput
          isLoading={isLoading}
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          showEscHint
        />
        <QuickResults
          boundary="viewport"
          offset={QUICK_RESULTS_VIEWPORT_PADDING}
          showResults={showResults}
          resultsHaveHits={resultsHaveHits}
          results={resultsHaveHits ? mockResults : []}
          total={mockResults.length}
          search={search}
          onViewAllSearchResults={fn()}
          onLessonClick={fn()}
        />
      </div>
    </BlurredModal>
  );
}

const meta: Meta<typeof MockGlobalSearchModal> = {
  title: 'Modals/GlobalSearchModal',
  component: MockGlobalSearchModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The global search modal triggered by Cmd+K/Ctrl+K. Combines SearchInput with QuickResults to provide instant search feedback. Navigates to full search page on Enter or "View All" action. Type at least 3 characters to see results.',
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
type Story = StoryObj<typeof MockGlobalSearchModal>;

export const Default: Story = {
  args: {
    show: true,
    onClose: fn(),
  },
};

function InteractiveStory(args: React.ComponentProps<typeof BlurredModal>) {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length > 0) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const showResults = search.length >= 3;
  const resultsHaveHits = showResults && mockResults.length > 0;

  return (
    <BlurredModal show={args.show} onClose={args.onClose} size="2xl">
      <div className="relative flex flex-col w-full gap-sm">
        <SearchInput
          isLoading={isLoading}
          value={search}
          onChange={handleSearchChange}
          onKeyDown={fn()}
          showEscHint
        />
        <QuickResults
          boundary="viewport"
          offset={QUICK_RESULTS_VIEWPORT_PADDING}
          showResults={showResults}
          resultsHaveHits={resultsHaveHits}
          results={resultsHaveHits ? mockResults : []}
          total={mockResults.length}
          search={search}
          onViewAllSearchResults={fn()}
          onLessonClick={fn()}
        />
      </div>
    </BlurredModal>
  );
}

export const Interactive: Story = {
  args: {
    show: true,
    onClose: fn(),
  },
  render: (args) => <InteractiveStory {...args} />,
};

function WithResultsStory(args: React.ComponentProps<typeof BlurredModal>) {
  const [search] = useState('science');

  return (
    <BlurredModal show={args.show} onClose={args.onClose} size="2xl">
        <div className="relative flex flex-col w-full gap-sm">
          <SearchInput
            isLoading={false}
            value={search}
            onChange={fn()}
            onKeyDown={fn()}
            showEscHint
          />
          <QuickResults
            boundary="viewport"
            offset={QUICK_RESULTS_VIEWPORT_PADDING}
            showResults={true}
            resultsHaveHits={true}
            results={mockResults}
            total={mockResults.length}
            search={search}
            onViewAllSearchResults={fn()}
            onLessonClick={fn()}
          />
        </div>
      </BlurredModal>
  );
}

export const WithResults: Story = {
  args: {
    show: true,
    onClose: fn(),
  },
  render: (args) => <WithResultsStory {...args} />,
};
