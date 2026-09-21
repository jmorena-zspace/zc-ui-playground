import clsx from 'clsx';

export type SearchVariant = 'primary' | 'secondary';

export const searchInputTheme = {
  base: clsx(
    'group w-full border transition-all'
  ),
  inner: clsx(
    'flex items-center px-md gap-xs'
  ),
  icon: clsx(
    'pointer-events-none shrink-0 h-4 w-4 transition-colors'
  ),
  input: clsx(
    'input flex-1 min-w-0 h-full py-xxs border-none outline-none bg-transparent',
    'overflow-hidden whitespace-nowrap text-ellipsis text-body-md font-regular'
  ),
  error: clsx(
    'hidden md:block text-body-md italic font-regular'
  ),
  variant: {
    primary: {
      container: clsx(
        'rounded-md bg-bg-surface-subtle',
        'border-border-system-strong focus-within:border-violet-400'
      ),
      inner: 'h-9',
      icon: 'text-content-placeholder group-focus-within:text-violet-500',
      input: 'text-content-primary placeholder:text-content-tertiary',
      error: 'text-content-primary',
      escHint: 'text-content-tertiary bg-bg-surface-subtle border-border-system-subtle',
    },
    secondary: {
      container: clsx(
        'rounded-lg bg-bg-overlay-light-medium',
        'border-border-action-secondary-default'
      ),
      inner: 'h-[34px]',
      icon: 'text-content-action-on-primary-default',
      input: 'text-content-action-on-primary-default placeholder:text-content-action-on-primary-default',
      error: 'text-content-action-on-primary-default',
      escHint: 'text-content-action-on-primary-default border-border-action-secondary-default',
    },
  },
};
