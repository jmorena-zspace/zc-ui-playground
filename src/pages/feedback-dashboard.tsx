import { BarChart, type BarDatum } from '@components/charts/bar-chart';
import { StatTile } from '@components/charts/stat-tile';
import { TrendChart } from '@components/charts/trend-chart';
import { FeedbackDetailModal } from '@components/feedback/feedback-detail-modal';
import { RATING_SCALE, ratingIcon } from '@components/feedback/rating-scale';
import { feedbackEntries, type FeedbackEntry } from '@fixtures/feedback-entries';
import clsx from 'clsx';
import {
  ArrowLeft,
  ArrowUpDown,
  MessageSquareText,
  SmilePlus,
  Star,
  Users,
} from 'lucide-react';
import { FC, useMemo, useState } from 'react';

type SortKey = 'submittedAt' | 'appVersion' | 'page' | 'rating' | 'location';
type SortDirection = 'asc' | 'desc';
type DateRange = 7 | 30 | 90;

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = Date.parse('2026-09-28T12:00:00Z');

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

function mostCommon(values: string[]): string {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best = '—';
  let bestCount = 0;
  for (const [v, count] of counts) {
    if (count > bestCount) {
      best = v;
      bestCount = count;
    }
  }
  return best;
}

export const FeedbackDashboard: FC<{ onBack: () => void }> = ({ onBack }) => {
  const [range, setRange] = useState<DateRange>(30);
  const [ratingFilter, setRatingFilter] = useState<Set<number>>(new Set());
  const [versionFilter, setVersionFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>(
    { key: 'submittedAt', direction: 'desc' }
  );
  const [selected, setSelected] = useState<FeedbackEntry | null>(null);

  const versions = useMemo(
    () => Array.from(new Set(feedbackEntries.map((e) => e.appVersion))).sort(),
    []
  );

  const inRange = useMemo(() => {
    const cutoff = NOW - range * DAY_MS;
    return feedbackEntries.filter((e) => Date.parse(e.submittedAt) >= cutoff);
  }, [range]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inRange.filter((e) => {
      if (ratingFilter.size > 0 && !ratingFilter.has(e.rating)) return false;
      if (versionFilter !== 'all' && e.appVersion !== versionFilter)
        return false;
      if (
        q &&
        !e.page.toLowerCase().includes(q) &&
        !e.location.toLowerCase().includes(q) &&
        !e.comment.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [inRange, ratingFilter, versionFilter, search]);

  const sorted = useMemo(() => {
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sort.key === 'rating') return (a.rating - b.rating) * dir;
      if (sort.key === 'submittedAt')
        return a.submittedAt.localeCompare(b.submittedAt) * dir;
      return a[sort.key].localeCompare(b[sort.key]) * dir;
    });
  }, [filtered, sort]);

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'desc' }
    );
  };

  const toggleRating = (value: number) => {
    setRatingFilter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  // --- Reports, all scoped to the same filtered slice as the table. ---

  const avgRating = filtered.length
    ? filtered.reduce((sum, e) => sum + e.rating, 0) / filtered.length
    : 0;
  const positiveRate = filtered.length
    ? (filtered.filter((e) => e.rating >= 4).length / filtered.length) * 100
    : 0;

  const ratingData: BarDatum[] = RATING_SCALE.map((r) => ({
    label: String(r.value),
    value: filtered.filter((e) => e.rating === r.value).length,
  }));

  const topPagesData: BarDatum[] = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of filtered) counts.set(e.page, (counts.get(e.page) ?? 0) + 1);
    return Array.from(counts.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filtered]);

  const trendData = useMemo(() => {
    const days = Array.from({ length: range }, (_, i) => {
      const date = new Date(NOW - (range - 1 - i) * DAY_MS);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    });
    const counts = new Map<string, number>();
    for (const e of filtered) {
      const d = new Date(e.submittedAt);
      d.setUTCHours(0, 0, 0, 0);
      const key = d.toISOString();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return days.map((d) => ({
      date: d.toISOString(),
      value: counts.get(d.toISOString()) ?? 0,
    }));
  }, [filtered, range]);

  const columns: { key: SortKey; label: string }[] = [
    { key: 'submittedAt', label: 'Date' },
    { key: 'appVersion', label: 'App version' },
    { key: 'page', label: 'Page' },
    { key: 'rating', label: 'Rating' },
    { key: 'location', label: 'Location' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-bg-surface-default">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-lg p-lg">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit cursor-pointer items-center gap-xs text-body-md text-content-link-action-default hover:text-content-link-action-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Filters: one row, above everything they scope. */}
        <div className="flex flex-wrap items-center gap-sm">
          <div className="flex items-center rounded-full border border-border-system-subtle bg-bg-surface-subtle p-xxs">
            {([7, 30, 90] as DateRange[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setRange(d)}
                className={clsx(
                  'cursor-pointer rounded-full px-sm py-xxs text-body-sm transition-colors',
                  range === d
                    ? 'bg-bg-surface-strong text-content-primary'
                    : 'text-content-tertiary hover:text-content-primary'
                )}
              >
                {`${d}d`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-xxs rounded-full border border-border-system-subtle bg-bg-surface-subtle p-xxs">
            {RATING_SCALE.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleRating(value)}
                aria-pressed={ratingFilter.has(value)}
                aria-label={`Filter: ${label}`}
                className={clsx(
                  'flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors',
                  ratingFilter.has(value)
                    ? 'bg-bg-surface-strong text-content-primary'
                    : 'text-content-tertiary hover:text-content-primary'
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          <select
            value={versionFilter}
            onChange={(e) => setVersionFilter(e.target.value)}
            className="h-9 cursor-pointer rounded-full border border-border-system-subtle bg-bg-surface-subtle px-sm text-body-sm text-content-primary outline-none"
          >
            <option value="all">All versions</option>
            {versions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search page, location, comment…"
            className="h-9 w-56 rounded-full border border-border-input-default bg-transparent px-sm text-body-sm text-content-primary outline-none placeholder:text-content-tertiary focus:border-border-input-active"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-md md:grid-cols-4">
          <StatTile label="Responses" value={String(filtered.length)} icon={Users} />
          <StatTile
            label="Average rating"
            value={avgRating.toFixed(1)}
            icon={Star}
          />
          <StatTile
            label="Positive rate"
            value={`${Math.round(positiveRate)}%`}
            icon={SmilePlus}
          />
          <StatTile
            label="Most active page"
            value={mostCommon(filtered.map((e) => e.page))}
            icon={MessageSquareText}
          />
        </div>

        {/* Reports */}
        <div className="grid grid-cols-1 gap-md lg:grid-cols-2">
          <div className="rounded-md border border-border-system-subtle bg-bg-surface-subtle p-md">
            <BarChart title="Rating distribution" data={ratingData} />
          </div>
          <div className="rounded-md border border-border-system-subtle bg-bg-surface-subtle p-md">
            <TrendChart title="Responses over time" data={trendData} />
          </div>
          <div className="rounded-md border border-border-system-subtle bg-bg-surface-subtle p-md lg:col-span-2">
            <BarChart
              title="Top pages by feedback"
              data={topPagesData}
              orientation="horizontal"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-md border border-border-system-subtle">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border-system-subtle bg-bg-surface-subtle">
                {columns.map((col) => (
                  <th key={col.key} className="p-sm">
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="flex cursor-pointer items-center gap-xxs text-body-sm font-medium text-content-secondary hover:text-content-primary"
                    >
                      {col.label}
                      <ArrowUpDown
                        className={clsx(
                          'h-3 w-3',
                          sort.key === col.key
                            ? 'text-content-primary'
                            : 'text-content-tertiary'
                        )}
                      />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry) => {
                const Icon = ratingIcon(entry.rating);
                return (
                  <tr
                    key={entry.id}
                    tabIndex={0}
                    onClick={() => setSelected(entry)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setSelected(entry);
                    }}
                    className="cursor-pointer border-b border-border-system-subtle text-body-sm text-content-primary last:border-b-0 hover:bg-bg-surface-hover"
                  >
                    <td className="p-sm text-content-secondary">
                      {formatDate(entry.submittedAt)}
                    </td>
                    <td className="p-sm">{entry.appVersion}</td>
                    <td className="p-sm">{entry.page}</td>
                    <td className="p-sm">
                      <Icon className="h-4 w-4 text-content-tertiary" />
                    </td>
                    <td className="p-sm text-content-secondary">
                      {entry.location}
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-lg text-center text-body-sm text-content-tertiary"
                  >
                    No feedback matches these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FeedbackDetailModal entry={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
