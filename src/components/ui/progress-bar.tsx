import { useIsFetching } from '@tanstack/react-query';
import { useRouterState } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * How long to wait before showing the bar. If the fetch completes within
 * this window the bar never appears — avoids flash for fast responses.
 */
const SHOW_DELAY_MS = 150;

/**
 * Once the bar is visible, keep it on screen at least this long so the
 * user can perceive it before it completes.
 */
const MIN_VISIBLE_MS = 500;

/**
 * Visual states of the bar:
 *
 *   hidden  → bar is not rendered
 *   growing → bar is visible and slowly advancing from 5 % → 80 %
 *   filling → bar snaps to 100 % and fades out, then returns to hidden
 */
type BarState = 'hidden' | 'growing' | 'filling';

/**
 * YouTube / NProgress-style progress bar that reacts to any in-flight
 * data fetch (React Query) or route transition (TanStack Router).
 *
 * Lifecycle:
 *   1. A fetch starts → wait SHOW_DELAY_MS
 *   2. Still fetching? → enter "growing": render the bar at 5 % and
 *      increment it slowly toward 80 % (never reaches 100 on its own)
 *   3. Fetch ends → enter "filling": snap to 100 %, fade out, hide
 *
 * If the fetch finishes during step 1, the bar never appears.
 * If a new fetch starts during step 3, the fill is cancelled and the
 * bar resumes growing.
 */
export function ProgressBar() {
  const isRouterFetching = useRouterState({ select: (s) => s.isLoading });
  const queryFetchCount = useIsFetching();
  const isFetching = isRouterFetching || queryFetchCount > 0;

  const [barState, setBarState] = useState<BarState>('hidden');
  const [width, setWidth] = useState(0);

  // Refs for timers — stored outside effects so re-renders don't cancel them
  const showDelayTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const growthTicker = useRef<ReturnType<typeof setInterval>>(null);
  const fillDelayTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const fadeOutTimer = useRef<ReturnType<typeof setTimeout>>(null);

  /** Tracks when the bar became visible, used to enforce MIN_VISIBLE_MS. */
  const visibleSince = useRef(0);

  /** Always-current value of `isFetching`, readable inside setTimeout callbacks. */
  const isFetchingRef = useRef(isFetching);
  isFetchingRef.current = isFetching;

  const stopAllTimers = useCallback(() => {
    if (showDelayTimer.current) clearTimeout(showDelayTimer.current);
    if (growthTicker.current) clearInterval(growthTicker.current);
    if (fillDelayTimer.current) clearTimeout(fillDelayTimer.current);
    if (fadeOutTimer.current) clearTimeout(fadeOutTimer.current);
  }, []);

  /** Show the bar and start the slow growth animation (5 % → 80 %). */
  const startGrowing = useCallback(() => {
    if (!isFetchingRef.current) return; // fetch ended during the delay

    setBarState('growing');
    visibleSince.current = Date.now();
    setWidth(5);

    growthTicker.current = setInterval(() => {
      setWidth((prev) => {
        if (prev >= 80) return prev; // no-op — React skips re-render
        const step = prev < 30 ? 3 : prev < 60 ? 1.5 : 0.5;
        return Math.min(prev + step, 80);
      });
    }, 200);
  }, []);

  /** Snap to 100 %, fade out, then reset to hidden. */
  const startFilling = useCallback(() => {
    if (growthTicker.current) clearInterval(growthTicker.current);

    // Wait until MIN_VISIBLE_MS has elapsed before starting the fill
    const elapsed = Date.now() - visibleSince.current;
    const waitBeforeFill = Math.max(0, MIN_VISIBLE_MS - elapsed);

    fillDelayTimer.current = setTimeout(() => {
      setBarState('filling');
      setWidth(100);

      fadeOutTimer.current = setTimeout(() => {
        setBarState('hidden');
        setWidth(0);
      }, 400);
    }, waitBeforeFill);
  }, []);

  /** Cancel filling and resume the growth animation from 30 %. */
  const resumeGrowing = useCallback(() => {
    stopAllTimers();
    setBarState('growing');
    visibleSince.current = Date.now();
    setWidth(30);

    growthTicker.current = setInterval(() => {
      setWidth((prev) => {
        if (prev >= 80) return prev;
        return Math.min(prev + 0.5, 80);
      });
    }, 200);
  }, [stopAllTimers]);

  // ── State transitions driven by isFetching ──────────────────────────
  useEffect(() => {
    if (isFetching) {
      if (barState === 'hidden') {
        showDelayTimer.current = setTimeout(startGrowing, SHOW_DELAY_MS);
      } else if (barState === 'filling') {
        resumeGrowing();
      }
    } else {
      if (barState === 'growing') {
        startFilling();
      } else if (barState === 'hidden') {
        // Fetch ended before the show delay — cancel silently
        if (showDelayTimer.current) clearTimeout(showDelayTimer.current);
      }
    }
  }, [isFetching, barState, startGrowing, startFilling, resumeGrowing]);

  // Cleanup on unmount
  useEffect(() => stopAllTimers, [stopAllTimers]);

  if (barState === 'hidden') return null;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(width)}
      className="fixed top-0 left-0 right-0 z-50 h-[3px]"
    >
      <div
        className="h-full bg-bg-surface-brand-default"
        style={{
          width: `${width}%`,
          transition:
            barState === 'filling'
              ? 'width 200ms ease-out, opacity 200ms ease-out 200ms'
              : 'width 200ms linear',
          opacity: barState === 'filling' ? 0 : 1,
        }}
      />
    </div>
  );
}
