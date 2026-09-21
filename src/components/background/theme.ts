import clsx from 'clsx';

const CONTAIN_STRICT = '[contain:strict]';

export const theme = {
  root: clsx(
    'fixed inset-0 w-full h-screen -z-1',
    'min-h-screen overflow-hidden isolate',
    'bg-purple-950'
  ),
  layers: {
    base: 'absolute inset-0 pointer-events-none',
    grid: clsx('z-0', CONTAIN_STRICT),
    particles: clsx('z-10', CONTAIN_STRICT),
    blobs: clsx('z-0 overflow-hidden', CONTAIN_STRICT),
    noise: clsx('z-20 opacity-[0.06] mix-blend-overlay', CONTAIN_STRICT),
    vignette: clsx('z-30 overflow-hidden', CONTAIN_STRICT),
  },
  grid: {
    base: clsx(
      'absolute inset-0',
      'opacity-[0.08]',
      'bg-size-[60px_60px]',
      `bg-[linear-gradient(to_right,var(--color-violet-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-violet-200)_1px,transparent_1px)]`
    ),
  },
  canvas: {
    blobs: 'block mix-blend-screen',
    particles: 'block',
  },
  noise: {
    tile: 'w-full h-full bg-repeat bg-size-[256px_256px]',
  },
  vignette: {
    base: `bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.3)_100%)]`,
  },
};

export const defaults = {
  particleCount: 30,
};

export const colors = {
  blob: {
    orb1Color: 'var(--color-violet-950)',
    orb2Color: 'var(--color-indigo-950)',
    orb3Color: 'var(--color-indigo-950)',
    orb4Color: 'var(--color-violet-950)',
    orbCenterColor: 'var(--color-violet-900)',
  },
};
