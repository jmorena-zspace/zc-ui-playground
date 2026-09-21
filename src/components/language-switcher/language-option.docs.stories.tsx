import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { LanguageOption } from './language-option';

const meta: Meta<typeof LanguageOption> = {
  title: 'Components/LanguageOption',
  component: LanguageOption,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A selectable language option for the language switcher. Displays flag icon, language name, and check icon for current language. Includes separator line after current language.',
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
type Story = StoryObj<typeof LanguageOption>;

export const Default: Story = {
  args: {
    language: {
      code: 'en-US',
      name: 'English (US)',
      flagIconUrl: 'https://via.placeholder.com/20',
    },
    isCurrentLanguage: false,
    onLanguageChange: fn(),
  },
};
