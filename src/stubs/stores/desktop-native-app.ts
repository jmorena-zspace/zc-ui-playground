import { useCallback, useSyncExternalStore } from 'react';

/**
 * Fake `@stores/desktop-native-app`. The real store is zustand and tracks
 * whether the app is running inside the desktop shell; here that answer is a
 * constant, with a tiny store behind it so components can launch content and
 * watch the modal state.
 *
 * Supports both call styles the components use: with a selector and without.
 */
type LaunchedContent = { contentName: string; iconUrl?: string } | null;

type DesktopNativeAppState = {
  isDesktopNativeApp: boolean;
  launchedContent: LaunchedContent;
  setLaunchedContent: (content: LaunchedContent) => void;
  clearLaunchedContent: () => void;
};

let state: DesktopNativeAppState = {
  isDesktopNativeApp: false,
  launchedContent: null,
  setLaunchedContent: (content) => set({ launchedContent: content }),
  clearLaunchedContent: () => set({ launchedContent: null }),
};

const listeners = new Set<() => void>();

function set(patch: Partial<DesktopNativeAppState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDesktopNativeAppStore(): DesktopNativeAppState;
export function useDesktopNativeAppStore<T>(
  selector: (state: DesktopNativeAppState) => T
): T;
export function useDesktopNativeAppStore<T>(
  selector?: (state: DesktopNativeAppState) => T
) {
  const getSnapshot = useCallback(
    () => (selector ? selector(state) : state),
    [selector]
  );
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Lets a page drive the launching modal without the desktop shell. */
export const desktopNativeAppActions = {
  setLaunchedContent: (content: LaunchedContent) =>
    set({ launchedContent: content }),
};
