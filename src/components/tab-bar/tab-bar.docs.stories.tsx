import type { Meta, StoryObj } from '@storybook/react';
import {
  faBook,
  faHome,
  faRocket,
  faSearch,
} from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import {
  faBook as faBookRegular,
  faHome as faHomeRegular,
} from '@awesome.me/kit-935ddc1468/icons/classic/regular';
import { TabBar } from './tab-bar';

const meta: Meta<typeof TabBar> = {
  title: 'Layout/TabBar',
  component: TabBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A tab navigation component with animated active indicator. Integrates with TanStack Router for navigation. Supports optional active icon variants and smooth transitions between tabs.',
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
type Story = StoryObj<typeof TabBar>;

export const Default: Story = {
  args: {
    tabs: [
      { label: 'Home', to: '/', icon: faHome },
      { label: 'Search', to: '/search', icon: faSearch },
    ],
    'aria-label': 'Main navigation',
  },
};

export const TwoTabs: Story = {
  args: {
    tabs: [
      { label: 'Home', to: '/', icon: faHome },
      { label: 'Search', to: '/search', icon: faSearch },
    ],
  },
};

export const ThreeTabs: Story = {
  args: {
    tabs: [
      { label: 'Home', to: '/', icon: faHome },
      { label: 'Lessons', to: '/lessons', icon: faBook },
      { label: 'Applications', to: '/applications', icon: faRocket },
    ],
  },
};

export const WithActiveIcons: Story = {
  args: {
    tabs: [
      { label: 'Home', to: '/', icon: faHomeRegular, activeIcon: faHome },
      { label: 'Lessons', to: '/lessons', icon: faBookRegular, activeIcon: faBook },
    ],
  },
};

export const LongLabels: Story = {
  args: {
    tabs: [
      { label: 'Dashboard Overview', to: '/', icon: faHome },
      { label: 'Search Content', to: '/search', icon: faSearch },
      { label: 'My Applications', to: '/applications', icon: faRocket },
    ],
  },
};
