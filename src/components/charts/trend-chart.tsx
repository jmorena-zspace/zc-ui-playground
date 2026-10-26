import clsx from 'clsx';
import { FC, PointerEvent, useRef, useState } from 'react';
import { CHART_INK, SEQUENTIAL_HUE } from './palette';

export type TrendDatum = {
  date: string;
  value: number;
};

type TrendChartProps = {
  title: string;
  data: TrendDatum[];
  color?: string;
  className?: string;
};

const VIEW_W = 480;
const VIEW_H = 220;
const PADDING = { top: 24, right: 12, bottom: 24, left: 28 };

function niceMax(max: number): number {
  if (max <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const steps = [1, 2, 2.5, 5, 10];
  for (const step of steps) {
    const candidate = step * magnitude;
    if (candidate >= max) return candidate;
  }
  return 10 * magnitude;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

/**
 * A single-series trend line: 2px line, ~10% area wash, a hairline
 * crosshair that snaps to the nearest point, and a tooltip that follows it.
 * One series, so no legend — the title names it.
 */
export const TrendChart: FC<TrendChartProps> = ({
  title,
  data,
  color = SEQUENTIAL_HUE,
  className,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotW = VIEW_W - PADDING.left - PADDING.right;
  const plotH = VIEW_H - PADDING.top - PADDING.bottom;
  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));

  const xAt = (i: number) =>
    PADDING.left + (data.length <= 1 ? 0 : (plotW * i) / (data.length - 1));
  const yAt = (v: number) => PADDING.top + plotH * (1 - v / max);

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(d.value)}`)
    .join(' ');
  const areaPath = `${linePath} L ${xAt(data.length - 1)} ${VIEW_H - PADDING.bottom} L ${xAt(0)} ${VIEW_H - PADDING.bottom} Z`;

  const handlePointerMove = (e: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || data.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * VIEW_W;
    const i = Math.round(
      ((px - PADDING.left) / plotW) * (data.length - 1)
    );
    setHoverIndex(Math.min(data.length - 1, Math.max(0, i)));
  };

  const active = hoverIndex != null ? data[hoverIndex] : null;
  const last = data[data.length - 1];

  return (
    <div className={clsx('flex flex-col gap-sm', className)}>
      <h3 className="text-body-md font-medium text-content-primary">
        {title}
      </h3>
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label={`${title}, ${data.length} days, latest ${formatDate(last.date)}: ${last.value}`}
          className="w-full cursor-crosshair"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        >
          {ticks.map((t) => {
            const y = yAt(t);
            return (
              <g key={t}>
                <line
                  x1={PADDING.left}
                  x2={VIEW_W - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke={CHART_INK.gridline}
                  strokeWidth={1}
                />
                <text x={2} y={y + 3} fontSize={9} fill={CHART_INK.muted}>
                  {t}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill={color} opacity={0.1} stroke="none" />
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* End marker: the direct label the line ends on. */}
          <circle
            cx={xAt(data.length - 1)}
            cy={yAt(last.value)}
            r={4}
            fill={color}
            stroke={CHART_INK.surface}
            strokeWidth={2}
          />

          {active && hoverIndex != null && (
            <g>
              <line
                x1={xAt(hoverIndex)}
                x2={xAt(hoverIndex)}
                y1={PADDING.top}
                y2={VIEW_H - PADDING.bottom}
                stroke={CHART_INK.muted}
                strokeWidth={1}
              />
              <circle
                cx={xAt(hoverIndex)}
                cy={yAt(active.value)}
                r={4}
                fill={color}
                stroke={CHART_INK.surface}
                strokeWidth={2}
              />
            </g>
          )}
        </svg>

        {active && hoverIndex != null && (
          <div
            className="pointer-events-none absolute top-0 flex -translate-y-1/2 flex-col gap-xxs rounded-sm border border-border-system-subtle bg-bg-surface-strong px-xs py-xxs shadow-lg"
            style={{
              left: `${(xAt(hoverIndex) / VIEW_W) * 100}%`,
              top: `${(yAt(active.value) / VIEW_H) * 100}%`,
              transform: 'translate(-50%, -130%)',
            }}
          >
            <span className="text-body-sm font-medium text-content-primary">
              {active.value}
            </span>
            <span className="text-body-sm text-content-tertiary">
              {formatDate(active.date)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
