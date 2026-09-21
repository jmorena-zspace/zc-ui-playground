import type { ComponentProps } from 'react';

import { cn } from '@shared/utils';

type SkeletonProps = ComponentProps<'div'> & {
  inverse?: boolean;
};

function Skeleton({ className, inverse = false, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-pulse rounded-md',
        { 'bg-bg-skeleton-inverse': inverse, 'bg-bg-skeleton': !inverse },
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
