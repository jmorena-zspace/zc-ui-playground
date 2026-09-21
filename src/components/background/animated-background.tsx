import noiseUrl from '@assets/background-noise.png';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { colors, defaults, theme } from './theme';

const TAU = Math.PI * 2;
const TARGET_FPS = 30;
const FRAME_INTERVAL_MS = 1000 / TARGET_FPS;

function detectCanvasFilterSupport(): boolean {
  if (typeof document === 'undefined') return false;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  if (!ctx || !('filter' in ctx)) return false;
  const originalFilter = ctx.filter;
  const testFilter = 'blur(1px)';
  ctx.filter = testFilter;
  const supportsFilter = ctx.filter === testFilter;
  ctx.filter = originalFilter;
  return supportsFilter;
}

const CAN_RENDER_BLOBS = detectCanvasFilterSupport();

const PARTICLE_SHADOW_RADIUS = 10;
const PARTICLE_DOT_RADIUS = 2;
const PARTICLE_SPRITE_PADDING = PARTICLE_SHADOW_RADIUS + PARTICLE_DOT_RADIUS;
const PARTICLE_SPRITE_SIZE = PARTICLE_SPRITE_PADDING * 2;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function loopProgress(timeMs: number, durationMs: number): number {
  return (((timeMs % durationMs) + durationMs) % durationMs) / durationMs;
}

function resolveCSSVar(value: string): string {
  const match = value.match(/var\((.+?)\)/);
  if (!match) return value;
  return getComputedStyle(document.documentElement)
    .getPropertyValue(match[1])
    .trim();
}

function sizeCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dpr: number
) {
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createParticleSprite(dpr: number): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas');
  canvas.width = PARTICLE_SPRITE_SIZE * dpr;
  canvas.height = PARTICLE_SPRITE_SIZE * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(dpr, dpr);
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = PARTICLE_SHADOW_RADIUS;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(
    PARTICLE_SPRITE_PADDING,
    PARTICLE_SPRITE_PADDING,
    PARTICLE_DOT_RADIUS,
    0,
    TAU
  );
  ctx.fill();

  return canvas;
}

type Particle = {
  xPercent: number;
  yPercent: number;
  radius: number;
  durationMs: number;
  offsetMs: number;
};

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    xPercent: Math.random() * 100,
    yPercent: Math.random() * 100,
    radius: Math.random() * 3 + 1,
    durationMs: (Math.random() * 10 + 20) * 1000,
    offsetMs: Math.random() * 30_000,
  }));
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  sprite: HTMLCanvasElement,
  particles: Particle[],
  width: number,
  height: number,
  now: number
) {
  ctx.clearRect(0, 0, width, height);

  for (const p of particles) {
    const progress = loopProgress(now + p.offsetMs, p.durationMs);
    const x = (p.xPercent / 100) * width + progress * 20;
    const y = (p.yPercent / 100) * height - progress * height;

    let opacity = 1;
    if (progress < 0.1) opacity = progress / 0.1;
    else if (progress > 0.9) opacity = (1 - progress) / 0.1;
    if (opacity <= 0) continue;

    const scale =
      (p.radius / 2 + PARTICLE_SHADOW_RADIUS) /
      (PARTICLE_DOT_RADIUS + PARTICLE_SHADOW_RADIUS);
    const drawSize = PARTICLE_SPRITE_SIZE * scale;
    ctx.globalAlpha = opacity;
    ctx.drawImage(
      sprite,
      x - drawSize / 2,
      y - drawSize / 2,
      drawSize,
      drawSize
    );
  }

  ctx.globalAlpha = 1;
}

type BlobSprite = {
  canvas: HTMLCanvasElement;
  blobWidth: number;
  blobHeight: number;
};

function createBlobSprite(
  blobWidth: number,
  blobHeight: number,
  blurRadius: number,
  fillColor: string
): BlobSprite | null {
  const margin = Math.ceil(blurRadius * 3);
  const canvasWidth = Math.ceil(blobWidth) + margin * 2;
  const canvasHeight = Math.ceil(blobHeight) + margin * 2;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.filter = `blur(${blurRadius}px)`;
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.ellipse(
    canvasWidth / 2,
    canvasHeight / 2,
    blobWidth / 2,
    blobHeight / 2,
    0,
    0,
    TAU
  );
  ctx.fill();

  return { canvas, blobWidth, blobHeight };
}

const BLOB_DURATION_MS = 20_000;
const BLOB_KEYFRAMES = [
  { at: 0, x: 0, y: 0, scale: 1 },
  { at: 0.33, x: 30, y: -50, scale: 1.1 },
  { at: 0.66, x: -20, y: 20, scale: 0.9 },
  { at: 1, x: 0, y: 0, scale: 1 },
] as const;

function interpolateBlobKeyframes(now: number, delaySec: number) {
  const elapsed = now - delaySec * 1000;
  const fullCycle = BLOB_DURATION_MS * 2;
  let progress = loopProgress(elapsed, fullCycle) * 2;
  if (progress > 1) progress = 2 - progress;

  let i = 0;
  while (i < BLOB_KEYFRAMES.length - 2 && progress > BLOB_KEYFRAMES[i + 1].at)
    i++;
  const from = BLOB_KEYFRAMES[i];
  const to = BLOB_KEYFRAMES[i + 1];
  const t = easeInOut((progress - from.at) / (to.at - from.at));

  return {
    x: lerp(from.x, to.x, t),
    y: lerp(from.y, to.y, t),
    scale: lerp(from.scale, to.scale, t),
  };
}

const PULSE_DURATION_MS = 8_000;

function interpolatePulse(now: number) {
  const progress = loopProgress(now, PULSE_DURATION_MS);
  const t =
    progress < 0.5 ? easeInOut(progress * 2) : easeInOut((1 - progress) * 2);
  return { opacity: lerp(0.3, 0.4, t), scale: lerp(1, 1.1, t) };
}

type Blob = {
  x: (vw: number) => number;
  y: (vh: number) => number;
  widthRatio: number;
  heightRatio: number;
  blurRadius: number;
  colorKey: keyof typeof colors.blob;
  baseOpacity: number;
  delaySec: number;
  animation: 'drift' | 'pulse';
};

const BLOBS: Blob[] = [
  {
    x: (vw) => -0.1 * vw,
    y: (vh) => -0.1 * vh,
    widthRatio: 0.5,
    heightRatio: 0.5,
    blurRadius: 55,
    colorKey: 'orb1Color',
    baseOpacity: 0.7,
    delaySec: 0,
    animation: 'drift',
  },
  {
    x: (vw) => vw * 0.65,
    y: (vh) => -0.1 * vh,
    widthRatio: 0.45,
    heightRatio: 0.45,
    blurRadius: 55,
    colorKey: 'orb2Color',
    baseOpacity: 0.7,
    delaySec: 4,
    animation: 'drift',
  },
  {
    x: (vw) => -0.05 * vw,
    y: (vh) => vh * 0.65,
    widthRatio: 0.45,
    heightRatio: 0.45,
    blurRadius: 55,
    colorKey: 'orb3Color',
    baseOpacity: 0.7,
    delaySec: 8,
    animation: 'drift',
  },
  {
    x: (vw) => vw * 0.4,
    y: (vh) => vh * 0.7,
    widthRatio: 0.5,
    heightRatio: 0.5,
    blurRadius: 65,
    colorKey: 'orb4Color',
    baseOpacity: 0.7,
    delaySec: 12,
    animation: 'drift',
  },
  {
    x: (vw) => vw * 0.1,
    y: (vh) => vh * 0.1,
    widthRatio: 0.4,
    heightRatio: 0.4,
    blurRadius: 65,
    colorKey: 'orbCenterColor',
    baseOpacity: 0.5,
    delaySec: 0,
    animation: 'pulse',
  },
];

function drawBlobs(
  ctx: CanvasRenderingContext2D,
  sprites: (BlobSprite | null)[],
  viewWidth: number,
  viewHeight: number,
  now: number
) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, viewWidth, viewHeight);
  ctx.globalCompositeOperation = 'screen';

  for (let i = 0; i < BLOBS.length; i++) {
    const blob = BLOBS[i];
    const sprite = sprites[i];
    if (!sprite) continue;

    const blobWidth = viewWidth * blob.widthRatio;
    const blobHeight = viewHeight * blob.heightRatio;
    const centerX = blob.x(viewWidth) + blobWidth / 2;
    const centerY = blob.y(viewHeight) + blobHeight / 2;

    let offsetX = 0;
    let offsetY = 0;
    let scale = 1;
    let opacity = blob.baseOpacity;

    if (blob.animation === 'drift') {
      const anim = interpolateBlobKeyframes(now, blob.delaySec);
      offsetX = anim.x;
      offsetY = anim.y;
      scale = anim.scale;
    } else {
      const anim = interpolatePulse(now);
      opacity = anim.opacity;
      scale = anim.scale;
    }

    const scaleX = blobWidth / sprite.blobWidth;
    const scaleY = blobHeight / sprite.blobHeight;
    const drawWidth = sprite.canvas.width * scaleX;
    const drawHeight = sprite.canvas.height * scaleY;

    ctx.globalAlpha = opacity;
    ctx.save();
    ctx.translate(centerX + offsetX, centerY + offsetY);
    ctx.scale(scale, scale);
    ctx.drawImage(
      sprite.canvas,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
    ctx.restore();
  }

  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
}

export const AnimatedBackground = () => {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const blobCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const particleCanvas = particleCanvasRef.current;
    if (!particleCanvas) return;

    const particleCtx = particleCanvas.getContext('2d');
    if (!particleCtx) return;

    const resolvedColors = Object.fromEntries(
      Object.entries(colors.blob).map(([key, cssVar]) => [
        key,
        resolveCSSVar(cssVar),
      ])
    ) as Record<keyof typeof colors.blob, string>;

    const particles = generateParticles(defaults.particleCount);

    let currentDpr = window.devicePixelRatio || 1;
    let particleSprite = createParticleSprite(currentDpr);
    if (!particleSprite) return;

    let viewWidth = window.innerWidth;
    let viewHeight = window.innerHeight;
    let needsResize = false;

    const blobSprites: (BlobSprite | null)[] = CAN_RENDER_BLOBS
      ? BLOBS.map((blob) =>
          createBlobSprite(
            viewWidth * blob.widthRatio,
            viewHeight * blob.heightRatio,
            blob.blurRadius,
            resolvedColors[blob.colorKey]
          )
        )
      : [];
    const blobCanvas = blobCanvasRef.current;
    const blobCtx = blobCanvas?.getContext('2d');
    const blobRendering =
      blobCanvas && blobCtx ? { canvas: blobCanvas, ctx: blobCtx } : null;

    // Closure reads viewWidth/viewHeight/currentDpr by reference (let bindings),
    // so it always uses the latest values when called from applyResize.
    const sizeBlobCanvas = () => {
      if (blobRendering)
        sizeCanvas(
          blobRendering.canvas,
          blobRendering.ctx,
          viewWidth,
          viewHeight,
          currentDpr
        );
    };

    const applyResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const newDpr = window.devicePixelRatio || 1;

      const sizeChanged = newWidth !== viewWidth || newHeight !== viewHeight;
      const dprChanged = newDpr !== currentDpr;

      needsResize = false;
      if (!sizeChanged && !dprChanged) return;

      if (dprChanged) {
        currentDpr = newDpr;
        const newSprite = createParticleSprite(currentDpr);
        if (newSprite) particleSprite = newSprite;
      }

      viewWidth = newWidth;
      viewHeight = newHeight;

      sizeCanvas(
        particleCanvas,
        particleCtx,
        viewWidth,
        viewHeight,
        currentDpr
      );
      sizeBlobCanvas();
    };

    const handleResize = () => {
      needsResize = true;
    };

    sizeCanvas(particleCanvas, particleCtx, viewWidth, viewHeight, currentDpr);
    sizeBlobCanvas();
    window.addEventListener('resize', handleResize);

    let frameId = 0;
    let lastFrameTime = 0;

    const tick = (now: number) => {
      frameId = requestAnimationFrame(tick);

      const didResize = needsResize;
      if (didResize) applyResize();

      if (now - lastFrameTime < FRAME_INTERVAL_MS && !didResize) return;
      lastFrameTime = now;

      if (!particleSprite) return;
      drawParticles(
        particleCtx,
        particleSprite,
        particles,
        viewWidth,
        viewHeight,
        now
      );
      if (blobRendering)
        drawBlobs(blobRendering.ctx, blobSprites, viewWidth, viewHeight, now);
    };

    frameId = requestAnimationFrame(tick);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className={theme.root}>
      <div className={clsx(theme.layers.base, theme.layers.grid)}>
        <div className={theme.grid.base} />
      </div>

      {CAN_RENDER_BLOBS && (
        <div className={clsx(theme.layers.base, theme.layers.blobs)}>
          <canvas ref={blobCanvasRef} className={theme.canvas.blobs} />
        </div>
      )}

      <div className={clsx(theme.layers.base, theme.layers.particles)}>
        <canvas ref={particleCanvasRef} className={theme.canvas.particles} />
      </div>

      <div className={clsx(theme.layers.base, theme.layers.noise)}>
        <div
          className={theme.noise.tile}
          style={{ backgroundImage: `url("${noiseUrl}")` }}
        />
      </div>

      <div
        className={clsx(
          theme.layers.base,
          theme.layers.vignette,
          theme.vignette.base
        )}
      />
    </div>
  );
};
