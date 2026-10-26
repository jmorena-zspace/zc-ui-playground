import clsx from 'clsx';
import { FC, useState } from 'react';
import { CHART_INK, SEQUENTIAL_HUE } from './palette';

export type BarDatum = {
  label: string;
  value: number;
};

type BarChartProps = {
  title: string;
  data: BarDatum[];
  orientation?: 'vertical' | 'horizontal';
  color?: string;
  valueFormatter?: (value: number) => string;
  className?: string;
};

const VIEW_W = 480;
const VIEW_H = 220;
const BAR_THICKNESS = 24;

/** Rounds a max value up to a clean tick step (…10, 20, 25, 50, 100…). */
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

/**
 * A single-hue magnitude chart — one series (a count), so one color, no
 * legend. Each bar is its own hover/focus hit target with a tooltip; the
 * value also sits directly at the bar's tip as a sparing label.
 */
export const BarChart: FC<BarChartProps> = ({
  title,
  data,
  orientation = 'vertical',
  color = SEQUENTIAL_HUE,
  valueFormatter = (v) => v.toLocaleString(),
  className,
}) => {
  const [active, setActive] = useState<number | null>(null);
  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));

  const padding =
    orientation === 'vertical'
      ? { top: 24, right: 8, bottom: 28, left: 8 }
      : { top: 8, right: 40, bottom: 8, left: 96 };
  const plotW = VIEW_W - padding.left - padding.right;
  const plotH = VIEW_H - padding.top - padding.bottom;
  const band = orientation === 'vertical' ? plotW / data.length : plotH / data.length;

  return (
    <div className={clsx('flex flex-col gap-sm', className)}>
      <h3 className="text-body-md font-medium text-content-primary">
        {title}
      </h3>
      <div className="relative">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label={`${title}: ${data
            .map((d) => `${d.label} ${valueFormatter(d.value)}`)
            .join(', ')}`}
          className="w-full"
        >
          {/* Gridlines: hairline, recessive, rounded tick values. */}
          {orientation === 'vertical'
            ? ticks.map((t) => {
                const y = padding.top + plotH * (1 - t / max);
                return (
                  <g key={t}>
                    <line
                      x1={padding.left}
                      x2={VIEW_W - padding.right}
                      y1={y}
                      y2={y}
                      stroke={CHART_INK.gridline}
                      strokeWidth={1}
                    />
                    <text
                      x={padding.left}
                      y={y - 4}
                      fontSize={9}
                      fill={CHART_INK.muted}
                    >
                      {t.toLocaleString()}
                    </text>
                  </g>
                );
              })
            : ticks.map((t) => {
                const x = padding.left + plotW * (t / max);
                return (
                  <line
                    key={t}
                    x1={x}
                    x2={x}
                    y1={padding.top}
                    y2={VIEW_H - padding.bottom}
                    stroke={CHART_INK.gridline}
                    strokeWidth={1}
                  />
                );
              })}

          {data.map((d, i) => {
            const isActive = active === i;
            const fill = isActive ? color : `color-mix(in srgb, ${color} 82%, transparent)`;

            if (orientation === 'vertical') {
              const barH = max === 0 ? 0 : (d.value / max) * plotH;
              const cx = padding.left + band * i + band / 2;
              const barW = Math.min(BAR_THICKNESS, band * 0.6);
              const x = cx - barW / 2;
              const y = VIEW_H - padding.bottom - barH;
              return (
                <g
                  key={d.label}
                  tabIndex={0}
                  role="button"
                  aria-label={`${d.label}: ${valueFormatter(d.value)}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="cursor-pointer outline-none"
                >
                  {/* Hit target wider than the bar itself. */}
                  <rect
                    x={padding.left + band * i}
                    y={padding.top}
                    width={band}
                    height={plotH}
                    fill="transparent"
                  />
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={Math.max(barH, 1)}
                    rx={4}
                    fill={fill}
                    style={{ transition: 'fill 150ms ease-out' }}
                  />
                  <text
                    x={cx}
                    y={y - 6}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={600}
                    fill={CHART_INK.secondary}
                    opacity={isActive ? 1 : 0}
                    style={{ transition: 'opacity 150ms ease-out' }}
                  >
                    {valueFormatter(d.value)}
                  </text>
                  <text
                    x={cx}
                    y={VIEW_H - padding.bottom + 16}
                    textAnchor="middle"
                    fontSize={10}
                    fill={CHART_INK.secondary}
                  >
                    {d.label}
                  </text>
                </g>
              );
            }

            const barW = max === 0 ? 0 : (d.value / max) * plotW;
            const cy = padding.top + band * i + band / 2;
            const barH = Math.min(BAR_THICKNESS, band * 0.6);
            const y = cy - barH / 2;
            return (
              <g
                key={d.label}
                tabIndex={0}
                role="button"
                aria-label={`${d.label}: ${valueFormatter(d.value)}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="cursor-pointer outline-none"
              >
                <rect
                  x={0}
                  y={padding.top + band * i}
                  width={VIEW_W}
                  height={band}
                  fill="transparent"
                />
                <text
                  x={padding.left - 8}
                  y={cy + 3}
                  textAnchor="end"
                  fontSize={10}
                  fill={CHART_INK.secondary}
                >
                  {d.label}
                </text>
                <rect
                  x={padding.left}
                  y={y}
                  width={Math.max(barW, 1)}
                  height={barH}
                  rx={4}
                  fill={fill}
                  style={{ transition: 'fill 150ms ease-out' }}
                />
                <text
                  x={padding.left + barW + 6}
                  y={cy + 3}
                  fontSize={10}
                  fontWeight={600}
                  fill={CHART_INK.secondary}
                >
                  {valueFormatter(d.value)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
