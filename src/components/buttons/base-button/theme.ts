import clsx from 'clsx';

export const theme = {
  base: clsx(
    'inline-flex items-center justify-center',
    'font-body font-medium rounded-full',
    'cursor-pointer transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ),
  size: {
    xs: 'text-body-sm px-sm py-xs gap-xs',
    sm: 'text-body-md px-sm py-xs gap-xs',
    md: 'text-body-md px-sm py-sm gap-xs',
    lg: 'text-body-lg px-lg py-sm gap-xs',
    xl: 'text-body-lg px-lg py-md gap-xs',
  },
  color: (active: boolean) => ({
    primary: clsx(
      'bg-bg-action-primary-default text-content-action-on-primary-default',
      'hover:bg-bg-action-primary-hover',
      'focus:ring-2 focus:ring-inset focus:ring-border-action-primary-focused',
      { 'bg-bg-action-primary-hover': active }
    ),
    secondary: clsx(
      'bg-bg-action-secondary-default text-content-action-on-secondary-default',
      'ring-1 ring-inset ring-border-action-secondary-default',
      'hover:bg-bg-action-secondary-hover',
      'focus:ring-2 focus:ring-border-action-secondary-focused',
      { 'bg-bg-action-secondary-pressed': active }
    ),
    filter: clsx(
      'bg-bg-action-secondary-default text-content-action-on-secondary-default',
      'ring-1 ring-inset ring-border-action-secondary-default',
      'hover:bg-bg-action-secondary-hover hover:ring-0 hover:text-content-action-on-secondary-inverse',
      'focus:ring-2 focus:ring-border-action-secondary-focused',
      {
        'bg-bg-action-secondary-pressed ring-0 text-content-action-on-secondary-inverse':
          active,
      }
    ),
  }),
};
