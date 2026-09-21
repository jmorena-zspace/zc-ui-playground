import { Skeleton } from '@components/ui/skeleton';
import { FC } from 'react';

export const SubjectCardSkeleton: FC = () => {
  return (
    <div
      aria-hidden
      className="flex items-center flex-row gap-sm px-md py-sm md:flex-col md:justify-center md:gap-xs md:p-md md:h-[160px] bg-bg-surface-subtle rounded-md"
    >
      <Skeleton className="w-16 h-16 shrink-0 rounded" />
      <Skeleton className="h-5 w-20 md:w-30" />
    </div>
  );
};
