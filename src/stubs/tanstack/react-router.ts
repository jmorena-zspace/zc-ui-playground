/**
 * Stand-in for `@tanstack/react-router`, covering only the hooks the ported
 * components reach for. It reads the real `window.location` and listens for
 * `popstate`, which is enough because the components drive navigation with
 * `history.replaceState` followed by a synthetic `PopStateEvent` — see
 * `removeLessonParam` in lesson-side-panel.tsx.
 *
 * Add hooks here as more components come over (`useNavigate`, `useLocation`
 * and `Link` are used elsewhere in src/components and are not implemented).
 */
import { useEffect, useState } from 'react';

type RouterLocation = {
  href: string;
  pathname: string;
  search: string;
  searchStr: string;
  hash: string;
};

type RouterState = { location: RouterLocation };

function readLocation(): RouterLocation {
  const { href, pathname, search, hash } = window.location;
  return { href, pathname, search, searchStr: search, hash };
}

function useLocationSnapshot(): RouterLocation {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    const sync = () => setLocation(readLocation());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  return location;
}

export function useRouterState<T = RouterState>(opts?: {
  select?: (state: RouterState) => T;
}): T {
  const location = useLocationSnapshot();
  const state: RouterState = { location };
  return (opts?.select ? opts.select(state) : state) as T;
}

export function useRouter() {
  return {
    history: {
      back: () => window.history.back(),
      forward: () => window.history.forward(),
    },
  };
}

export function useCanGoBack(): boolean {
  return window.history.length > 1;
}
