/*
 * One way to write server endpoints (story 6.3). Every endpoint:
 *  - says who may call it (`access`), checked before anything else;
 *  - validates its JSON body or query string with Zod;
 *  - returns `{ data }` on success and `{ error: { code, message, details? } }` on failure.
 *
 * Write the endpoint in its feature folder (e.g. src/features/saved-terms/api.ts, tested in api.test.ts)
 * and serve it from src/pages/api/ with `export const prerender = false`.
 */
import type { APIContext, APIRoute } from 'astro';
import { z } from 'zod';
import { getDb, type Db } from '../db/client';

export type ErrorCode =
  'unauthenticated' | 'forbidden' | 'invalid_request' | 'not_found' | 'internal_error';

export interface ApiError {
  error: { code: ErrorCode; message: string; details?: unknown };
}

export function ok<T>(data: T, status = 200): Response {
  return Response.json({ data }, { status });
}

export function fail(
  status: number,
  code: ErrorCode,
  message: string,
  details?: unknown,
): Response {
  const body: ApiError = {
    error: { code, message, ...(details === undefined ? {} : { details }) },
  };
  return Response.json(body, { status });
}

/** Who may call the endpoint. `admin` arrives with story 6.5. */
export type Access = 'public' | 'user';

interface Auth {
  userId: string | null;
}

/**
 * The signed-in user, from Clerk's middleware. Without Clerk keys (CI, fresh clones) there is
 * no `auth` on locals, so nobody is signed in.
 */
export function getAuth(context: Pick<APIContext, 'locals'>): Auth {
  const locals = context.locals as { auth?: () => Auth };
  return { userId: locals.auth?.().userId ?? null };
}

type Input<S extends z.ZodType | undefined> = S extends z.ZodType ? z.infer<S> : undefined;

export interface RouteOptions<A extends Access, S extends z.ZodType | undefined> {
  access: A;
  /** Validates the JSON body (POST, PUT, PATCH, DELETE) or the query string (GET). */
  input?: S;
  handler: (args: {
    input: Input<S>;
    userId: A extends 'user' ? string : string | null;
    db: Db;
    context: APIContext;
  }) => Promise<Response>;
}

async function readInput(context: APIContext): Promise<unknown> {
  if (context.request.method === 'GET') {
    return Object.fromEntries(context.url.searchParams);
  }
  const text = await context.request.text();
  return text ? JSON.parse(text) : {};
}

export function route<A extends Access, S extends z.ZodType | undefined = undefined>(
  options: RouteOptions<A, S>,
): APIRoute {
  return async (context) => {
    const { userId } = getAuth(context);
    if (options.access === 'user' && !userId) {
      return fail(401, 'unauthenticated', 'Sign in to do this.');
    }

    let input: unknown;
    if (options.input) {
      let raw: unknown;
      try {
        raw = await readInput(context);
      } catch {
        return fail(400, 'invalid_request', 'The request body is not valid JSON.');
      }
      const parsed = options.input.safeParse(raw);
      if (!parsed.success) {
        return fail(
          400,
          'invalid_request',
          'Some fields are missing or wrong.',
          z.flattenError(parsed.error).fieldErrors,
        );
      }
      input = parsed.data;
    }

    try {
      return await options.handler({
        input: input as Input<S>,
        userId: userId as A extends 'user' ? string : string | null,
        db: getDb(),
        context,
      });
    } catch (error) {
      // TODO(edge-cases): send unexpected errors to error tracking once there is one.
      console.error(error);
      return fail(500, 'internal_error', 'Something went wrong on our side. Please try again.');
    }
  };
}
