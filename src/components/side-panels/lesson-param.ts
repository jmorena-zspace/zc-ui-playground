/**
 * The side panel opens and closes through the `lesson` search param, with a
 * synthetic popstate so the router notices the change.
 */
export function removeLessonParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete('lesson');
  window.history.replaceState(window.history.state, '', url.toString());
  window.dispatchEvent(
    new PopStateEvent('popstate', { state: window.history.state })
  );
}

/** Tabs of the maximized lesson window; the side panel can ask to open one. */
export type LessonWindowTab = 'lesson-plan' | 'worksheet' | 'standards';
