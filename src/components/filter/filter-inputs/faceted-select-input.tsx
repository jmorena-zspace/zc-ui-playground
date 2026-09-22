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

  const levels: { parent: FacetNode | null; nodes: FacetNode[] }[] = [
    { parent: null, nodes: tree },
    ...path.map((node) => ({ parent: node, nodes: node.children ?? [] })),
  ];

  const viewport = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const [height, setHeight] = useState<number>();

  // The panels are different heights, so the viewport follows the one in view.
  // Measuring only the height is safe here: the width comes from the dropdown
  // and never depends on what this measures.
  useLayoutEffect(() => {
    const panel = panels.current[levels.length - 1];
    if (panel) setHeight(panel.offsetHeight);
  }, [levels.length, path, filterQuery.query]);

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

  const appliedCount = selected.length;
  const query = filterQuery.query.trim().toLowerCase();

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
          {appliedCount > 0 && <span> ({appliedCount})</span>}
        </FilterButton>
      )}
      fixedSection={
        appliedCount > 0 && (
          <ClearButton onClick={() => onSelectedChange([])}>Clear</ClearButton>
        )
      }
    >
      <div
        ref={viewport}
        className="overflow-hidden transition-[height] duration-250 ease-in-out"
        style={{ height }}
      >
        <div
          className="flex transition-transform duration-250 ease-in-out"
          style={{ transform: `translateX(-${(levels.length - 1) * 100}%)` }}
        >
          {levels.map((level, index) => {
            const isCurrent = index === levels.length - 1;
            const nodes = level.parent
              ? level.nodes
              : level.nodes.filter((node) =>
                  node.label.toLowerCase().includes(query)
                );

            return (
              <div
                key={level.parent?.value ?? '__root'}
                ref={(node) => {
                  panels.current[index] = node;
                }}
                // Only the panel in view takes part in tab order; the others
                // are off to the side but still in the DOM for the slide.
                inert={!isCurrent}
                aria-hidden={!isCurrent}
                className="w-full shrink-0 basis-full self-start"
              >
                {level.parent ? (
                  <button
                    type="button"
                    onClick={() => setPath((current) => current.slice(0, -1))}
                    className="flex w-full cursor-pointer items-center gap-xs rounded-xs p-xs text-left hover:bg-bg-surface-hover focus-visible:bg-bg-surface-hover focus-visible:outline-none"
                  >
                    <ChevronLeft className="h-4 w-4 shrink-0 text-content-primary" />
                    <span className="truncate text-body-md font-medium text-content-primary">
                      {level.parent.label}
                    </span>
                  </button>
                ) : (
                  <FilterDropdown.Section>
                    <FilterQueryInput
                      value={filterQuery.input}
                      onChange={filterQuery.onChange}
                      onClear={filterQuery.clear}
                    />
                  </FilterDropdown.Section>
                )}

                <div role="group" aria-label={level.parent?.label ?? title}>
                  {nodes.map((node) => {
                    const { checked, partial } = stateOf(node);
                    const hasChildren = !!node.children?.length;

                    return (
                      <div
                        key={node.value}
                        className="flex items-center gap-xxs rounded-xs pr-xs hover:bg-bg-surface-hover"
                      >
                        <button
                          type="button"
                          role="menuitemcheckbox"
                          aria-checked={partial ? 'mixed' : checked}
                          data-nav-item
                          onClick={() => toggle(node)}
                          className="flex min-w-0 flex-1 cursor-pointer items-center gap-xs p-xs text-left outline-none"
                        >
                          <FilterCheckbox
                            checked={checked}
                            partial={partial}
                            label={node.label}
                          />
                        </button>

                        {hasChildren && (
                          <button
                            type="button"
                            aria-label={`Open ${node.label}`}
                            onClick={() =>
                              setPath((current) => [...current, node])
                            }
                            className="shrink-0 cursor-pointer rounded-xs p-xxs text-content-primary outline-none hover:bg-bg-surface-selected focus-visible:bg-bg-surface-selected"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FilterDropdown>
  );
}
