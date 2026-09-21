import { FC, ReactNode, useCallback, useRef } from 'react';

type SwipeableContainerProps = {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  className?: string;
};

const SWIPE_THRESHOLD = 120;

export const SwipeableContainer: FC<SwipeableContainerProps> = ({
  onSwipeLeft,
  onSwipeRight,
  children,
  className,
}) => {
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;

      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX.current;

      if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
        if (deltaX < 0) {
          onSwipeLeft();
        } else if (deltaX > 0) {
          onSwipeRight();
        }
      }

      touchStartX.current = null;
    },
    [onSwipeLeft, onSwipeRight]
  );

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};
