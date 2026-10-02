import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { allParentIds, countDescendants, filterTree, visibleNodes, type TypeNode } from './tree';

interface Props {
  roots: TypeNode[];
  total: number;
}

/**
 * Expandable tree of insurance types (WAI-ARIA tree pattern):
 * ↑/↓ move, → opens or goes to the first child, ← closes or goes to the parent,
 * Home/End jump, Enter or Space shows the type in the side panel.
 */
export function TypesTree({ roots, total }: Props) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | undefined>(roots[0]?.id);
  const [focusId, setFocusId] = useState<string | undefined>(roots[0]?.id);
  const itemRefs = useRef(new Map<string, HTMLElement>());

  const filtered = useMemo(() => filterTree(roots, query), [roots, query]);
  const open = useMemo(
    () => (query.trim() ? new Set([...expanded, ...filtered.expand]) : expanded),
    [expanded, filtered, query],
  );
  const visible = useMemo(() => visibleNodes(filtered.roots, open), [filtered, open]);
  const byId = useMemo(() => {
    const m = new Map<string, TypeNode>();
    const walk = (n: TypeNode) => {
      m.set(n.id, n);
      n.children.forEach(walk);
    };
    roots.forEach(walk);
    return m;
  }, [roots]);
  const selected = selectedId ? byId.get(selectedId) : undefined;
  const activeId = visible.some((v) => v.node.id === focusId) ? focusId : visible[0]?.node.id;

  function toggle(id: string, value?: boolean) {
    setExpanded((prev) => {
      const next = new Set(prev);
      const isOpen = value ?? !next.has(id);
      if (isOpen) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function focus(id: string | undefined) {
    if (!id) return;
    setFocusId(id);
    itemRefs.current.get(id)?.focus();
  }

  function onKeyDown(e: KeyboardEvent, index: number) {
    const current = visible[index];
    if (!current) return;
    const { node, parentId } = current;
    const hasChildren = node.children.length > 0;
    const isOpen = open.has(node.id);
    const keys: Record<string, () => void> = {
      ArrowDown: () => focus(visible[index + 1]?.node.id),
      ArrowUp: () => focus(visible[index - 1]?.node.id),
      Home: () => focus(visible[0]?.node.id),
      End: () => focus(visible[visible.length - 1]?.node.id),
      ArrowRight: () => {
        if (hasChildren && !isOpen) toggle(node.id, true);
        else if (hasChildren) focus(node.children[0]?.id);
      },
      ArrowLeft: () => {
        if (hasChildren && isOpen) toggle(node.id, false);
        else focus(parentId);
      },
      Enter: () => setSelectedId(node.id),
      ' ': () => setSelectedId(node.id),
    };
    const action = keys[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  }

  function renderNodes(nodes: TypeNode[], level: number) {
    return nodes.map((node) => {
      const index = visible.findIndex((v) => v.node.id === node.id);
      const hasChildren = node.children.length > 0;
      const isOpen = open.has(node.id);
      const isSelected = node.id === selectedId;
      return (
        <li
          key={node.id}
          role="treeitem"
          aria-labelledby={`type-label-${node.id}`}
          aria-level={level}
          aria-expanded={hasChildren ? isOpen : undefined}
          aria-selected={isSelected}
          tabIndex={node.id === activeId ? 0 : -1}
          ref={(el) => {
            if (el) itemRefs.current.set(node.id, el);
            else itemRefs.current.delete(node.id);
          }}
          onKeyDown={(e) => {
            if (e.target === e.currentTarget) onKeyDown(e, index);
          }}
          onFocus={(e) => {
            if (e.target === e.currentTarget) setFocusId(node.id);
          }}
          className="list-none rounded-md outline-none"
        >
          <div
            className={[
              'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1',
              isSelected ? 'bg-primary text-on-primary' : 'hover:bg-surface-sunken',
            ].join(' ')}
            onClick={() => {
              setSelectedId(node.id);
              setFocusId(node.id);
              if (hasChildren) toggle(node.id);
            }}
          >
            <span className="flex size-5 flex-none items-center justify-center" aria-hidden="true">
              {hasChildren && <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} size={18} />}
            </span>
            <span id={`type-label-${node.id}`} className="flex-1">
              {node.name}
            </span>
            {hasChildren && <span className="text-label-sm">{countDescendants(node)}</span>}
          </div>
          {hasChildren && isOpen && (
            <ul role="group" className="m-0 ml-5 p-0">
              {renderNodes(node.children, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="ui-field min-w-0 flex-1">
            <label className="ui-label" htmlFor="types-filter">
              Filter types
            </label>
            <input
              id="types-filter"
              className="ui-input ui-input-sm"
              type="search"
              placeholder="e.g. cyber, flood, term life"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={() => setExpanded(allParentIds(roots))}>
            Expand all
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setExpanded(new Set())}>
            Collapse all
          </Button>
        </div>
        <p className="text-body-sm text-ink-muted m-0" role="status">
          {query.trim()
            ? `${visible.length} shown for “${query.trim()}”`
            : `${total} insurance types`}
        </p>
        <ul role="tree" aria-label="Insurance types" className="m-0 p-0">
          {renderNodes(filtered.roots, 1)}
        </ul>
      </div>

      <aside aria-live="polite" className="lg:sticky lg:top-4 lg:self-start">
        {selected && (
          <div className="ui-card flex flex-col gap-3">
            <h2 className="text-title-md m-0">{selected.name}</h2>
            <p className="text-body m-0">{selected.description}</p>
            {selected.example && (
              <p className="text-body-sm m-0">
                <strong>Example: </strong>
                {selected.example}
              </p>
            )}
            {selected.children.length > 0 && (
              <p className="text-body-sm text-ink-muted m-0">
                {countDescendants(selected)} types below this one
              </p>
            )}
            <a
              href={`/types/${selected.id}`}
              className="ui-btn ui-btn-primary ui-btn-sm self-start"
            >
              Open {selected.name}
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}
