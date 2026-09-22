import { AnimatedTitle } from '@components/animated-title';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/ui/tooltip';
import { useTruncatedTooltip } from '@hooks/truncated-tooltip';
import { RecentlyLaunchedApp } from '@zcentral-v2/types';
import clsx from 'clsx';
import { FC, useCallback } from 'react';

type RecentlyLaunchedAppItemProps = {
  app: RecentlyLaunchedApp;
  onLaunch: (app: RecentlyLaunchedApp) => void;
};

export const RecentlyLaunchedAppItem: FC<RecentlyLaunchedAppItemProps> = ({
  app,
  onLaunch,
}) => {
  const { ref, tooltipOpen, onMouseEnter, onOpenChange } =
    useTruncatedTooltip();

  const handleClick = useCallback(() => {
    onLaunch(app);
  }, [app, onLaunch]);

  return (
    <Tooltip open={tooltipOpen} onOpenChange={onOpenChange}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`Launch ${app.name}`}
          onClick={handleClick}
          onMouseEnter={onMouseEnter}
          className={clsx(
            'group flex w-[128px] shrink-0',
            'cursor-pointer flex-col items-center gap-xs rounded-sm',
            'active:opacity-70 transition-opacity duration-150',
            'outline-offset-4 focus:outline-2 focus:outline-border-action-primary-focused'
          )}
        >
          <div className="flex items-center rounded-full bg-bg-surface-default p-xs">
            {app.iconUrl && (
              <img
                src={app.iconUrl}
                alt={app.name}
                className="size-8 object-contain"
              />
            )}
          </div>
          <div
            ref={ref}
            className="line-clamp-3 min-w-full text-center text-content-on-brand-default"
          >
            <AnimatedTitle
              showIcon={false}
              as="span"
              underlineColorClassName="animated-underline-on-brand"
              className="font-body text-body-sm font-regular text-content-on-brand-default"
            >
              {app.name}
            </AnimatedTitle>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        sideOffset={4}
        className="text-content-primary text-body-sm font-medium"
      >
        {app.name}
      </TooltipContent>
    </Tooltip>
  );
};
