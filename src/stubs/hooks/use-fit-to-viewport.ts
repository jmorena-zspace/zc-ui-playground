import { useEffect, type RefObject } from 'react';

export type FitToViewportOptions = {
  /** Space to leave below the element, in px. */
  bottomOffset?: number;
  /** Never shrink below this, in px. */
  minHeight?: number;
};

/**
 * Fake `@hooks/use-fit-to-viewport`. The real hook caps a results dropdown so
 * it never runs past the bottom of the window; same idea here, just simpler.
 */
export function useFitToViewport(
  ref: RefObject<HTMLElement | null>,
  itemCount: number,
  { bottomOffset = 24, minHeight = 160 }: FitToViewportOptions = {}
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const fit = () => {
      const top = element.getBoundingClientRect().top;
      const available = window.innerHeight - top - bottomOffset;
      element.style.maxHeight = `${Math.max(minHeight, available)}px`;
    };

    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [ref, itemCount, bottomOffset, minHeight]);
}
