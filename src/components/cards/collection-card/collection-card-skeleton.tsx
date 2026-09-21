import { Skeleton } from '@components/ui/skeleton';
import { FC } from 'react';

export const CollectionCardSkeleton: FC = () => {
  return (
    <div aria-hidden className="border border-border-system-subtle rounded-md">
      <div className="flex items-center gap-xs p-md bg-bg-surface-subtle rounded-md">
        <Skeleton className="h-5 w-1/2 md:w-1/3" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
};
