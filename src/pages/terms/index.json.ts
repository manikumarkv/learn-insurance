import type { APIRoute } from 'astro';
import { glossaryItems } from '../../features/glossary/items';

/** Static JSON for the Terms A–Z page, built once and cached by the browser. */
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await glossaryItems()), {
    headers: { 'Content-Type': 'application/json' },
  });
