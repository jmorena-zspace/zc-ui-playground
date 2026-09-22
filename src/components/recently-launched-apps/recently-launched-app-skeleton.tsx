import { Skeleton } from '@components/ui/skeleton';
import { RecentlyLaunchedApp } from '@zcentral-v2/types';
import { FC } from 'react';

type RecentlyLaunchedAppSkeletonProps = {
  app: RecentlyLaunchedApp;
};

export const RecentlyLaunchedAppSkeleton: FC<
  RecentlyLaunchedAppSkeletonProps
> = ({ app }) => {

  return (
    <div
      role="status"
      aria-label={`Loading ${app.name}`}
      className="flex w-[128px] shrink-0 flex-col items-center gap-xs rounded-sm"
    >
      <Skeleton inverse className="flex size-12 items-center justify-center rounded-full p-xs" />
      <div className="line-clamp-3 min-w-full text-center text-transparent">
        <span
          aria-hidden
          className="animate-pulse rounded-xs bg-bg-skeleton-inverse box-decoration-clone font-body text-body-sm font-regular text-transparent select-none decoration-transparent"
        >
          {app.name}
        </span>
      </div>
    </div>
  );
};
