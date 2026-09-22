import { PRIMITIVES, ROLES, type Primitive } from './tokens.generated'

/**
 * A starting point for the light theme, not an answer — expect to override a
 * good share of it by hand.
 *
 * Three rules, in order:
 *
 * 1. Brand roles keep their dark value. A primary button is purple in both
 *    modes; mirroring it down the ramp turns the brand grey.
 * 2. Overlay-valued roles keep their dark value. The role names already say
 *    which surface they sit on (`bg-skeleton` vs `bg-skeleton-inverse`), so
 *    flipping them inverts the meaning rather than adapting it.
 * 3. Everything else mirrors its position in its ramp, keeping the hue: a
 *    surface on dark-800 lands near the light end, body text on dark-50 lands
 *    near the dark end, a yellow label background on yellow-950 becomes
 *    yellow-50.
 *
 * `dark` and `midnight` mirror into `neutral`: midnight is page-background
 * darks only, and the light end of the purple-tinted `dark` ramp reads muddy
 * across large surfaces.
 */
const FAMILY_REMAP: Record<string, string> = {
  dark: 'neutral',
  midnight: 'neutral',
}

/** Roles that carry brand identity rather than adapting to the surface. */
const KEEPS_BRAND =
  /(action-(primary|brand)|on-(primary|brand)|-brand-|brand-(default|subtle|strong)|link-)/

const byName = new Map(PRIMITIVES.map((p) => [p.name, p]))

/** Shades per family, ordered light to dark, so position can be mirrored. */
const ramps = new Map<string, Primitive[]>()
for (const p of PRIMITIVES) {
  if (p.isOverlay || !/^\d+$/.test(p.shade)) continue
  const ramp = ramps.get(p.family) ?? []
  ramp.push(p)
  ramps.set(p.family, ramp)
}
for (const ramp of ramps.values()) {
  ramp.sort((a, b) => Number(a.shade) - Number(b.shade))
}

function mirror(primitive: Primitive): string {
  if (primitive.isOverlay) return primitive.name

  if (primitive.shade === 'white') return '--color-neutral-black'
  if (primitive.shade === 'black') return '--color-neutral-white'

  const targetFamily = FAMILY_REMAP[primitive.family] ?? primitive.family
  const sourceRamp = ramps.get(primitive.family)
  const targetRamp = ramps.get(targetFamily)
  if (!sourceRamp || !targetRamp) return primitive.name

  const index = sourceRamp.findIndex((p) => p.name === primitive.name)
  if (index < 0) return primitive.name

  // Mirror the position, then rescale if the two ramps differ in length.
  const ratio = sourceRamp.length > 1 ? index / (sourceRamp.length - 1) : 0
  const mirrored = Math.round((1 - ratio) * (targetRamp.length - 1))
  return targetRamp[mirrored].name
}

/** role name -> palette entry name, for every role the rail exposes. */
export function buildLightGuess(): Record<string, string> {
  const guess: Record<string, string> = {}
  for (const role of ROLES) {
    const primitive = role.darkRef ? byName.get(role.darkRef) : undefined
    if (!primitive) {
      guess[role.name] = role.darkRef ?? ''
      continue
    }
    const keep = primitive.isOverlay || KEEPS_BRAND.test(role.name)
    guess[role.name] = keep ? primitive.name : mirror(primitive)
  }
  return guess
}
