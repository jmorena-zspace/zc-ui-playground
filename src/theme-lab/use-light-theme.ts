import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildLightGuess } from './light-guess'
import { parseTheme, themeToDeclarations, type LightTheme } from './theme-css'

const STORAGE_KEY = 'zc-ui-playground:light-theme'
const STYLE_ID = 'theme-lab-light-overrides'

function load(): LightTheme | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as LightTheme) : null
  } catch {
    // Private windows and blocked site data both throw here.
    return null
  }
}

function save(theme: LightTheme) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
  } catch {
    // Not being able to persist should never break editing.
  }
}

export type Mode = 'dark' | 'light'

export function useLightTheme() {
  // The generated guess is the starting point; anything edited before is
  // layered on top, so a new role added to the rail still gets a sane value.
  const guess = useMemo(buildLightGuess, [])
  const [theme, setTheme] = useState<LightTheme>(() => ({
    ...guess,
    ...load(),
  }))
  const [mode, setMode] = useState<Mode>('light')

  useEffect(() => {
    save(theme)
  }, [theme])

  /**
   * Applied as a <style> element rather than inline styles on the canvas,
   * because Radix renders tooltips, selects and dialogs through a portal on
   * document.body — outside any canvas wrapper, so inline vars would not
   * reach them. The lab's own chrome is painted with palette primitives so it
   * stays readable whatever these roles are set to.
   */
  useEffect(() => {
    let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!style) {
      style = document.createElement('style')
      style.id = STYLE_ID
      document.head.append(style)
    }
    style.textContent =
      mode === 'light' ? `:root {\n${themeToDeclarations(theme)}\n}` : ''
    return () => {
      style?.remove()
    }
  }, [theme, mode])

  const setRole = useCallback((role: string, value: string) => {
    setTheme((current) => ({ ...current, [role]: value }))
  }, [])

  const resetRole = useCallback(
    (role: string) => {
      setTheme((current) => ({ ...current, [role]: guess[role] }))
    },
    [guess]
  )

  const resetAll = useCallback(() => setTheme({ ...guess }), [guess])

  const importCss = useCallback((css: string) => {
    const { theme: imported, unknownRoles } = parseTheme(css)
    const count = Object.keys(imported).length
    if (count > 0) setTheme((current) => ({ ...current, ...imported }))
    return { count, unknownRoles }
  }, [])

  return {
    theme,
    mode,
    setMode,
    setRole,
    resetRole,
    resetAll,
    importCss,
    guess,
  }
}
