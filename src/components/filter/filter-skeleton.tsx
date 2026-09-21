import { Skeleton } from '@components/ui/skeleton';
import { FC } from 'react';

type FilterSkeletonProps = {
  filterCount: number;
};

export const FilterSkeleton: FC<FilterSkeletonProps> = ({ filterCount }) => {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <Skeleton className="h-8 w-full rounded-full" />
      </div>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-sm">
        {Array.from({ length: filterCount }, (_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
        <Skeleton className="h-8 w-28 rounded-full ml-auto" />
      </div>
    </>
  );
};
