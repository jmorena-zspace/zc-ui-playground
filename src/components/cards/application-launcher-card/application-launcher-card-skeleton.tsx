import { Skeleton } from '@components/ui/skeleton';
import { FC } from 'react';

export const ApplicationLauncherCardSkeleton: FC = () => {
  return (
    <div
      aria-hidden
      className="flex items-center gap-md px-lg py-lg border border-border-system-subtle rounded-md bg-bg-surface-subtle"
    >
      <Skeleton className="w-16 h-16 shrink-0 rounded-full" />
      <Skeleton className="h-5 flex-1" />
      <Skeleton className="w-4 h-4 shrink-0" />
    </div>
  );
};
