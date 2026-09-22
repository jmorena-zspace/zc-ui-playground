import { ExternalLink } from 'lucide-react';
import { ImagePlaceholder } from '@assets/image-placeholder';
import { AnimatedTitle } from '@components/animated-title';
import {
  ContentBadge,
  ContentBadgeType,
} from '@components/badges/content-badge';
import { LaunchCodeBadge } from '@components/badges/launch-code-badge';
import { useLaunch } from '@hooks/launch';
import { ContentItem, ContentPlatform } from '@zcentral-v2/types';
import clsx from 'clsx';
import { FC } from 'react';
import { toast } from 'sonner';

export type ApplicationCardProps = {
  application: ContentItem;
  /** Hides the application image. Defaults to false (image shown). */
  compact?: boolean;
  /** Uses a stronger hover background for dark/inverse surfaces. */
  invertedHover?: boolean;
};

export const ApplicationCard: FC<ApplicationCardProps> = ({
  application,
  compact = false,
  invertedHover = false,
}) => {
  const { name, launchCode, platform } = application;
  const { canLaunchApplication, launchApplication } = useLaunch();

  const isLaunchable = canLaunchApplication(application);
  const isWeb = platform === ContentPlatform.WEB;

  const handleLaunch = () => {
    launchApplication(application).catch((error) => {
      toast.error('Failed to launch content');
      console.error('Failed to launch content:', error);
    });
  };

  return (
    <div
      className={clsx(
        'group/card relative overflow-clip isolate',
        'bg-bg-surface-subtle rounded-md p-md',
        'transition-all duration-300 ease-out',
        {
          'hover:bg-bg-surface-inverse-hover focus-within:bg-bg-surface-inverse-hover':
            invertedHover,
          'hover:bg-bg-surface-hover focus-within:bg-bg-surface-hover':
            !invertedHover,
        }
      )}
    >
      {/* Mobile layout */}
      <div className="flex flex-col gap-sm items-start md:hidden">
        <div className="flex items-start justify-between gap-xs w-full">
          <AnimatedTitle
            className="line-clamp-2 wrap-break-word text-body-lg font-medium text-content-primary"
            as="h2"
            showIcon={false}
            hoverGroup="group/card"
          >
            {name}
          </AnimatedTitle>
          {launchCode && (
            <LaunchCodeBadge text={launchCode} className="shrink-0" />
          )}
        </div>
        <ContentBadge type={ContentBadgeType.APPLICATION} />
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex gap-md items-center">
        {!compact &&
          (application.iconUrl ? (
            <img
              src={application.iconUrl}
              alt={`Cover image for ${name}`}
              className="w-24 h-24 shrink-0 rounded-sm border border-border-system-subtle object-cover"
            />
          ) : (
            <ImagePlaceholder className="w-24 h-24 shrink-0 rounded-sm border border-border-system-subtle text-content-tertiary" />
          ))}
        <div className="flex flex-col gap-sm justify-center min-w-0 flex-1 relative z-10">
          <div className="flex items-center gap-xs">
            <AnimatedTitle
              className="line-clamp-2 wrap-break-word text-body-lg font-medium text-content-primary"
              as="h2"
              showIcon={false}
              hoverGroup="group/card"
            >
              {name}
            </AnimatedTitle>
            {launchCode && (
              <div
                className={clsx(
                  'shrink-0 overflow-hidden',
                  'transition-all duration-300 ease-in-out',
                  'opacity-100 translate-y-0',
                  'group-hover/card:opacity-0 group-hover/card:translate-y-full group-focus-within/card:opacity-0 group-focus-within/card:translate-y-full'
                )}
              >
                <LaunchCodeBadge text={launchCode} />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-xs items-center">
            <ContentBadge type={ContentBadgeType.APPLICATION} />
          </div>
        </div>

        <div className="shrink-0 ml-auto flex items-center relative z-10">
          <button
            aria-label={`Launch ${name}`}
            disabled={!isLaunchable}
            onClick={handleLaunch}
            className={clsx(
              'inline-flex items-center gap-xs',
              'h-6 px-sm py-xs rounded-full',
              'text-body-sm font-medium',
              'transition-colors',
              {
                'bg-bg-action-primary-default text-content-action-on-primary-default cursor-pointer hover:bg-bg-action-primary-hover':
                  isLaunchable,
                'bg-bg-action-primary-disabled text-content-action-on-primary-disabled cursor-not-allowed':
                  !isLaunchable,
              }
            )}
          >
            <span>Launch</span>
            {isWeb && isLaunchable && (
              <ExternalLink className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
