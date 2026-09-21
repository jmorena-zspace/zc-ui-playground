import { Tooltip as TooltipPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@shared/utils';

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

const ARROW_OFFSET = 4;

function TooltipContent({
  className,
  sideOffset = 4,
  arrow = true,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  arrow?: boolean;
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={arrow ? sideOffset + ARROW_OFFSET : sideOffset}
        className={cn(
          'group/tooltip z-50 w-fit overflow-visible rounded-xs border border-border-system-subtle bg-bg-surface-default px-xs py-xs font-body text-body-sm font-medium text-content-primary shadow-lg animate-tooltip-in data-[state=closed]:animate-tooltip-out',
          className
        )}
        {...props}
      >
        {children}
        {arrow && (
          <span
            aria-hidden
            className={cn(
              'absolute size-xs rotate-45 border-border-system-subtle bg-bg-surface-default',
              'group-data-[side=bottom]/tooltip:left-1/2 group-data-[side=bottom]/tooltip:-top-xxs group-data-[side=bottom]/tooltip:-translate-x-1/2 group-data-[side=bottom]/tooltip:border-l group-data-[side=bottom]/tooltip:border-t',
              'group-data-[side=top]/tooltip:left-1/2 group-data-[side=top]/tooltip:-bottom-xxs group-data-[side=top]/tooltip:-translate-x-1/2 group-data-[side=top]/tooltip:border-b group-data-[side=top]/tooltip:border-r',
              'group-data-[side=left]/tooltip:top-1/2 group-data-[side=left]/tooltip:-right-xxs group-data-[side=left]/tooltip:-translate-y-1/2 group-data-[side=left]/tooltip:border-r group-data-[side=left]/tooltip:border-t',
              'group-data-[side=right]/tooltip:top-1/2 group-data-[side=right]/tooltip:-left-xxs group-data-[side=right]/tooltip:-translate-y-1/2 group-data-[side=right]/tooltip:border-b group-data-[side=right]/tooltip:border-l'
            )}
          />
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
