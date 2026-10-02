import type { APIContext } from 'astro';

/** A minimal Astro context for calling an endpoint in a unit test. */
export function fakeContext(
  method: string,
  { userId = null, body, query }: { userId?: string | null; body?: unknown; query?: string } = {},
): APIContext {
  const url = new URL(`https://example.test/api/test${query ? `?${query}` : ''}`);
  const request = new Request(url, {
    method,
    ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }),
  });
  return { request, url, locals: { auth: () => ({ userId }) } } as unknown as APIContext;
}

/** Calls an endpoint and returns its status and parsed JSON. */
export async function call(
  endpoint: (context: APIContext) => Response | Promise<Response>,
  context: APIContext,
) {
  const response = await endpoint(context);
  return { status: response.status, json: (await response.json()) as Record<string, unknown> };
}
