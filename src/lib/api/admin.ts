import { clerkClient } from '@clerk/astro/server';
import type { APIContext } from 'astro';

/**
 * Admins are Clerk users with `{ "role": "admin" }` in their public metadata (story 6.5).
 * Set it in the Clerk dashboard: Users → the user → Metadata → Public.
 */
export async function isAdmin(context: APIContext, userId: string | null): Promise<boolean> {
  if (!userId) return false;
  const user = await clerkClient(context).users.getUser(userId);
  return (user.publicMetadata as { role?: unknown } | null)?.role === 'admin';
}
