import { faGlobe } from '@awesome.me/kit-935ddc1468/icons/classic/regular';
import {
  faArrowUpRightFromSquare,
  faLaptop,
} from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { AnimatedTitle } from '@components/animated-title';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/ui/tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTruncatedTooltip } from '@hooks/truncated-tooltip';
import { ContentItem, ContentPlatform } from '@zcentral-v2/types';
import clsx from 'clsx';
import { FC, FocusEvent, KeyboardEvent, useCallback } from 'react';

type ApplicationLauncherCardProps = {
  application: ContentItem;
  disabled?: boolean;
  onLaunch?: () => void;
  className?: string;
  hidden?: boolean;
};

export const ApplicationLauncherCard: FC<ApplicationLauncherCardProps> = ({
  application,
  disabled = false,
  onLaunch,
  className,
  hidden = false,
}) => {
  const { name, iconUrl, platform } = application;
  const { ref, tooltipOpen, onMouseEnter, onOpenChange } =
    useTruncatedTooltip();

  const isWeb = platform === ContentPlatform.WEB;
  const isLaunchable = !disabled && !!onLaunch;

  const handleFocus = useCallback(
    (e: FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        onOpenChange(true);
      }
    },
    [onOpenChange]
  );

  const handleBlur = useCallback(
    (e: FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        onOpenChange(false);
      }
    },
    [onOpenChange]
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isLaunchable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onLaunch();
    }
  };

  return (
    <Tooltip open={tooltipOpen} onOpenChange={onOpenChange}>
      <div
        data-nav-item
        aria-hidden={hidden}
        aria-label="Application launcher card"
        role={isLaunchable ? 'button' : undefined}
        tabIndex={isLaunchable ? 0 : undefined}
        onClick={isLaunchable ? onLaunch : undefined}
        onKeyDown={isLaunchable ? handleKeyDown : undefined}
        onMouseEnter={onMouseEnter}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={clsx(
          'group relative flex items-center gap-md hover:z-1',
          'bg-bg-surface-subtle',
          'rounded-md',
          'px-lg py-lg',
          'border border-border-system-subtle',
          'transition-all duration-300 ease-out',
          {
            'cursor-pointer hover:bg-bg-surface-hover': !disabled,
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-bg-surface-brand-default focus-within:ring-offset-2 focus-within:ring-offset-bg-surface-default':
              !disabled,
            'cursor-default': disabled,
          },
          className
        )}
      >
        <div
          className={clsx(
            'shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300',
            {
              'bg-bg-action-brand-pressed': !disabled,
              'bg-bg-action-inverse-disabled grayscale': disabled,
            }
          )}
        >
          {iconUrl && (
            <img
              src={iconUrl}
              alt={`${name} icon`}
              className="w-10 h-10 object-contain"
            />
          )}
        </div>

        <TooltipTrigger asChild>
          <div className="relative flex flex-1 items-center min-w-0">
            <div ref={ref} className="line-clamp-2 min-w-0">
              <AnimatedTitle
                showIcon={!disabled && isWeb}
                icon={faArrowUpRightFromSquare}
                animated={!disabled}
                as="p"
                className={clsx(
                  'text-body-lg font-medium transition-colors duration-300',
                  {
                    'text-content-primary group-hover:text-content-active':
                      !disabled,
                    'text-content-disabled': disabled,
                  }
                )}
              >
                {name}
              </AnimatedTitle>
            </div>
          </div>
        </TooltipTrigger>

        <div
          className="flex items-center shrink-0"
          aria-label={isWeb ? 'Web application' : 'Desktop application'}
        >
          <FontAwesomeIcon
            icon={isWeb ? faGlobe : faLaptop}
            className="w-4 h-4 text-content-primary"
          />
        </div>
      </div>
      <TooltipContent
        side="bottom"
        sideOffset={8}
        className="text-content-primary text-body-sm font-medium"
      >
        {name}
      </TooltipContent>
    </Tooltip>
  );
};
