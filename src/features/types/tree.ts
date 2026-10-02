/** A node in the insurance types tree. Children are sorted by name. */
export interface TypeNode {
  id: string;
  name: string;
  description: string;
  example?: string;
  children: TypeNode[];
}

export interface FlatType {
  id: string;
  name: string;
  parent?: string | null;
  description: string;
  example?: string;
}

/** Builds the tree from flat types. Types whose parent is missing become roots. */
export function buildTree(types: FlatType[]): TypeNode[] {
  const nodes = new Map<string, TypeNode>();
  for (const t of types) {
    nodes.set(t.id, {
      id: t.id,
      name: t.name,
      description: t.description,
      ...(t.example ? { example: t.example } : {}),
      children: [],
    });
  }
  const roots: TypeNode[] = [];
  for (const t of types) {
    const node = nodes.get(t.id);
    if (!node) continue;
    const parent = t.parent ? nodes.get(t.parent) : undefined;
    (parent ? parent.children : roots).push(node);
  }
  const sort = (list: TypeNode[]) => {
    list.sort((a, b) => a.name.localeCompare(b.name, 'en'));
    list.forEach((n) => sort(n.children));
  };
  sort(roots);
  return roots;
}

/** Number of types below a node, at any depth. */
export function countDescendants(node: TypeNode): number {
  return node.children.reduce((sum, c) => sum + 1 + countDescendants(c), 0);
}

/**
 * Keeps nodes whose name matches the query, plus their ancestors so the match stays in context.
 * Returns the filtered tree and the IDs that should be expanded to show every match.
 */
export function filterTree(
  roots: TypeNode[],
  query: string,
): { roots: TypeNode[]; expand: Set<string> } {
  const q = query.trim().toLowerCase();
  const expand = new Set<string>();
  if (!q) return { roots, expand };
  const walk = (node: TypeNode): TypeNode | null => {
    const children = node.children.map(walk).filter((c): c is TypeNode => c !== null);
    const matches = node.name.toLowerCase().includes(q);
    if (!matches && children.length === 0) return null;
    if (children.length > 0) expand.add(node.id);
    return { ...node, children };
  };
  return { roots: roots.map(walk).filter((n): n is TypeNode => n !== null), expand };
}

/** IDs of every node with children, for "Expand all". */
export function allParentIds(roots: TypeNode[]): Set<string> {
  const ids = new Set<string>();
  const walk = (n: TypeNode) => {
    if (n.children.length) ids.add(n.id);
    n.children.forEach(walk);
  };
  roots.forEach(walk);
  return ids;
}

/** Visible nodes in display order, for keyboard navigation. */
export function visibleNodes(
  roots: TypeNode[],
  expanded: Set<string>,
): { node: TypeNode; level: number; parentId?: string }[] {
  const out: { node: TypeNode; level: number; parentId?: string }[] = [];
  const walk = (n: TypeNode, level: number, parentId?: string) => {
    out.push({ node: n, level, parentId });
    if (expanded.has(n.id)) n.children.forEach((c) => walk(c, level + 1, n.id));
  };
  roots.forEach((r) => walk(r, 1));
  return out;
}

/** The root line of a type ID, e.g. "life.term.level" → "life". Root IDs are the line IDs. */
export function rootOf(id: string): string {
  return id.split('.')[0] ?? id;
}

/** Ancestors from the root down to (not including) the type itself. */
export function ancestorsOf<T extends { parent?: string | null }>(
  id: string,
  byId: Map<string, T>,
): string[] {
  const out: string[] = [];
  let parent = byId.get(id)?.parent;
  while (parent && !out.includes(parent)) {
    out.unshift(parent);
    parent = byId.get(parent)?.parent;
  }
  return out;
}
