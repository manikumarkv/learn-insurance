import { describe, expect, it } from 'vitest';
import { allParentIds, buildTree, countDescendants, filterTree, visibleNodes } from './tree';

const flat = [
  { id: 'life', name: 'Life Insurance', parent: null, description: 'd' },
  { id: 'life.term', name: 'Term Life', parent: 'life', description: 'd' },
  { id: 'life.whole', name: 'Whole Life', parent: 'life', description: 'd' },
  { id: 'life.term.level', name: 'Level Term', parent: 'life.term', description: 'd' },
  { id: 'auto', name: 'Auto Insurance', parent: null, description: 'd' },
];

describe('buildTree', () => {
  it('nests children under parents and sorts by name', () => {
    const roots = buildTree(flat);
    expect(roots.map((r) => r.id)).toEqual(['auto', 'life']);
    expect(roots[1]?.children.map((c) => c.id)).toEqual(['life.term', 'life.whole']);
  });

  it('counts types at every depth below a node', () => {
    const life = buildTree(flat)[1];
    expect(life && countDescendants(life)).toBe(3);
  });
});

describe('filterTree', () => {
  it('keeps matches and their ancestors, and expands the path', () => {
    const { roots, expand } = filterTree(buildTree(flat), 'level');
    expect(roots.map((r) => r.id)).toEqual(['life']);
    expect(roots[0]?.children.map((c) => c.id)).toEqual(['life.term']);
    expect([...expand].sort()).toEqual(['life', 'life.term']);
  });

  it('returns the whole tree for an empty query', () => {
    expect(filterTree(buildTree(flat), '  ').roots).toHaveLength(2);
  });
});

describe('visibleNodes', () => {
  it('lists only expanded branches, with levels', () => {
    const roots = buildTree(flat);
    expect(visibleNodes(roots, new Set(['life'])).map((v) => `${v.level}:${v.node.id}`)).toEqual([
      '1:auto',
      '1:life',
      '2:life.term',
      '2:life.whole',
    ]);
    expect(allParentIds(roots)).toEqual(new Set(['life', 'life.term']));
  });
});

describe('rootOf and ancestorsOf', () => {
  it('finds the root line and the path down to a type', async () => {
    const { ancestorsOf, rootOf } = await import('./tree');
    const byId = new Map(flat.map((t) => [t.id, t]));
    expect(rootOf('life.term.level')).toBe('life');
    expect(ancestorsOf('life.term.level', byId)).toEqual(['life', 'life.term']);
    expect(ancestorsOf('life', byId)).toEqual([]);
  });
});
