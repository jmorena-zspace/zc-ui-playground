import type { Meta, StoryObj } from '@storybook/react';
import { FilterDropdown } from './dropdown';

const FilterDropdownExample = () => (
  <FilterDropdown
    renderTrigger={(isOpen) => (
      <button className="px-4 py-2 bg-bg-action-secondary-default rounded-sm">
        Dropdown {isOpen ? '▲' : '▼'}
      </button>
    )}
    fixedSection={<button className="text-body-sm">Clear</button>}
  >
    <FilterDropdown.Item onClick={() => { /* noop */ }}>
      <span>Option 1</span>
    </FilterDropdown.Item>
    <FilterDropdown.Item onClick={() => { /* noop */ }}>
      <span>Option 2</span>
    </FilterDropdown.Item>
  </FilterDropdown>
);

const meta: Meta<typeof FilterDropdown> = {
  title: 'Filter Components/FilterDropdown',
  component: FilterDropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A compound dropdown component for filter options. Built on Popover with custom trigger rendering, scrollable content area, and optional fixed footer section. Includes FilterDropdown.Item and FilterDropdown.Section sub-components.',
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
type Story = StoryObj<typeof FilterDropdown>;

export const Default: Story = {
  render: () => <FilterDropdownExample />,
};
