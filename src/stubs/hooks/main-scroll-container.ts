import { useEffect, useRef } from 'react';

/**
 * Fake `@hooks/main-scroll-container`. The real hook hands back the app
 * shell's scrolling element so pagination can jump to the top on page change;
 * here it finds the nearest scrollable ancestor instead.
 */
export function useMainScrollContainer() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const scrollable = document.querySelector<HTMLElement>(
      '[data-main-scroll-container]'
    );
    ref.current = scrollable ?? document.scrollingElement as HTMLElement | null;
  }, []);

  return ref;
}
