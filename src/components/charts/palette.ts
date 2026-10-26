/**
 * The dataviz skill's validated categorical palette, dark-surface steps —
 * checked with `validate_palette.js --mode dark --surface #201d3b` (this
 * app's `bg-surface-subtle`, which is what chart cards sit on): all six
 * checks pass, worst adjacent CVD ΔE 8.4, worst adjacent normal-vision
 * ΔE 19.3, every hue ≥3:1 against the card surface.
 *
 * Kept separate from the app's own token scale rather than reusing e.g.
 * `--color-blue-500` — those weren't chosen for chart contrast/CVD
 * separation, so they're not guaranteed to pass the same checks.
 */
export const CATEGORICAL = [
  '#3987e5', // blue
  '#d95926', // orange
  '#199e70', // aqua
  '#c98500', // yellow
  '#d55181', // magenta
  '#008300', // green
  '#9085e9', // violet
  '#e66767', // red
] as const;

/** Default single hue for a magnitude (sequential) chart — one series. */
export const SEQUENTIAL_HUE = CATEGORICAL[0];

// This app's own tokens, not the skill's generic chrome values — text and
// gridlines should read as part of the same UI, not a different mode.
export const CHART_INK = {
  surface: '#201d3b', // --color-bg-surface-subtle
  secondary: '#a7a3cb', // --color-dark-200 (content-tertiary)
  muted: '#a7a3cb',
  gridline: '#29274d', // --color-dark-600 (border-system-subtle)
} as const;
