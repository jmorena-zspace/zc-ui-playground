import { Skeleton } from '@components/ui/skeleton';
import { FC, ReactNode } from 'react';

type LessonSidePanelSkeletonProps = {
  header: ReactNode;
};

export const LessonSidePanelSkeleton: FC<LessonSidePanelSkeletonProps> = ({
  header,
}) => {
  return (
    <div className="flex flex-col gap-md bg-bg-surface-default p-md md:p-0">
      {header}

      {/* Title */}
      <Skeleton className="h-6 w-3/4" />

      <hr className="border-border-system-subtle" />

      {/* Image */}
      <Skeleton className="w-full h-[272px] shrink-0 rounded-sm" />

      {/* Launch button */}
      <Skeleton className="h-10 w-full rounded-full hidden md:flex" />

      {/* Deep linking launch code button */}
      <Skeleton className="h-8 w-full rounded-full" />

      {/* Subject badges */}
      <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-xxs">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Summary heading */}
      <Skeleton className="h-5 w-32" />

      {/* Summary text */}
      <div className="flex flex-col gap-xs">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Lesson Plan section */}
      <div className="flex flex-col gap-md">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-9 w-full rounded-xs" />
      </div>

      {/* Supporting Files section */}
      <div className="flex flex-col gap-md">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-9 w-full rounded-xs" />
      </div>
    </div>
  );
};
