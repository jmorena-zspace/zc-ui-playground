import { useCallback, useRef, useState } from 'react';

/**
 * Fake `@hooks/truncated-tooltip`. The real hook only opens the tooltip when
 * the label is actually clipped; this keeps that behaviour, since it is
 * visible — a tooltip that fires on every hover looks wrong.
 */
export function useTruncatedTooltip<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const isTruncated = useCallback(() => {
    const element = ref.current;
    return !!element && element.scrollWidth > element.clientWidth + 1;
  }, []);

  const onOpenChange = useCallback(
    (open: boolean) => setTooltipOpen(open && isTruncated()),
    [isTruncated]
  );

  const onMouseEnter = useCallback(
    () => setTooltipOpen(isTruncated()),
    [isTruncated]
  );

  return { ref, tooltipOpen, onMouseEnter, onOpenChange };
}
