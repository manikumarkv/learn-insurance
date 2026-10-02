import { clerkMiddleware } from '@clerk/astro/server';

/** Pages only signed-in people can open. Others go to /sign-in and come back after. */
const PROTECTED = ['/account'];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

// Runs only for pages rendered on request (`export const prerender = false`).
// Static pages skip it, so they stay fast and need no keys at build time.
export const onRequest = clerkMiddleware((auth, context) => {
  const { userId, redirectToSignIn } = auth();
  if (!userId && isProtectedPath(context.url.pathname)) {
    return redirectToSignIn();
  }
});
