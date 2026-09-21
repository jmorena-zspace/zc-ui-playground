import { Skeleton } from '@components/ui/skeleton';
import { FC } from 'react';

export const ApplicationCardSkeleton: FC = () => {
  return (
    <div aria-hidden className="bg-bg-surface-subtle rounded-md p-md">
      {/* Mobile layout */}
      <div className="flex flex-col gap-sm items-start md:hidden">
        <div className="flex items-start justify-between gap-xs w-full">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-12 shrink-0 rounded-full" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex gap-md items-center">
        <Skeleton className="w-24 h-24 shrink-0 rounded-sm" />
        <div className="flex flex-col gap-sm justify-center min-w-0 flex-1">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full shrink-0 ml-auto" />
      </div>
    </div>
  );
};
