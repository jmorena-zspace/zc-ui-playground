import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@shared/utils';
import { Select as SelectPrimitive } from 'radix-ui';
import * as React from 'react';

const SelectContext = React.createContext({ exiting: false });

const ANIMATION_DURATION = 150;

function Select({
  onOpenChange,
  ...props
}: Omit<
  React.ComponentProps<typeof SelectPrimitive.Root>,
  'open' | 'defaultOpen'
>) {
  const [open, setOpen] = React.useState(false);
  const [exiting, setExiting] = React.useState(false);
  const exitTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (exitTimeout.current) clearTimeout(exitTimeout.current);
    };
  }, []);

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (newOpen) {
        if (exitTimeout.current) clearTimeout(exitTimeout.current);
        setExiting(false);
        setOpen(true);
        onOpenChange?.(true);
      } else {
        setExiting(true);
        onOpenChange?.(false);
        exitTimeout.current = setTimeout(() => {
          setOpen(false);
          setExiting(false);
        }, ANIMATION_DURATION);
      }
    },
    [onOpenChange]
  );

  return (
    <SelectContext.Provider value={{ exiting }}>
      <SelectPrimitive.Root
        {...props}
        data-slot="select"
        open={open}
        onOpenChange={handleOpenChange}
      />
    </SelectContext.Provider>
  );
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default';
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        'flex w-fit items-center justify-between gap-2',
        'rounded-sm bg-bg-action-secondary-default px-2.5 py-2',
        'text-body-md text-content-action-on-secondary-default',
        'whitespace-nowrap cursor-pointer transition-all outline-none',
        'ring-1 ring-inset ring-border-action-secondary-default',
        'hover:bg-bg-action-secondary-hover hover:ring-0 hover:text-content-action-on-secondary-inverse',
        'focus-visible:ring-2 focus-visible:ring-border-action-secondary-focused',
        'data-[state=open]:bg-bg-action-secondary-pressed data-[state=open]:ring-0 data-[state=open]:text-content-action-on-secondary-inverse',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[size=default]:h-9 data-[size=sm]:h-8',
        '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-3 w-3 transition-transform duration-200 ease-in-out in-data-[state=open]:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const { exiting } = React.useContext(SelectContext);

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          'relative z-50 min-w-32',
          'max-h-(--radix-select-content-available-height)',
          'overflow-x-hidden overflow-y-auto',
          'rounded-sm border border-border-system-subtle',
          'bg-bg-surface-default text-content-secondary shadow-md',
          'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
          'origin-bottom will-change-[transform,opacity]',
          {
            'animate-dropdown-fade-out-bottom': exiting,
            'animate-dropdown-fade-in-bottom': !exiting,
          },
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn('p-1', {
            'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1':
              position === 'popper',
          })}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        'px-2 py-1.5 text-body-sm text-content-tertiary',
        className
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-pointer items-center gap-2',
        'rounded-sm py-1.5 pr-8 pl-2 text-body-md',
        'outline-hidden select-none',
        'focus:bg-bg-surface-hover',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        '*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 flex size-3.5 items-center justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <Check className="h-3 w-3 " />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        'pointer-events-none -mx-1 my-1 h-px bg-border-system-subtle',
        className
      )}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1 bg-bg-surface-default',
        className
      )}
      {...props}
    >
      <ChevronUp className="h-3 w-3 " />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1 bg-bg-surface-default',
        className
      )}
      {...props}
    >
      <ChevronDown className="h-3 w-3 " />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
