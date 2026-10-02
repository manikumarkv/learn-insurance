/**
 * Replaces `@clerk/astro/server` when Clerk isn't configured. Nobody is signed in, so protected
 * pages still send people to /sign-in, which explains that sign-in isn't set up.
 */
import type { APIContext, MiddlewareNext } from 'astro';

type Auth = { userId: null; redirectToSignIn: () => Response };
type Handler = (auth: () => Auth, context: APIContext) => Response | undefined;

export function clerkMiddleware(handler: Handler) {
  return (context: APIContext, next: MiddlewareNext) => {
    const auth = (): Auth => ({
      userId: null,
      redirectToSignIn: () => {
        const url = new URL('/sign-in', context.url);
        url.searchParams.set('redirect_url', context.url.href);
        return context.redirect(url.pathname + url.search);
      },
    });
    return handler(auth, context) ?? next();
  };
}
