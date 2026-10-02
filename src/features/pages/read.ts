import Markdoc, { type RenderableTreeNode } from '@markdoc/markdoc';
import { createReader } from '@keystatic/core/reader';
import config from '../../../keystatic.config';

export type PageName = 'about' | 'privacy' | 'termsOfUse' | 'disclaimer';

export interface ContentPage {
  title: string;
  updatedAt?: string;
  /** Body rendered from Markdoc to HTML. The content comes from our own repo, edited in Keystatic. */
  html: string;
}

const reader = createReader(process.cwd(), config);

/** Reads one of the Keystatic page singletons (About, Privacy, Terms of use, Disclaimer). */
export async function readPage(name: PageName): Promise<ContentPage> {
  const page = await reader.singletons[name].read();
  if (!page) throw new Error(`Missing content page "${name}" in src/content/pages/.`);
  const { node } = await page.body();
  return {
    title: page.title,
    ...(page.updatedAt ? { updatedAt: page.updatedAt } : {}),
    html: Markdoc.renderers.html(unwrapArticle(Markdoc.transform(node))),
  };
}

/** Markdoc wraps a document in <article>; pages provide their own, so render only the contents. */
function unwrapArticle(tree: RenderableTreeNode): RenderableTreeNode | RenderableTreeNode[] {
  return Markdoc.Tag.isTag(tree) && tree.name === 'article' ? tree.children : tree;
}
