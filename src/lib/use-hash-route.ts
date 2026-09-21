import { useEffect, useState } from 'react'

/**
 * Minimal hash routing, so the playground gets back/forward and shareable
 * URLs without pulling in a router. The ported components that want
 * @tanstack/react-router are a separate problem — this only drives the
 * playground's own shell.
 */
export function useHashRoute(): [string, (route: string) => void] {
  const read = () => window.location.hash.replace(/^#\/?/, '')
  const [route, setRoute] = useState(read)

  useEffect(() => {
    const onChange = () => setRoute(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return [route, (next: string) => { window.location.hash = next ? `#/${next}` : '#/' }]
}
