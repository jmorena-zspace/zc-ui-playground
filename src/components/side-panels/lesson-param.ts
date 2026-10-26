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
