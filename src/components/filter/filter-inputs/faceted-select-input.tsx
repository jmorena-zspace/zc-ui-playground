import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useLayoutEffect, useRef, useState } from 'react';
import { ClearButton } from '../buttons/clear-button';
import { FilterButton } from '../buttons/filter-button';
import { FilterCheckbox } from '../inputs/checkbox';
import { FilterDropdown } from '../inputs/dropdown';
import { FilterQueryInput, useFilterQuery } from '../inputs/query-input';

export type FacetNode = {
  value: string;
  label: string;
  children?: FacetNode[];
};

export type FacetedSelectInputProps = {
  title: string;
  tree: FacetNode[];
  /** Leaf values that are selected. Parents derive their state from these. */
  selected: string[];
  onSelectedChange: (selected: string[]) => void;
};

/** Every selectable value at or under `node`, so a parent can toggle its subtree. */
function leavesOf(node: FacetNode): string[] {
  if (!node.children?.length) return [node.value];
  return node.children.flatMap(leavesOf);
}

type Match = { node: FacetNode; ancestors: FacetNode[] };

/** Depth-first walk, so a query reaches options nested under other options. */
function searchTree(
  nodes: FacetNode[],
  query: string,
  ancestors: FacetNode[] = []
): Match[] {
  const found: Match[] = [];
  for (const node of nodes) {
    if (node.label.toLowerCase().includes(query)) found.push({ node, ancestors });
    if (node.children?.length) {
      found.push(...searchTree(node.children, query, [...ancestors, node]));
    }
  }
  return found;
}

export function FacetedSelectInput({
  title,
  tree,
  selected,
  onSelectedChange,
}: FacetedSelectInputProps) {
  const filterQuery = useFilterQuery();
  // The levels drilled into, root first. Rendered side by side and slid.
  const [path, setPath] = useState<FacetNode[]>([]);
  const chosen = new Set(selected);

  const query = filterQuery.query.trim().toLowerCase();
  const matches = query ? searchTree(tree, query) : [];

  const levels: { parent: FacetNode | null; nodes: FacetNode[] }[] = [
    { parent: null, nodes: tree },
    ...path.map((node) => ({ parent: node, nodes: node.children ?? [] })),
  ];
  const current = levels[levels.length - 1];

  const viewport = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const results = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  // The panels are different heights, so the viewport follows the one in view.
  // Measuring only the height is safe here: the width comes from the dropdown
  // and never depends on what this measures.
  useLayoutEffect(() => {
    const shown = query ? results.current : panels.current[levels.length - 1];
    if (shown) setHeight(shown.offsetHeight);
  }, [levels.length, path, query, selected]);

  const stateOf = (node: FacetNode) => {
    const leaves = leavesOf(node);
    const hit = leaves.filter((leaf) => chosen.has(leaf)).length;
    return {
      checked: hit > 0 && hit === leaves.length,
      partial: hit > 0 && hit < leaves.length,
    };
  };

  const toggle = (node: FacetNode) => {
    const leaves = leavesOf(node);
    const { checked } = stateOf(node);
    const next = new Set(chosen);
    for (const leaf of leaves) {
      if (checked) next.delete(leaf);
      else next.add(leaf);
    }
    onSelectedChange([...next]);
  };

  /** Clears what is on screen — this level, or the search results — not everything. */
  const visibleNodes = query ? matches.map((match) => match.node) : current.nodes;
  const visibleLeaves = visibleNodes.flatMap(leavesOf);
  const clearableCount = visibleLeaves.filter((leaf) => chosen.has(leaf)).length;

  const clearVisible = () => {
    const next = new Set(chosen);
    for (const leaf of visibleLeaves) next.delete(leaf);
    onSelectedChange([...next]);
  };

  const Row = ({
    node,
    breadcrumb,
  }: {
    node: FacetNode;
    breadcrumb?: string;
  }) => {
    const { checked, partial } = stateOf(node);
    const hasChildren = !!node.children?.length;

    return (
      <div className="flex items-center gap-xxs rounded-xs hover:bg-bg-surface-hover">
        {/* The checkbox is the only thing that selects. */}
        <button
          type="button"
          role="menuitemcheckbox"
          aria-checked={partial ? 'mixed' : checked}
          aria-label={node.label}
          onClick={() => toggle(node)}
          className="shrink-0 cursor-pointer rounded-xs p-xs outline-none focus-visible:bg-bg-surface-selected"
        >
          <FilterCheckbox checked={checked} partial={partial} label="" />
        </button>

        {/* Clicking the option drills into it. */}
        <button
          type="button"
          data-nav-item
          disabled={!hasChildren}
          aria-label={hasChildren ? `Open ${node.label}` : node.label}
          onClick={() => hasChildren && setPath((c) => [...c, node])}
          className={clsx(
            'flex min-w-0 flex-1 items-center gap-xs py-xs pr-xs text-left outline-none',
            hasChildren ? 'cursor-pointer' : 'cursor-default'
          )}
        >
          <span className="min-w-0 flex-1">
            <span className="block text-body-md font-regular text-content-primary">
              {node.label}
            </span>
            {breadcrumb && (
              <span className="block truncate text-body-sm text-content-tertiary">
                {breadcrumb}
              </span>
            )}
          </span>
          {hasChildren && (
            <ChevronRight className="h-4 w-4 shrink-0 text-content-primary" />
          )}
        </button>
      </div>
    );
  };

  return (
    <FilterDropdown
      variant="menu"
      renderTrigger={(isOpen) => (
        <FilterButton
          rightIcon={
            <ChevronDown
              className={clsx(
                'h-4 w-4 transition-transform duration-200 ease-in-out',
                { 'rotate-180': isOpen }
              )}
            />
          }
          active={isOpen}
        >
          <span>{title}</span>
          {selected.length > 0 && <span> ({selected.length})</span>}
        </FilterButton>
      )}
      fixedSection={
        clearableCount > 0 && (
          <ClearButton onClick={clearVisible}>Clear</ClearButton>
        )
      }
    >
      {/* Outside the sliding track: the search covers the whole tree, so it
          stays put however deep you are. */}
      <FilterDropdown.Section>
        <FilterQueryInput
          value={filterQuery.input}
          onChange={filterQuery.onChange}
          onClear={filterQuery.clear}
        />
      </FilterDropdown.Section>

      <div
        ref={viewport}
        className="overflow-hidden transition-[height] duration-250 ease-in-out"
        style={{ height }}
      >
        {query ? (
          <div ref={results} role="group" aria-label={`${title} search results`}>
            {matches.map((match) => (
              <Row
                key={[...match.ancestors, match.node]
                  .map((n) => n.value)
                  .join('/')}
                node={match.node}
                breadcrumb={match.ancestors.map((n) => n.label).join(' › ')}
              />
            ))}
            {matches.length === 0 && (
              <p className="p-xs text-body-md text-content-secondary">
                {`No options match “${filterQuery.query.trim()}”`}
              </p>
            )}
          </div>
        ) : (
          <div
            className="flex transition-transform duration-250 ease-in-out"
            style={{ transform: `translateX(-${(levels.length - 1) * 100}%)` }}
          >
            {levels.map((level, index) => {
              const isCurrent = index === levels.length - 1;
              return (
                <div
                  key={level.parent?.value ?? '__root'}
                  ref={(node) => {
                    panels.current[index] = node;
                  }}
                  // Panels out of view stay mounted for the slide, but are
                  // kept out of the tab order.
                  inert={!isCurrent}
                  aria-hidden={!isCurrent}
                  className="w-full shrink-0 basis-full self-start"
                >
                  {level.parent && (
                    <button
                      type="button"
                      onClick={() => setPath((c) => c.slice(0, -1))}
                      className="flex w-full cursor-pointer items-center gap-xs rounded-xs p-xs text-left hover:bg-bg-surface-hover focus-visible:bg-bg-surface-hover focus-visible:outline-none"
                    >
                      <ChevronLeft className="h-4 w-4 shrink-0 text-content-primary" />
                      <span className="truncate text-body-md font-medium text-content-primary">
                        {level.parent.label}
                      </span>
                    </button>
                  )}

                  <div role="group" aria-label={level.parent?.label ?? title}>
                    {level.nodes.map((node) => (
                      <Row key={node.value} node={node} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FilterDropdown>
  );
}
