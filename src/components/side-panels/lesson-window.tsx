import { ImagePlaceholder } from '@assets/image-placeholder';
import { BaseButton } from '@components/buttons/base-button/base-button';
import { MarkdownContent } from '@components/markdown/markdown-content';
import { RelatedCollectionCard } from '@components/cards/related-collection-card/related-collection-card';
import { Subject } from '@components/subject';
import { Skeleton } from '@components/ui/skeleton';
import {
  getFullLessonContent,
  resolveLessonImage,
  type LessonStandard,
} from '@fixtures/full-lesson-content';
import { useLaunch } from '@hooks/launch';
import { getLessonByIdOfflineAware } from '@services/lessons';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  BookOpen,
  ClipboardList,
  Download,
  Library,
  Minimize2,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Tabs } from 'radix-ui';
import {
  FC,
  PointerEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';
import { LessonLaunchCodes } from './lesson-launch-codes';
import { LaunchOption } from './lesson-side-panel-content';

type Rect = { x: number; y: number; w: number; h: number };
type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const MIN_W = 640;
const MIN_H = 480;
const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;
const STATUS_BAR_HEIGHT = 64;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

function defaultRect(): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = Math.round(vw * 0.9);
  const h = Math.round(vh * 0.9);
  return { x: Math.round((vw - w) / 2), y: Math.round((vh - h) / 2), w, h };
}

/** Keeps a rect inside the viewport and above the minimum size. */
function fitRect(rect: Rect): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = clamp(rect.w, Math.min(MIN_W, vw), vw);
  const h = clamp(rect.h, Math.min(MIN_H, vh), vh);
  return {
    w,
    h,
    x: clamp(rect.x, 0, vw - w),
    y: clamp(rect.y, 0, vh - h),
  };
}

function resizeRect(start: Rect, edge: Edge, dx: number, dy: number): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const minW = Math.min(MIN_W, vw);
  const minH = Math.min(MIN_H, vh);
  let { x, y, w, h } = start;

  if (edge.includes('e')) w = clamp(start.w + dx, minW, vw - start.x);
  if (edge.includes('s')) h = clamp(start.h + dy, minH, vh - start.y);
  if (edge.includes('w')) {
    const right = start.x + start.w;
    x = clamp(start.x + dx, 0, right - minW);
    w = right - x;
  }
  if (edge.includes('n')) {
    const bottom = start.y + start.h;
    y = clamp(start.y + dy, 0, bottom - minH);
    h = bottom - y;
  }
  return { x, y, w, h };
}

const HANDLES: { edge: Edge; className: string }[] = [
  { edge: 'n', className: '-top-1 left-3 right-3 h-2 cursor-ns-resize' },
  { edge: 's', className: '-bottom-1 left-3 right-3 h-2 cursor-ns-resize' },
  { edge: 'e', className: '-right-1 bottom-3 top-3 w-2 cursor-ew-resize' },
  { edge: 'w', className: '-left-1 bottom-3 top-3 w-2 cursor-ew-resize' },
  { edge: 'ne', className: '-right-1 -top-1 h-4 w-4 cursor-nesw-resize' },
  { edge: 'nw', className: '-left-1 -top-1 h-4 w-4 cursor-nwse-resize' },
  { edge: 'se', className: '-bottom-1 -right-1 h-4 w-4 cursor-nwse-resize' },
  { edge: 'sw', className: '-bottom-1 -left-1 h-4 w-4 cursor-nesw-resize' },
];

const TABS = [
  { value: 'lesson-plan', label: 'Lesson plan', icon: BookOpen },
  { value: 'worksheet', label: 'Worksheet', icon: ClipboardList },
  { value: 'standards', label: 'Standards & collections', icon: Library },
] as const;
type TabValue = (typeof TABS)[number]['value'];

const StandardRow: FC<{ standard: LessonStandard }> = ({ standard }) => (
  <li className="flex items-start gap-md rounded-xs border border-border-system-subtle bg-bg-surface-subtle p-sm">
    <div className="flex w-[120px] shrink-0 flex-col">
      <span className="text-body-sm font-medium text-content-primary">
        {standard.code}
      </span>
      <span className="text-body-sm text-content-tertiary">
        {standard.framework}
      </span>
      <span className="text-body-sm text-content-tertiary">
        {standard.grade}
      </span>
    </div>
    <p className="text-body-md text-content-secondary">
      {standard.description}
    </p>
  </li>
);

const DownloadPdfButton: FC<{ document: string }> = ({ document }) => (
  <div className="mb-md flex justify-end">
    <BaseButton
      color="secondary"
      size="sm"
      leftIcon={<Download className="h-4 w-4" />}
      onClick={() => toast(`Downloading ${document} as PDF`)}
    >
      Download PDF
    </BaseButton>
  </div>
);

const panelClass = 'pb-xl outline-none';

/** Fades and lifts into place each time its tab is selected (inactive tabs unmount). */
const TabPanel: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, ease: EASE_IN_OUT }}
    className={className}
  >
    {children}
  </motion.div>
);

type LessonWindowProps = {
  lessonId: string;
  /** Back to the side panel. */
  onRestore: () => void;
  /** Closes the lesson entirely. */
  onClose: () => void;
};

/**
 * The side panel grown into a window: 90% of the viewport to start, resizable
 * from every edge and corner, laid out in two columns up top and three tabs
 * below. Sizes are measured against the window itself (container queries), so
 * the layout follows the window as it is dragged, not the viewport.
 */
export const LessonWindow: FC<LessonWindowProps> = ({
  lessonId,
  onRestore,
  onClose,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: ({ signal }) => getLessonByIdOfflineAware(lessonId, signal),
  });
  const lesson = data?.lesson;
  const content = getFullLessonContent(lessonId);
  const { canLaunchLesson } = useLaunch();

  const [rect, setRect] = useState<Rect>(defaultRect);
  const [tab, setTab] = useState<TabValue>('lesson-plan');
  const [showBar, setShowBar] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const drag = useRef<{
    edge: Edge;
    startX: number;
    startY: number;
    start: Rect;
  } | null>(null);

  useEffect(() => {
    windowRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      onClose();
    };
    const onViewportResize = () => setRect((prev) => fitRect(prev));

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onViewportResize);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onViewportResize);
    };
  }, [onClose]);

  // The status bar takes over once the header has scrolled up under it. The
  // negative top margin is the bar's own height, so it appears just before
  // the header's last pixel disappears rather than after.
  useEffect(() => {
    const root = scrollRef.current;
    const header = headerRef.current;
    if (!root || !header) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting),
      { root, rootMargin: `-${STATUS_BAR_HEIGHT}px 0px 0px 0px` }
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const handleProps = (edge: Edge) => ({
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = {
        edge,
        startX: e.clientX,
        startY: e.clientY,
        start: rect,
      };
    },
    onPointerMove: (e: PointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (!d) return;
      setRect(
        resizeRect(d.start, d.edge, e.clientX - d.startX, e.clientY - d.startY)
      );
    },
    onPointerUp: (e: PointerEvent<HTMLDivElement>) => {
      drag.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    },
  });

  const launchCodes = useMemo(
    () =>
      (lesson?.apps ?? [])
        .map((a) => a.deepLinkingLaunchCode)
        .filter((code): code is string => !!code),
    [lesson]
  );

  const sortedApps = useMemo(
    () =>
      lesson
        ? [...lesson.apps].sort((a, b) => {
            const aOk = canLaunchLesson(lesson, a);
            const bOk = canLaunchLesson(lesson, b);
            return aOk === bOk ? 0 : aOk ? -1 : 1;
          })
        : [],
    [lesson, canLaunchLesson]
  );

  const [standardsQuery, setStandardsQuery] = useState('');

  const filteredStandards = useMemo(() => {
    const terms = standardsQuery.toLowerCase().split(/\s+/).filter(Boolean);
    return (content?.standards ?? []).filter((s) => {
      const haystack =
        `${s.code} ${s.description} ${s.grade} ${s.state} ${s.framework}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [content, standardsQuery]);

  const standardsByState = useMemo(() => {
    const groups = new Map<string, LessonStandard[]>();
    for (const s of filteredStandards) {
      groups.set(s.state, [...(groups.get(s.state) ?? []), s]);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredStandards]);

  const empty = (what: string) => (
    <p className="text-body-md text-content-tertiary">
      {`No ${what} is available for this lesson yet.`}
    </p>
  );

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE_IN_OUT }}
        className="fixed inset-0 z-30 bg-bg-overlay-modal"
        onPointerDown={onClose}
      />

      <motion.div
        ref={windowRef}
        role="dialog"
        aria-label={lesson ? `${lesson.name} — full view` : 'Lesson full view'}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.94, x: 72 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.94, x: 72 }}
        transition={{ duration: 0.3, ease: EASE_IN_OUT }}
        style={{
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
          transformOrigin: '100% 50%',
        }}
        className="fixed z-30 outline-none"
      >
        <div className="@container relative flex h-full flex-col overflow-hidden rounded-lg border border-border-system-subtle bg-bg-surface-default shadow-2xl">
          <AnimatePresence>
            {showBar && lesson && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.2, ease: EASE_IN_OUT }}
                style={{ height: STATUS_BAR_HEIGHT }}
                className="absolute inset-x-0 top-0 z-[8] flex items-center gap-md border-b border-border-system-subtle bg-bg-surface-default/95 pl-lg pr-[104px] backdrop-blur-sm @3xl:pl-xl"
              >
                <span className="min-w-0 flex-1 truncate text-body-lg font-medium text-content-primary">
                  {lesson.name}
                </span>
                <div className="flex shrink-0 items-center gap-xs">
                  {sortedApps.map((app) => (
                    <LaunchOption
                      key={app.id}
                      lesson={lesson}
                      app={app}
                      size="xs"
                      className="inline-flex shrink-0"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute right-md top-md z-10 flex items-center rounded-full bg-bg-surface-default/80 text-content-primary backdrop-blur-sm">
            <button
              type="button"
              onClick={onRestore}
              aria-label="Restore to side panel"
              className="icon-btn icon-btn-on-surface"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="icon-btn icon-btn-on-surface"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-lg p-lg @3xl:p-xl">
              <section
                ref={headerRef}
                className="grid gap-lg @2xl:grid-cols-[160px_minmax(0,1fr)] @2xl:items-start"
              >
                {isLoading || !lesson ? (
                  <>
                    <Skeleton className="aspect-[16/10] w-40 rounded-sm" />
                    <div className="flex flex-col gap-md">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-10 w-full rounded-full" />
                      <Skeleton className="h-5 w-1/2" />
                    </div>
                  </>
                ) : (
                  <>
                    {lesson.imageUrl ? (
                      <img
                        src={lesson.imageUrl}
                        alt={`Cover image for ${lesson.name}`}
                        className="aspect-[16/10] w-40 rounded-sm border border-border-system-subtle object-cover"
                      />
                    ) : (
                      <ImagePlaceholder className="aspect-[16/10] w-40 rounded-sm border border-border-system-subtle text-content-tertiary" />
                    )}
                    <div className="flex flex-col gap-md @2xl:pr-[72px]">
                      <h1 className="font-display text-display-sm text-content-primary">
                        {lesson.name}
                        <LessonLaunchCodes codes={launchCodes} />
                      </h1>
                      <div className="flex flex-wrap items-center gap-xs">
                        {sortedApps.map((app) => (
                          <LaunchOption key={app.id} lesson={lesson} app={app} className="inline-flex" />
                        ))}
                      </div>
                      <BaseButton
                        color="secondary"
                        size="sm"
                        leftIcon={<Plus className="h-4 w-4" />}
                        className="self-start"
                        onClick={() => toast('Added to class')}
                      >
                        Add to class
                      </BaseButton>
                      {lesson.subjects.length > 0 && (
                        <div className="flex flex-wrap items-center gap-xxs">
                          {lesson.subjects.map((subject) => (
                            <Subject key={subject.id} subject={subject} />
                          ))}
                        </div>
                      )}
                      <p className="text-body-md text-content-secondary">
                        {lesson.summary}
                      </p>
                    </div>
                  </>
                )}
              </section>

              <Tabs.Root
                value={tab}
                onValueChange={(v) => setTab(v as TabValue)}
                className="flex flex-col gap-lg"
              >
                <Tabs.List
                  aria-label="Lesson sections"
                  className="sticky top-16 z-[5] flex gap-xl border-b border-border-system-subtle bg-bg-surface-default"
                >
                  {TABS.map(({ value, label, icon: Icon }) => (
                    <Tabs.Trigger
                      key={value}
                      value={value}
                      className={clsx(
                        'relative flex cursor-pointer items-center gap-sm py-md text-body-lg font-medium outline-none transition-colors',
                        tab === value
                          ? 'text-content-primary'
                          : 'text-content-tertiary hover:text-content-primary'
                      )}
                    >
                      <Icon
                        className={clsx(
                          'h-5 w-5',
                          tab === value && 'text-content-brand-default'
                        )}
                        aria-hidden="true"
                      />
                      {label}
                      {tab === value && (
                        <motion.span
                          layoutId="lesson-window-tab-underline"
                          transition={{ duration: 0.25, ease: EASE_IN_OUT }}
                          className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-bg-surface-brand-strong"
                        />
                      )}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>

                <Tabs.Content value="lesson-plan" className={panelClass}>
                  <TabPanel>
                    {content && <DownloadPdfButton document="lesson plan" />}
                    {content ? (
                      <MarkdownContent resolveImage={resolveLessonImage}>
                        {content.lessonPlan}
                      </MarkdownContent>
                    ) : (
                      empty('lesson plan')
                    )}
                  </TabPanel>
                </Tabs.Content>

                <Tabs.Content value="worksheet" className={panelClass}>
                  <TabPanel>
                    {content && <DownloadPdfButton document="worksheet" />}
                    {content ? (
                      <MarkdownContent resolveImage={resolveLessonImage}>
                        {content.worksheet}
                      </MarkdownContent>
                    ) : (
                      empty('worksheet')
                    )}
                  </TabPanel>
                </Tabs.Content>

                <Tabs.Content value="standards" className={panelClass}>
                  <TabPanel className="flex flex-col gap-xl">
                    <section
                      aria-label="Related collections"
                      className="flex flex-col gap-md"
                    >
                      <h2 className="text-body-lg font-medium text-content-primary">
                        Related collections
                      </h2>
                      {lesson?.relatedCollections?.length
                        ? lesson.relatedCollections.map((collection) => (
                            <RelatedCollectionCard
                              key={collection.id}
                              name={collection.name}
                              lessonsCount={collection.lessonsCount}
                              onClick={() =>
                                toast(`Opening ${collection.name}`)
                              }
                            />
                          ))
                        : empty('related collection')}
                    </section>

                    <section
                      aria-label="Related standards"
                      className="flex flex-col gap-md"
                    >
                      <h2 className="text-body-lg font-medium text-content-primary">
                        {`Related standards (${content?.standards.length ?? 0})`}
                      </h2>
                      {content && (
                        <label className="flex w-full max-w-[360px] items-center gap-xs rounded-full border border-border-system-subtle bg-bg-surface-subtle px-md py-xs focus-within:border-border-system-strong">
                          <Search
                            className="h-4 w-4 shrink-0 text-content-tertiary"
                            aria-hidden="true"
                          />
                          <input
                            type="search"
                            value={standardsQuery}
                            onChange={(e) => setStandardsQuery(e.target.value)}
                            placeholder="Search by name, grade or state"
                            aria-label="Search standards"
                            className="w-full bg-transparent text-body-md text-content-primary outline-none placeholder:text-content-tertiary"
                          />
                        </label>
                      )}
                      {standardsByState.length === 0
                        ? content
                          ? (
                              <p className="text-body-md text-content-tertiary">
                                No standards match your search.
                              </p>
                            )
                          : empty('standards alignment')
                        : standardsByState.map(([state, standards]) => (
                            <div key={state} className="flex flex-col gap-xs">
                              <h3 className="text-body-md font-medium text-content-secondary">
                                {state}
                              </h3>
                              <ul className="flex flex-col gap-xs">
                                {standards.map((standard) => (
                                  <StandardRow
                                    key={standard.id}
                                    standard={standard}
                                  />
                                ))}
                              </ul>
                            </div>
                          ))}
                    </section>
                  </TabPanel>
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>
        </div>

        {HANDLES.map(({ edge, className }) => (
          <div
            key={edge}
            aria-hidden="true"
            className={clsx('absolute z-20 touch-none', className)}
            {...handleProps(edge)}
          />
        ))}
      </motion.div>
    </>
  );
};
