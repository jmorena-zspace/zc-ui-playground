import {
  IGNORE_SELECTOR,
  navigateArrow,
} from '@shared/utils';
import { forwardRef, HTMLAttributes, KeyboardEvent, useCallback } from 'react';

type ArrowNavigableContainerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'role' | 'onKeyDown'
>;

export const ArrowNavigableContainer = forwardRef<
  HTMLDivElement,
  ArrowNavigableContainerProps
>(({ children, ...divProps }, ref) => {
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

    const target = e.target as HTMLElement;
    if (target.matches(IGNORE_SELECTOR)) return;

    if (navigateArrow(e.currentTarget, e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return (
    <div ref={ref} role="presentation" onKeyDown={handleKeyDown} {...divProps}>
      {children}
    </div>
  );
});
