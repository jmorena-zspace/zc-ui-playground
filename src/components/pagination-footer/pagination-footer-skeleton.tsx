import { Skeleton } from '@components/ui/skeleton';
import { FC } from 'react';

export const PaginationFooterSkeleton: FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-md md:gap-none">
      <Skeleton className="hidden md:block h-8 w-40" />
      <Skeleton className="h-8 w-48" />
    </div>
  );
};
