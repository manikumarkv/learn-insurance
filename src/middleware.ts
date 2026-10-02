import { clerkMiddleware } from '@clerk/astro/server';
import { isAdmin } from './lib/api/admin';

const startsWith = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

/** Pages only signed-in people can open. Others go to /sign-in and come back after. */
const PROTECTED = ['/account', '/admin'];
/** Pages only admins can open (story 6.5). Signed-in people who aren't admins get a 403. */
const ADMIN_ONLY = ['/admin'];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED.some((p) => startsWith(pathname, p));
}

export function isAdminPath(pathname: string): boolean {
  return ADMIN_ONLY.some((p) => startsWith(pathname, p));
}

// Runs only for pages rendered on request (`export const prerender = false`).
// Static pages skip it, so they stay fast and need no keys at build time.
// Admin APIs check the role themselves with route({ access: 'admin' }).
export const onRequest = clerkMiddleware(async (auth, context, next) => {
  const { userId, redirectToSignIn } = auth();
  const { pathname } = context.url;
  if (!userId && isProtectedPath(pathname)) {
    return redirectToSignIn();
  }
  if (isAdminPath(pathname) && !(await isAdmin(context, userId))) {
    return context.rewrite('/403');
  }
  return next();
});
