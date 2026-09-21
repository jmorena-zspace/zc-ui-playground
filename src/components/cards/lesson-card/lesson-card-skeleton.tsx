import { Skeleton } from '@components/ui/skeleton';
import { FC } from 'react';

export const LessonCardSkeleton: FC = () => {
  return (
    <div aria-hidden className="bg-bg-surface-subtle rounded-md p-md">
      {/* Mobile layout */}
      <div className="flex flex-col gap-sm items-start md:hidden">
        <div className="flex items-start gap-xs w-full">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-12 shrink-0 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="flex flex-wrap gap-xs items-center w-full">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex gap-md items-center">
        <Skeleton className="w-24 h-24 shrink-0 rounded-sm" />
        <div className="flex flex-col gap-sm justify-center min-w-0 flex-1">
          <Skeleton className="h-5 w-2/3" />
          <div className="flex gap-xs items-center">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-5 w-24 shrink-0 ml-auto" />
      </div>
    </div>
  );
};
