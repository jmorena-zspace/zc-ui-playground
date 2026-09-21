import { Popover as PopoverPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@shared/utils';

const PopoverContext = React.createContext<{
  open: boolean;
  exiting: boolean;
  close: () => void;
  onExitComplete: () => void;
} | null>(null);

function Popover({
  onOpenChange,
  ...props
}: Omit<
  React.ComponentProps<typeof PopoverPrimitive.Root>,
  'open' | 'defaultOpen'
>) {
  const [open, setOpen] = React.useState(false);
  const [exiting, setExiting] = React.useState(false);
  const exitingRef = React.useRef(false);

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (newOpen) {
        exitingRef.current = false;
        setExiting(false);
        setOpen(true);
        onOpenChange?.(true);
      } else if (!exitingRef.current) {
        exitingRef.current = true;
        setExiting(true);
        onOpenChange?.(false);
      }
    },
    [onOpenChange]
  );

  const close = React.useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  const onExitComplete = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <PopoverContext.Provider value={{ open, exiting, close, onExitComplete }}>
      <PopoverPrimitive.Root
        {...props}
        open={open}
        onOpenChange={handleOpenChange}
      />
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = 'start',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const ctx = React.useContext(PopoverContext);
  const exiting = ctx?.exiting ?? false;
  const onExitComplete = ctx?.onExitComplete;

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        onAnimationEnd={(e) => {
          if (exiting && e.currentTarget === e.target) {
            onExitComplete?.();
          }
        }}
        className={cn(
          'z-50 w-max max-w-72 flex flex-col',
          'overflow-hidden rounded-sm',
          'border border-border-system-subtle',
          'bg-bg-surface-default shadow-md',
          'outline-none origin-top will-change-[transform,opacity]',
          {
            'animate-dropdown-fade-out': exiting,
            'animate-dropdown-fade-in': !exiting,
          },
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

function usePopoverContext() {
  return React.useContext(PopoverContext);
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverContext,
  PopoverTrigger,
  usePopoverContext,
};
